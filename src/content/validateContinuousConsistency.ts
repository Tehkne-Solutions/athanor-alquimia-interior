import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousConsistencyBiblicalUnit,
  continuousConsistencyCatalog,
  continuousConsistencyRestrictions
} from './continuousConsistency';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_consistency_v1'),
  reference: z.literal('Provérbios 14:15'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousConsistencyBiblicalUnit);

z.object({
  id: z.literal('continuous-consistency-catalog'),
  version: z.literal('1.0.0'),
  algorithm: z.literal('fnv1a-32'),
  scope: z.literal('top-level-without-consistency'),
  mode: z.literal('deterministic-local-checksum'),
  cryptographic: z.literal(false),
  authenticatesIdentity: z.literal(false),
  legacyAccepted: z.literal(true),
  invalidSealAccepted: z.literal(false)
}).parse(continuousConsistencyCatalog);

z.array(z.string().min(1)).min(12).parse(continuousConsistencyRestrictions);

if (!continuousConsistencyRestrictions.some((restriction) => /não é assinatura digital/i.test(restriction))) {
  throw new Error('A Fase 8.11 precisa negar explicitamente assinatura digital.');
}

if (!continuousConsistencyRestrictions.some((restriction) => /não prova identidade/i.test(restriction))) {
  throw new Error('A Fase 8.11 precisa negar explicitamente autenticação de identidade.');
}

if (!continuousConsistencyRestrictions.some((restriction) => /sem selo continuam aceitos/i.test(restriction))) {
  throw new Error('A Fase 8.11 precisa preservar compatibilidade com arquivos legados.');
}

if (!continuousConsistencyRestrictions.some((restriction) => /selo inválido são recusados/i.test(restriction))) {
  throw new Error('A Fase 8.11 precisa recusar selos inválidos.');
}
