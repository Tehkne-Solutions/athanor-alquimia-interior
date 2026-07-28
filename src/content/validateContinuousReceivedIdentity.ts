import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedIdentityBiblicalUnit,
  continuousReceivedIdentityPolicy,
  continuousReceivedIdentityRestrictions
} from './continuousReceivedIdentity';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_received_identity_v1'),
  reference: z.literal('Provérbios 20:10'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedIdentityBiblicalUnit);

z.object({
  id: z.literal('continuous-received-identity-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('unique-local-record-id-no-bulk-mutation-v1'),
  separator: z.literal('--'),
  firstSuffix: z.literal(2),
  maxSuffix: z.literal(10_000),
  equivalentCopyPrecedesAllocation: z.literal(true),
  disambiguationReported: z.literal(true),
  ambiguousLegacyMutationAllowed: z.literal(false),
  bulkMutationByIdAllowed: z.literal(false),
  renamesPackageContent: z.literal(false),
  persistsConflictHistory: z.literal(false)
}).parse(continuousReceivedIdentityPolicy);

z.array(z.string().min(1)).min(10).parse(continuousReceivedIdentityRestrictions);

if (!continuousReceivedIdentityRestrictions.some((restriction) => /candidato local/i.test(restriction))) {
  throw new Error('A Fase 8.26 precisa tratar o identificador solicitado como candidato local.');
}
if (!continuousReceivedIdentityRestrictions.some((restriction) => /primeiro sufixo local disponível/i.test(restriction))) {
  throw new Error('A Fase 8.26 precisa documentar a alocação determinística do sufixo.');
}
if (!continuousReceivedIdentityRestrictions.some((restriction) => /não arquiva, reativa ou remove nenhuma cópia/i.test(restriction))) {
  throw new Error('A Fase 8.26 precisa interromper ações sobre identificadores ambíguos.');
}
if (!continuousReceivedIdentityRestrictions.some((restriction) => /não comprova identidade/i.test(restriction))) {
  throw new Error('A Fase 8.26 precisa declarar o limite do identificador local.');
}
