import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedCatalogVersionBiblicalUnit,
  continuousReceivedCatalogVersionPolicy,
  continuousReceivedCatalogVersionRestrictions
} from './continuousReceivedCatalogVersion';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('amos_continuous_received_catalog_version_v1'),
  reference: z.literal('Amós 3:3'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedCatalogVersionBiblicalUnit);

z.object({
  id: z.literal('continuous-received-catalog-version-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('registry-catalog-version-matches-all-packages-v1'),
  expectedRegistryId: z.literal('continuous_received_registry_v1'),
  currentCatalogVersion: z.literal('1.0.0'),
  strictSemver: z.literal(true),
  allowMixedCatalogs: z.literal(false),
  allowSilentMigration: z.literal(false),
  validateBeforeDeduplication: z.literal(true),
  validateBeforeMutation: z.literal(true),
  maxReportedIssues: z.literal(20)
}).parse(continuousReceivedCatalogVersionPolicy);

z.array(z.string().min(1)).min(13).parse(continuousReceivedCatalogVersionRestrictions);

if (!continuousReceivedCatalogVersionRestrictions.some((restriction) => /mesma versão da biblioteca/i.test(restriction))) {
  throw new Error('A Fase 8.30 precisa exigir correspondência entre biblioteca e pacotes.');
}
if (!continuousReceivedCatalogVersionRestrictions.some((restriction) => /não é substituída automaticamente/i.test(restriction))) {
  throw new Error('A Fase 8.30 precisa recusar substituição silenciosa de versões.');
}
if (!continuousReceivedCatalogVersionRestrictions.some((restriction) => /não comprova identidade/i.test(restriction))) {
  throw new Error('A Fase 8.30 precisa declarar os limites da coerência de catálogo.');
}
