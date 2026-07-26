import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousTrailBiblicalUnit,
  continuousTrailPractices,
  continuousTrailRestrictions,
  continuousTrailTraceDefinition,
  continuousTrailVariants
} from './continuousTrail';

const startPointSchema = z.enum(['word', 'water', 'fire', 'earth', 'spirit', 'rest']);

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('psalm_continuous_trail_v1'),
  reference: z.literal('Salmos 119:105'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(4),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousTrailBiblicalUnit);

z.array(z.object({
  id: z.string().min(1),
  startPoint: startPointSchema,
  label: z.string().min(1),
  description: z.string().min(1)
})).length(11).parse(continuousTrailPractices);

z.array(z.object({
  id: z.string().min(1),
  startPoint: startPointSchema,
  orientation: z.string().min(1),
  observation: z.string().min(1),
  review: z.string().min(1)
})).length(12).parse(continuousTrailVariants);

z.object({
  id: z.literal('continuous-trail-trace-v1'),
  label: z.literal('Rastro da Jornada Contínua'),
  description: z.string().min(1),
  rewardPolicy: z.string().min(1)
}).parse(continuousTrailTraceDefinition);

z.array(z.string().min(1)).min(6).parse(continuousTrailRestrictions);

for (const startPoint of startPointSchema.options) {
  const practices = continuousTrailPractices.filter((practice) => practice.startPoint === startPoint);
  const variants = continuousTrailVariants.filter((variant) => variant.startPoint === startPoint);
  if (practices.length < 1) throw new Error(`A Fase 8.1 precisa de prática curada para ${startPoint}.`);
  if (variants.length !== 2) throw new Error(`A Fase 8.1 precisa de duas variantes curadas para ${startPoint}.`);
}

if (new Set(continuousTrailPractices.map((practice) => practice.id)).size !== continuousTrailPractices.length) {
  throw new Error('A Fase 8.1 contém IDs de prática duplicados.');
}

if (new Set(continuousTrailVariants.map((variant) => variant.id)).size !== continuousTrailVariants.length) {
  throw new Error('A Fase 8.1 contém IDs de variante duplicados.');
}
