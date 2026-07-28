import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedExplicitRehydrationBiblicalUnit,
  continuousReceivedExplicitRehydrationPolicy,
  continuousReceivedExplicitRehydrationRestrictions
} from './continuousReceivedExplicitRehydration';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverbios_continuous_received_explicit_rehydration_v1'),
  reference: z.literal('Provérbios 18:13'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedExplicitRehydrationBiblicalUnit);

z.object({
  id: z.literal('continuous-received-explicit-rehydration-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('explicit-reread-after-conflict-without-merge-or-replay-v1'),
  allowedSourceStatus: z.literal('conflict'),
  validatePersistVersion: z.literal(0),
  adoptAccepted: z.literal(true),
  adoptConfirmedEmpty: z.literal(true),
  adoptRejected: z.literal(false),
  clearConflictOnAdoption: z.literal(true),
  preserveConflictOnRejection: z.literal(true),
  replayInterruptedAction: z.literal(false),
  mergeSnapshots: z.literal(false),
  writeDuringReread: z.literal(false),
  persistDiagnostics: z.literal(false),
  maxReportedIssues: z.literal(5)
}).parse(continuousReceivedExplicitRehydrationPolicy);

z.array(z.string().min(1)).min(10).parse(continuousReceivedExplicitRehydrationRestrictions);

if (!continuousReceivedExplicitRehydrationRestrictions.some((entry) => /ação explícita.*conflito/i.test(entry))) {
  throw new Error('A Fase 8.36 precisa exigir releitura explícita depois do conflito.');
}
if (!continuousReceivedExplicitRehydrationRestrictions.some((entry) => /não grava.*remove.*corrige.*migra.*mescla/i.test(entry))) {
  throw new Error('A Fase 8.36 precisa proibir alteração silenciosa durante a releitura.');
}
if (!continuousReceivedExplicitRehydrationRestrictions.some((entry) => /não são.*reaplicados/i.test(entry))) {
  throw new Error('A Fase 8.36 precisa proibir reaplicação silenciosa de decisões transitórias.');
}
