import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousInertJsonBiblicalUnit,
  continuousInertJsonCatalog,
  continuousInertJsonRestrictions
} from './continuousInertJson';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('corinthians_continuous_inert_json_v1'),
  reference: z.literal('1 Coríntios 14:40'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousInertJsonBiblicalUnit);

z.object({
  id: z.literal('continuous-inert-json-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('plain-json-no-hidden-behavior-v1'),
  mode: z.literal('iterative-own-data-properties-only'),
  maxInspectionNodes: z.literal(10_000),
  allowObjectPrototype: z.literal(true),
  allowNullPrototype: z.literal(true),
  allowArrayPrototype: z.literal(true),
  allowAccessors: z.literal(false),
  allowSymbols: z.literal(false),
  allowFunctions: z.literal(false),
  allowBigInt: z.literal(false),
  allowUndefined: z.literal(false),
  allowNonFiniteNumbers: z.literal(false),
  allowSparseArrays: z.literal(false),
  allowRepeatedReferences: z.literal(false),
  dangerousKeys: z.tuple([
    z.literal('__proto__'),
    z.literal('prototype'),
    z.literal('constructor')
  ])
}).parse(continuousInertJsonCatalog);

z.array(z.string().min(1)).min(14).parse(continuousInertJsonRestrictions);

if (!continuousInertJsonRestrictions.some((restriction) => /getters e setters/i.test(restriction))) {
  throw new Error('A Fase 8.14 precisa recusar acessores explicitamente.');
}

if (!continuousInertJsonRestrictions.some((restriction) => /__proto__/i.test(restriction))) {
  throw new Error('A Fase 8.14 precisa declarar as chaves reservadas.');
}

if (!continuousInertJsonRestrictions.some((restriction) => /não julga o conteúdo/i.test(restriction))) {
  throw new Error('A Fase 8.14 precisa separar forma técnica de julgamento do conteúdo.');
}

if (!continuousInertJsonRestrictions.some((restriction) => /não comprova autenticidade/i.test(restriction))) {
  throw new Error('A Fase 8.14 precisa negar promessa de autenticidade.');
}
