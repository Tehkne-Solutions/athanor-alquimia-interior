import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import { continuousThemes } from './continuousTheme';
import {
  continuousThemeCycleBiblicalUnit,
  continuousThemeCycleCatalog,
  continuousThemeCyclePackages,
  continuousThemeCycleRestrictions
} from './continuousThemeCycle';

const startPointSchema = z.enum(['word', 'water', 'fire', 'earth', 'spirit', 'rest']);
const stageSchema = z.enum(['orientation', 'observation', 'review']);
const themeSchema = z.enum([
  'theme-clarity',
  'theme-proportion',
  'theme-support',
  'theme-transition',
  'theme-boundary',
  'theme-resources',
  'theme-rhythm',
  'theme-rest',
  'no-theme'
]);

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_thematic_cycle_v1'),
  reference: z.literal('Provérbios 15:23'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(4),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousThemeCycleBiblicalUnit);

z.object({
  id: z.literal('continuous-theme-cycle-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  policy: z.literal('explicit-curated-depth-no-sensitive-inference-v1'),
  mode: z.literal('curated-only'),
  supportedDepths: z.tuple([z.literal(1), z.literal(2), z.literal(3)]),
  rewardPolicy: z.string().min(1)
}).parse(continuousThemeCycleCatalog);

z.array(z.object({
  id: z.string().min(1),
  themeId: themeSchema,
  label: z.string().min(1),
  description: z.string().min(1),
  startPoints: z.array(startPointSchema).min(1),
  passages: z.tuple([
    z.object({ id: z.string().min(1), stage: stageSchema, label: z.string().min(1), prompt: z.string().min(1) }),
    z.object({ id: z.string().min(1), stage: stageSchema, label: z.string().min(1), prompt: z.string().min(1) }),
    z.object({ id: z.string().min(1), stage: stageSchema, label: z.string().min(1), prompt: z.string().min(1) })
  ])
})).length(9).parse(continuousThemeCyclePackages);

z.array(z.string().min(1)).min(8).parse(continuousThemeCycleRestrictions);

if (new Set(continuousThemeCyclePackages.map((item) => item.id)).size !== continuousThemeCyclePackages.length) {
  throw new Error('A Fase 8.4 contém IDs de pacote duplicados.');
}

const passageIds = continuousThemeCyclePackages.flatMap((item) => item.passages.map((passage) => passage.id));
if (new Set(passageIds).size !== passageIds.length) {
  throw new Error('A Fase 8.4 contém IDs de passagem duplicados.');
}

for (const item of continuousThemeCyclePackages) {
  if (new Set(item.passages.map((passage) => passage.id)).size !== 3) {
    throw new Error(`O pacote ${item.id} precisa de três passagens únicas.`);
  }
  const stages = new Set(item.passages.map((passage) => passage.stage));
  if (stages.size !== 3) {
    throw new Error(`O pacote ${item.id} precisa cobrir orientação, observação e revisão.`);
  }
  if (item.themeId !== 'no-theme') {
    const sourceTheme = continuousThemes.find((theme) => theme.id === item.themeId);
    if (!sourceTheme) throw new Error(`O pacote ${item.id} referencia um tema inexistente.`);
    const packagePoints = [...item.startPoints].sort().join('|');
    const themePoints = [...sourceTheme.startPoints].sort().join('|');
    if (packagePoints !== themePoints) {
      throw new Error(`O pacote ${item.id} precisa usar exatamente os elementos compatíveis do tema ${item.themeId}.`);
    }
  }
}

for (const startPoint of startPointSchema.options) {
  const compatible = continuousThemeCyclePackages.filter((item) => item.startPoints.includes(startPoint));
  if (!compatible.length) throw new Error(`A Fase 8.4 precisa de pacote compatível com ${startPoint}.`);
  const openPackage = compatible.find((item) => item.themeId === 'no-theme');
  if (!openPackage) throw new Error(`A Fase 8.4 precisa de pacote sem tema compatível com ${startPoint}.`);
}
