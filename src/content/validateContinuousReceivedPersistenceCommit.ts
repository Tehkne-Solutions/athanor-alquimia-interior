import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedPersistenceCommitBiblicalUnit,
  continuousReceivedPersistenceCommitPolicy,
  continuousReceivedPersistenceCommitRestrictions
} from './continuousReceivedPersistenceCommit';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('lucas_continuous_received_persistence_commit_v1'),
  reference: z.literal('Lucas 14:28'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedPersistenceCommitBiblicalUnit);

z.object({
  id: z.literal('continuous-received-persistence-commit-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('confirm-indexeddb-write-before-runtime-commit-v1'),
  storageKey: z.literal('athanor-continuous-received-state'),
  schemaVersion: z.literal(1),
  persistBeforeRuntime: z.literal(true),
  automaticMiddlewareWrites: z.literal(false),
  blockConcurrentWrites: z.literal(true),
  queueBlockedWrites: z.literal(false),
  retryAutomatically: z.literal(false),
  preserveRuntimeOnFailure: z.literal(true),
  persistDiagnostics: z.literal(false),
  maxReportedIssues: z.literal(5)
}).parse(continuousReceivedPersistenceCommitPolicy);

z.array(z.string().min(1)).min(9).parse(continuousReceivedPersistenceCommitRestrictions);

if (!continuousReceivedPersistenceCommitRestrictions.some((restriction) => /depois de a transação IndexedDB concluir/i.test(restriction))) {
  throw new Error('A Fase 8.34 precisa exigir confirmação real da IndexedDB antes do sucesso.');
}
if (!continuousReceivedPersistenceCommitRestrictions.some((restriction) => /preserva exatamente a biblioteca anterior/i.test(restriction))) {
  throw new Error('A Fase 8.34 precisa preservar o runtime anterior quando a escrita falha.');
}
if (!continuousReceivedPersistenceCommitRestrictions.some((restriction) => /não entram? em fila/i.test(restriction))) {
  throw new Error('A Fase 8.34 precisa proibir fila silenciosa de ações concorrentes.');
}
if (!continuousReceivedPersistenceCommitRestrictions.some((restriction) => /não iniciam transação/i.test(restriction))) {
  throw new Error('A Fase 8.34 precisa evitar escrita quando o domínio não mudou.');
}
