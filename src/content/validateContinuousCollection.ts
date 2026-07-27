import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousCollectionBiblicalUnit,
  continuousCollectionCatalog,
  continuousCollectionRestrictions,
  continuousCollectionTemplates
} from './continuousCollection';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_collection_v1'),
  reference: z.literal('Provérbios 24:3–4'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousCollectionBiblicalUnit);

z.object({
  id: z.literal('continuous-collection-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  policy: z.literal('explicit-reference-no-accumulated-value-v1'),
  mode: z.literal('local-curated-references'),
  importSchemas: z.tuple([z.literal('athanor-continuous-map-export-v1')]),
  futureSharing: z.literal('explicit-consent-only')
}).parse(continuousCollectionCatalog);

z.array(z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1)
})).length(7).parse(continuousCollectionTemplates);

z.array(z.string().min(1)).min(10).parse(continuousCollectionRestrictions);

if (new Set(continuousCollectionTemplates.map((template) => template.id)).size !== continuousCollectionTemplates.length) {
  throw new Error('A Fase 8.6 contém modelos de coleção duplicados.');
}

if (!continuousCollectionTemplates.some((template) => template.id === 'collection-open')) {
  throw new Error('A Fase 8.6 precisa oferecer uma coleção aberta sem tema obrigatório.');
}

if (!continuousCollectionRestrictions.some((restriction) => /vazia/i.test(restriction))) {
  throw new Error('A Fase 8.6 precisa reconhecer coleções vazias como válidas.');
}

if (!continuousCollectionRestrictions.some((restriction) => /quantidade/i.test(restriction))) {
  throw new Error('A Fase 8.6 precisa impedir valor acumulado por quantidade.');
}
