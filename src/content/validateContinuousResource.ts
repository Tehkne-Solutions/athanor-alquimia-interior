import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousResourceBiblicalUnit,
  continuousResourceCatalog,
  continuousResourceRestrictions
} from './continuousResource';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_resource_v1'),
  reference: z.literal('Provérbios 25:16'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousResourceBiblicalUnit);

z.object({
  id: z.literal('continuous-resource-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('bounded-local-reading-no-content-judgment-v1'),
  mode: z.literal('pre-parse-envelope-and-iterative-structure-budget'),
  maxFileBytes: z.number().int().positive(),
  maxTextCharacters: z.number().int().positive(),
  maxDepth: z.number().int().positive(),
  maxNodes: z.number().int().positive(),
  maxArrayLength: z.number().int().positive(),
  maxObjectKeys: z.number().int().positive(),
  maxStringLength: z.number().int().positive(),
  maxTotalStringCharacters: z.number().int().positive(),
  recordsRefusal: z.literal(false),
  repairsAutomatically: z.literal(false),
  judgesContent: z.literal(false)
}).parse(continuousResourceCatalog);

z.array(z.string().min(1)).length(12).parse(continuousResourceRestrictions);

if (!continuousResourceRestrictions.some((restriction) => /não avalia o valor/i.test(restriction))) {
  throw new Error('A Fase 8.13 precisa negar julgamento de valor do conteúdo.');
}
if (!continuousResourceRestrictions.some((restriction) => /não são lidos/i.test(restriction))) {
  throw new Error('A Fase 8.13 precisa interromper arquivos grandes antes da leitura.');
}
if (!continuousResourceRestrictions.some((restriction) => /sem truncamento/i.test(restriction))) {
  throw new Error('A Fase 8.13 precisa proibir truncamento silencioso.');
}
if (!continuousResourceRestrictions.some((restriction) => /nenhuma recusa é persistida/i.test(restriction))) {
  throw new Error('A Fase 8.13 precisa impedir histórico de recusas.');
}
