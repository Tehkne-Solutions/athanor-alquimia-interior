import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedPersistenceConflictBiblicalUnit,
  continuousReceivedPersistenceConflictPolicy,
  continuousReceivedPersistenceConflictRestrictions
} from './continuousReceivedPersistenceConflict';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverbios_continuous_received_persistence_conflict_v1'),
  reference: z.literal('Provérbios 27:12'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedPersistenceConflictBiblicalUnit);

z.object({
  id: z.literal('continuous-received-persistence-conflict-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('atomic-compare-before-indexeddb-replace-v1'),
  storageKey: z.literal('athanor-continuous-received-state'),
  compareAndWriteInOneTransaction: z.literal(true),
  compareExactHydratedValue: z.literal(true),
  persistExpectedValue: z.literal(false),
  blockAfterConflict: z.literal(true),
  mergeAutomatically: z.literal(false),
  retryAutomatically: z.literal(false),
  overwriteExternalChange: z.literal(false),
  maxReportedIssues: z.literal(5)
}).parse(continuousReceivedPersistenceConflictPolicy);

z.array(z.string().min(1)).min(10).parse(continuousReceivedPersistenceConflictRestrictions);

if (!continuousReceivedPersistenceConflictRestrictions.some((restriction) => /mesma transação readwrite/i.test(restriction))) {
  throw new Error('A Fase 8.35 precisa comparar e escrever dentro da mesma transação IndexedDB.');
}
if (!continuousReceivedPersistenceConflictRestrictions.some((restriction) => /não é sobrescrito/i.test(restriction))) {
  throw new Error('A Fase 8.35 precisa preservar uma alteração externa detectada.');
}
if (!continuousReceivedPersistenceConflictRestrictions.some((restriction) => /nova hidratação explícita/i.test(restriction))) {
  throw new Error('A Fase 8.35 precisa bloquear novas mutações após conflito até nova hidratação.');
}
if (!continuousReceivedPersistenceConflictRestrictions.some((restriction) => /não mescla/i.test(restriction))) {
  throw new Error('A Fase 8.35 precisa proibir mescla automática em conflitos.');
}
