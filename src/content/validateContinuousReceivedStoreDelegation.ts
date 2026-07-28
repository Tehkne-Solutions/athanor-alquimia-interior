import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedStoreDelegationBiblicalUnit,
  continuousReceivedStoreDelegationPolicy,
  continuousReceivedStoreDelegationRestrictions
} from './continuousReceivedStoreDelegation';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_received_store_delegation_v1'),
  reference: z.literal('Provérbios 18:17'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedStoreDelegationBiblicalUnit);

z.object({
  id: z.literal('continuous-received-store-delegation-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('store-delegates-received-decisions-to-domain-v1'),
  delegateKeepToDomain: z.literal(true),
  delegateMutationsToDomain: z.literal(true),
  fingerprintPrecheckAllowed: z.literal(false),
  equivalencePreviewUsesCanonicalComparison: z.literal(true),
  propagateStoredId: z.literal(true),
  propagateDomainStatus: z.literal(true),
  preserveRejectedRegistryIdentity: z.literal(true),
  persistAdditionalFields: z.literal(false)
}).parse(continuousReceivedStoreDelegationPolicy);

z.array(z.string().min(1)).min(12).parse(continuousReceivedStoreDelegationRestrictions);

if (!continuousReceivedStoreDelegationRestrictions.some((restriction) => /não decide duplicação usando somente a impressão/i.test(restriction))) {
  throw new Error('A Fase 8.31 precisa proibir a deduplicação antecipada pela impressão.');
}
if (!continuousReceivedStoreDelegationRestrictions.some((restriction) => /storedId realmente escolhido/i.test(restriction))) {
  throw new Error('A Fase 8.31 precisa propagar o identificador realmente armazenado.');
}
if (!continuousReceivedStoreDelegationRestrictions.some((restriction) => /não comprova identidade/i.test(restriction))) {
  throw new Error('A Fase 8.31 precisa declarar os limites da delegação ao domínio.');
}
