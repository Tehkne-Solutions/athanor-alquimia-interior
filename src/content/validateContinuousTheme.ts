import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousThemeBiblicalUnit,
  continuousThemeCatalog,
  continuousThemeRestrictions,
  continuousThemes
} from './continuousTheme';

const startPointSchema = z.enum(['word', 'water', 'fire', 'earth', 'spirit', 'rest']);

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_theme_v1'),
  reference: z.literal('Provérbios 4:25'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(4),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousThemeBiblicalUnit);

z.object({
  id: z.literal('continuous-theme-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('explicit-curated-no-sensitive-inference-v1'),
  mode: z.literal('curated-only'),
  themeCount: z.literal(8),
  stageKeys: z.tuple([
    z.literal('orientationLens'),
    z.literal('observationLens'),
    z.literal('reviewLens')
  ])
}).parse(continuousThemeCatalog);

z.array(z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  startPoints: z.array(startPointSchema).min(1),
  orientationLens: z.string().min(1),
  observationLens: z.string().min(1),
  reviewLens: z.string().min(1)
})).length(8).parse(continuousThemes);

z.array(z.string().min(1)).min(8).parse(continuousThemeRestrictions);

if (new Set(continuousThemes.map((theme) => theme.id)).size !== continuousThemes.length) {
  throw new Error('A Fase 8.3 contém IDs de tema duplicados.');
}

for (const startPoint of startPointSchema.options) {
  const compatible = continuousThemes.filter((theme) => theme.startPoints.includes(startPoint));
  if (compatible.length < 2) {
    throw new Error(`A Fase 8.3 precisa de ao menos dois temas curados para ${startPoint}.`);
  }
}

const forbiddenTerms = ['diagnóstico', 'perfil psicológico', 'inferir emoção', 'prever comportamento'];
for (const theme of continuousThemes) {
  const combined = `${theme.label} ${theme.description} ${theme.orientationLens} ${theme.observationLens} ${theme.reviewLens}`.toLowerCase();
  for (const forbidden of forbiddenTerms) {
    if (combined.includes(forbidden)) {
      throw new Error(`O tema ${theme.id} contém formulação proibida: ${forbidden}.`);
    }
  }
}
