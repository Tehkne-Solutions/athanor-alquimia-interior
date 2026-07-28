import { z } from 'zod';
import { continuousReceivedHydrationPolicy } from '../content/continuousReceivedHydration';
import {
  cloneContinuousReceivedRegistry,
  validateContinuousReceivedRegistryChronology,
  type ContinuousReceivedRegistry
} from '../domain/continuousReceive';
import { validateContinuousInertJson } from '../domain/continuousInertJson';
import { parseContinuousCollectionShareWithConsistency } from '../domain/continuousReceiveConsistency';

const passageSummarySchema = z.object({
  completed: z.number(),
  passed: z.number(),
  pending: z.number()
}).strict();

const shareItemSchema = z.object({
  position: z.number(),
  kind: z.enum(['trail', 'theme-cycle']),
  startPoint: z.enum(['word', 'water', 'fire', 'earth', 'spirit', 'rest']),
  themeId: z.string().optional(),
  noTheme: z.boolean(),
  variantId: z.string(),
  packageId: z.string().optional(),
  packageLabel: z.string().optional(),
  status: z.enum(['active', 'paused', 'completed', 'declined', 'incomplete', 'unknown']),
  depth: z.number().optional(),
  endedEarly: z.boolean(),
  passageSummary: passageSummarySchema,
  occurredAt: z.string().optional(),
  completedAt: z.string().optional()
}).strict();

const consistencySchema = z.object({
  version: z.literal('1.0.0'),
  algorithm: z.literal('fnv1a-32'),
  scope: z.literal('top-level-without-consistency'),
  checksum: z.string(),
  cryptographic: z.literal(false),
  authenticatesIdentity: z.literal(false)
}).strict();

const sharePackageSchema = z.object({
  schema: z.literal('athanor-continuous-collection-share-v1'),
  policy: z.literal('explicit-consent-minimized-local-export-v1'),
  catalogVersion: z.string(),
  generatedAt: z.string(),
  provenance: z.object({
    product: z.literal('Athanor — Alquimia Interior'),
    author: z.literal('Tehkné Solutions'),
    transmission: z.literal('manual-local-file')
  }).strict(),
  collection: z.object({
    templateId: z.string(),
    label: z.string(),
    status: z.enum(['active', 'archived']),
    itemCount: z.number()
  }).strict(),
  options: z.object({ includeDates: z.boolean() }).strict(),
  items: z.array(shareItemSchema),
  notices: z.array(z.string()),
  consistency: consistencySchema.optional()
}).strict();

const receivedRecordSchema = z.object({
  id: z.string(),
  fingerprint: z.string(),
  status: z.enum(['active', 'archived']),
  package: sharePackageSchema,
  receivedAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional()
}).strict();

const registrySchema = z.object({
  id: z.string(),
  catalogVersion: z.string(),
  records: z.array(receivedRecordSchema),
  createdAt: z.string(),
  updatedAt: z.string()
}).strict();

const persistedEnvelopeSchema = z.object({
  schemaVersion: z.literal(continuousReceivedHydrationPolicy.expectedSchemaVersion),
  registry: registrySchema
}).strict();

export type ContinuousReceivedHydrationStatus = 'empty' | 'accepted' | 'rejected';

export interface ContinuousReceivedHydrationResult {
  schemaVersion: 1;
  registry: ContinuousReceivedRegistry;
  status: ContinuousReceivedHydrationStatus;
  message: string;
  issues: string[];
}

function rejected(
  fallback: ContinuousReceivedRegistry,
  issues: string[]
): ContinuousReceivedHydrationResult {
  const limited = issues.slice(0, continuousReceivedHydrationPolicy.maxReportedIssues);
  return {
    schemaVersion: continuousReceivedHydrationPolicy.expectedSchemaVersion,
    registry: fallback,
    status: 'rejected',
    message: limited[0] ?? 'A memória persistida foi recusada antes da hidratação.',
    issues: limited
  };
}

function formatZodIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `$.${issue.path.join('.')}` : '$';
    return `${path}: ${issue.message}`;
  });
}

export function hydrateContinuousReceivedPersistedState(
  persisted: unknown,
  fallback: ContinuousReceivedRegistry
): ContinuousReceivedHydrationResult {
  if (persisted === undefined || persisted === null) {
    return {
      schemaVersion: continuousReceivedHydrationPolicy.expectedSchemaVersion,
      registry: fallback,
      status: 'empty',
      message: 'Nenhuma memória recebida foi encontrada; a biblioteca local nova foi preservada.',
      issues: []
    };
  }

  const inert = validateContinuousInertJson(persisted);
  if (!inert.ok) {
    return rejected(fallback, inert.errors.map((error) => `Forma persistida recusada: ${error}`));
  }

  const envelope = persistedEnvelopeSchema.safeParse(persisted);
  if (!envelope.success) {
    return rejected(fallback, formatZodIssues(envelope.error));
  }

  const registry = envelope.data.registry as ContinuousReceivedRegistry;
  const packageIssues: string[] = [];
  registry.records.forEach((record, index) => {
    const parsed = parseContinuousCollectionShareWithConsistency(record.package);
    if (!parsed.ok) {
      parsed.errors.forEach((error) => packageIssues.push(`$.registry.records[${index}].package: ${error}`));
    }
  });
  if (packageIssues.length > 0) return rejected(fallback, packageIssues);

  const integrity = validateContinuousReceivedRegistryChronology(registry);
  if (!integrity.ok) return rejected(fallback, integrity.errors);

  return {
    schemaVersion: continuousReceivedHydrationPolicy.expectedSchemaVersion,
    registry: cloneContinuousReceivedRegistry(registry),
    status: 'accepted',
    message: `Memória persistida validada e hidratada com ${registry.records.length} cópias locais.`,
    issues: []
  };
}
