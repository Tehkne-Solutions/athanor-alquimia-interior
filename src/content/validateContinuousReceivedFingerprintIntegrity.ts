import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedFingerprintIntegrityBiblicalUnit,
  continuousReceivedFingerprintIntegrityPolicy,
  continuousReceivedFingerprintIntegrityRestrictions
} from './continuousReceivedFingerprintIntegrity';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_received_fingerprint_integrity_v1'),
  reference: z.literal('Provérbios 16:11'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedFingerprintIntegrityBiblicalUnit);

z.object({
  id: z.literal('continuous-received-fingerprint-integrity-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('stored-fingerprint-matches-package-scope-v1'),
  recomputeBeforeDeduplication: z.literal(true),
  recomputeBeforeMutation: z.literal(true),
  repairMismatch: z.literal(false),
  trustStoredFingerprintAlone: z.literal(false),
  inspectOnlyHistoricalFingerprintScope: z.literal(true),
  maxReportedIssues: z.literal(20)
}).parse(continuousReceivedFingerprintIntegrityPolicy);

z.array(z.string().min(1)).min(12).parse(continuousReceivedFingerprintIntegrityRestrictions);

if (!continuousReceivedFingerprintIntegrityRestrictions.some((restriction) => /recalculada/i.test(restriction))) {
  throw new Error('A Fase 8.29 precisa recalcular a impressão armazenada.');
}
if (!continuousReceivedFingerprintIntegrityRestrictions.some((restriction) => /nunca é corrigida/i.test(restriction))) {
  throw new Error('A Fase 8.29 precisa recusar reparo silencioso da impressão.');
}
if (!continuousReceivedFingerprintIntegrityRestrictions.some((restriction) => /não comprova autoria/i.test(restriction))) {
  throw new Error('A Fase 8.29 precisa declarar os limites da impressão armazenada.');
}
