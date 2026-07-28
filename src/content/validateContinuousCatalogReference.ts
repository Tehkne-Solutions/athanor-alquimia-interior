import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousCatalogReferenceBiblicalUnit,
  continuousCatalogReferenceCatalog,
  continuousCatalogReferenceRestrictions
} from './continuousCatalogReference';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('corinthians_continuous_catalog_reference_v1'),
  reference: z.literal('1 Coríntios 14:40'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousCatalogReferenceBiblicalUnit);

z.object({
  id: z.literal('continuous-catalog-reference-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('reject-unknown-or-mismatched-catalog-references-before-domain-v1'),
  source: z.literal('bundled-curated-catalogs'),
  unknownExplicitThemeStateAllowed: z.literal(true),
  unknownProvidedIdsAllowed: z.literal(false),
  automaticReplacement: z.literal(false),
  maxReportedIssues: z.literal(20)
}).parse(continuousCatalogReferenceCatalog);

z.array(z.string().min(1)).min(15).parse(continuousCatalogReferenceRestrictions);

if (!continuousCatalogReferenceRestrictions.some((restriction) => /tema desconhecido válido/i.test(restriction))) {
  throw new Error('A Fase 8.23 precisa preservar o estado explícito de tema desconhecido.');
}
if (!continuousCatalogReferenceRestrictions.some((restriction) => /não é substituído/i.test(restriction))) {
  throw new Error('A Fase 8.23 precisa negar substituição aproximada de IDs.');
}
if (!continuousCatalogReferenceRestrictions.some((restriction) => /rótulo divergente/i.test(restriction))) {
  throw new Error('A Fase 8.23 precisa impedir correção automática de rótulos divergentes.');
}
if (!continuousCatalogReferenceRestrictions.some((restriction) => /não comprova identidade/i.test(restriction))) {
  throw new Error('A Fase 8.23 precisa declarar os limites de referências conhecidas.');
}
