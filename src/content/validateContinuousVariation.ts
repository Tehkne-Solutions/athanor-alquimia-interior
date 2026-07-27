import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import { continuousTrailVariants } from './continuousTrail';
import {
  continuousTrailCatalogDefinition,
  continuousVariationActions,
  continuousVariationBiblicalUnit,
  continuousVariationRestrictions
} from './continuousVariation';

const startPointSchema = z.enum(['word', 'water', 'fire', 'earth', 'spirit', 'rest']);
const stageSchema = z.enum(['orientation', 'observation', 'review']);

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_variation_v1'),
  reference: z.literal('Provérbios 25:11'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(4),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousVariationBiblicalUnit);

z.object({
  id: z.literal('continuous-trail-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  policy: z.literal('deterministic-curated-no-immediate-repeat-v1'),
  generationMode: z.literal('curated-only'),
  stages: z.array(stageSchema).length(3),
  startPoints: z.array(startPointSchema).length(6),
  practiceCount: z.number().int().positive(),
  variantCount: z.number().int().positive(),
  sensitivePersonalization: z.literal(false),
  description: z.string().min(1)
}).parse(continuousTrailCatalogDefinition);

z.array(z.object({
  id: z.enum(['keep_current', 'request_another']),
  label: z.string().min(1),
  description: z.string().min(1)
})).length(2).parse(continuousVariationActions);

z.array(z.string().min(1)).min(7).parse(continuousVariationRestrictions);

if (continuousTrailCatalogDefinition.variantCount !== continuousTrailVariants.length) {
  throw new Error('A versão do catálogo precisa declarar a quantidade real de variantes.');
}

for (const startPoint of startPointSchema.options) {
  const variants = continuousTrailVariants.filter((variant) => variant.startPoint === startPoint);
  if (variants.length < 2) throw new Error(`A Fase 8.2 exige ao menos duas variantes para ${startPoint}.`);
  if (new Set(variants.map((variant) => variant.id)).size !== variants.length) {
    throw new Error(`A Fase 8.2 encontrou variantes duplicadas para ${startPoint}.`);
  }
}
