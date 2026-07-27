import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousExactRelationBiblicalUnit,
  continuousExactRelationCatalog,
  continuousExactRelationRestrictions
} from './continuousExactRelation';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('ecclesiastes_continuous_exact_relation_v1'),
  reference: z.literal('Eclesiastes 3:11'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousExactRelationBiblicalUnit);

z.object({
  id: z.literal('continuous-exact-relation-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('reject-cross-field-contradictions-before-domain-v1'),
  shareRelations: z.array(z.string().min(1)).length(6),
  responseRelations: z.array(z.string().min(1)).length(1),
  comparesWithCurrentClock: z.literal(false),
  repairsContradictions: z.literal(false)
}).parse(continuousExactRelationCatalog);

z.array(z.string().min(1)).min(12).parse(continuousExactRelationRestrictions);

if (!continuousExactRelationRestrictions.some((restriction) => /quantidade declarada/i.test(restriction))) {
  throw new Error('A Fase 8.21 precisa verificar a quantidade declarada.');
}

if (!continuousExactRelationRestrictions.some((restriction) => /posições precisam ser sequenciais/i.test(restriction))) {
  throw new Error('A Fase 8.21 precisa verificar posições sequenciais.');
}

if (!continuousExactRelationRestrictions.some((restriction) => /posteriores à geração/i.test(restriction))) {
  throw new Error('A Fase 8.21 precisa impedir instantes internos posteriores à geração.');
}

if (!continuousExactRelationRestrictions.some((restriction) => /relógio atual.*não participa/i.test(restriction))) {
  throw new Error('A Fase 8.21 precisa negar comparação com o relógio atual.');
}
