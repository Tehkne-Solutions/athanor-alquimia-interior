import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousVersionBiblicalUnit,
  continuousVersionCatalog,
  continuousVersionRestrictions
} from './continuousVersion';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('ecclesiastes_continuous_version_v1'),
  reference: z.literal('Eclesiastes 3:1'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousVersionBiblicalUnit);

const semverSchema = z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);

z.object({
  id: z.literal('continuous-version-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('explicit-compatibility-no-silent-migration-v1'),
  mode: z.literal('strict-semver-explicit-matrix'),
  shareCurrentVersion: semverSchema,
  shareSupportedLegacyVersions: z.array(semverSchema),
  responseCurrentVersion: semverSchema,
  responseSupportedLegacyVersions: z.array(semverSchema),
  futureVersionsAccepted: z.literal(false),
  unknownOlderVersionsAccepted: z.literal(false),
  silentMigration: z.literal(false)
}).parse(continuousVersionCatalog);

z.array(z.string().min(1)).min(12).parse(continuousVersionRestrictions);

if (!continuousVersionRestrictions.some((restriction) => /versões futuras são recusadas/i.test(restriction))) {
  throw new Error('A Fase 8.12 precisa recusar versões futuras.');
}

if (!continuousVersionRestrictions.some((restriction) => /migração silenciosa/i.test(restriction))) {
  throw new Error('A Fase 8.12 precisa negar migração silenciosa.');
}

if (!continuousVersionRestrictions.some((restriction) => /listada explicitamente/i.test(restriction))) {
  throw new Error('A Fase 8.12 precisa exigir lista explícita para legados.');
}

if (continuousVersionCatalog.shareSupportedLegacyVersions.includes(continuousVersionCatalog.shareCurrentVersion)) {
  throw new Error('A versão atual de partilha não pode aparecer como legado.');
}

if (continuousVersionCatalog.responseSupportedLegacyVersions.includes(continuousVersionCatalog.responseCurrentVersion)) {
  throw new Error('A versão atual de resposta não pode aparecer como legado.');
}
