import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedSnapshotBiblicalUnit,
  continuousReceivedSnapshotPolicy,
  continuousReceivedSnapshotRestrictions
} from './continuousReceivedSnapshot';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_received_snapshot_v1'),
  reference: z.literal('Provérbios 22:28'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedSnapshotBiblicalUnit);

z.object({
  id: z.literal('continuous-received-snapshot-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('detached-defensive-received-snapshots-v1'),
  cloneInputPackage: z.literal(true),
  cloneConsistencySeal: z.literal(true),
  cloneQueryResults: z.literal(true),
  cloneReturnedRecord: z.literal(true),
  clonePreviousRecordsOnSuccess: z.literal(true),
  preserveOriginalOnFailure: z.literal(true),
  deepFreeze: z.literal(false),
  serializeRoundTrip: z.literal(false)
}).parse(continuousReceivedSnapshotPolicy);

z.array(z.string().min(1)).min(12).parse(continuousReceivedSnapshotRestrictions);

if (!continuousReceivedSnapshotRestrictions.some((restriction) => /não compartilha/i.test(restriction))) {
  throw new Error('A Fase 8.28 precisa proibir referências compartilhadas entre entrada e biblioteca.');
}
if (!continuousReceivedSnapshotRestrictions.some((restriction) => /preserva exatamente/i.test(restriction))) {
  throw new Error('A Fase 8.28 precisa manter a mesma instância da biblioteca quando uma operação é recusada.');
}
if (!continuousReceivedSnapshotRestrictions.some((restriction) => /não comprova autoria/i.test(restriction))) {
  throw new Error('A Fase 8.28 precisa declarar os limites dos snapshots defensivos.');
}
