import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousMapBiblicalUnit,
  continuousMapCatalog,
  continuousMapGroupOptions,
  continuousMapKindOptions,
  continuousMapRestrictions,
  continuousMapStatusOptions
} from './continuousMap';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('psalm_continuous_map_v1'),
  reference: z.literal('Salmos 77:11–12'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousMapBiblicalUnit);

z.object({
  id: z.literal('continuous-map-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  policy: z.literal('descriptive-local-no-ranking-v1'),
  mode: z.literal('derived-read-only'),
  itemKinds: z.tuple([z.literal('trail'), z.literal('theme-cycle')]),
  groupKeys: z.tuple([z.literal('element'), z.literal('theme'), z.literal('package')]),
  statusKeys: z.tuple([
    z.literal('active'),
    z.literal('paused'),
    z.literal('completed'),
    z.literal('declined'),
    z.literal('incomplete'),
    z.literal('unknown')
  ]),
  exportFormat: z.literal('json')
}).parse(continuousMapCatalog);

z.array(z.object({
  id: z.enum(['element', 'theme', 'package']),
  label: z.string().min(1)
})).length(3).parse(continuousMapGroupOptions);

z.array(z.object({
  id: z.enum(['all', 'active', 'paused', 'completed', 'declined', 'incomplete', 'unknown']),
  label: z.string().min(1)
})).length(7).parse(continuousMapStatusOptions);

z.array(z.object({
  id: z.enum(['all', 'trail', 'theme-cycle']),
  label: z.string().min(1)
})).length(3).parse(continuousMapKindOptions);

z.array(z.string().min(1)).min(8).parse(continuousMapRestrictions);

if (new Set(continuousMapStatusOptions.map((item) => item.id)).size !== continuousMapStatusOptions.length) {
  throw new Error('A Fase 8.5 contém estados duplicados.');
}

if (continuousMapRestrictions.some((restriction) => /ranking|pontuaç[aã]o/i.test(restriction) === false) && continuousMapRestrictions.length < 8) {
  throw new Error('A Fase 8.5 precisa preservar explicitamente a política sem ranking.');
}
