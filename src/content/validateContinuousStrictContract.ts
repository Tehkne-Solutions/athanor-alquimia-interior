import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousStrictContractBiblicalUnit,
  continuousStrictContractCatalog,
  continuousStrictContractRestrictions
} from './continuousStrictContract';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_strict_contract_v1'),
  reference: z.literal('Provérbios 25:11'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousStrictContractBiblicalUnit);

z.object({
  id: z.literal('continuous-strict-contract-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('reject-unknown-fields-before-sanitization-v1'),
  mode: z.literal('recursive-schema-manifest'),
  unknownFieldsAccepted: z.literal(false),
  silentStripping: z.literal(false),
  automaticMigration: z.literal(false),
  maxReportedUnknownFields: z.literal(20)
}).parse(continuousStrictContractCatalog);

z.array(z.string().min(1)).min(12).parse(continuousStrictContractRestrictions);

if (!continuousStrictContractRestrictions.some((restriction) => /antes da sanitização/i.test(restriction))) {
  throw new Error('A Fase 8.18 precisa recusar campos desconhecidos antes da sanitização.');
}

if (!continuousStrictContractRestrictions.some((restriction) => /apagada silenciosamente/i.test(restriction))) {
  throw new Error('A Fase 8.18 precisa negar descarte silencioso de propriedades extras.');
}

if (!continuousStrictContractRestrictions.some((restriction) => /objetos aninhados/i.test(restriction))) {
  throw new Error('A Fase 8.18 precisa cobrir estruturas aninhadas.');
}

if (!continuousStrictContractRestrictions.some((restriction) => /não é alterado/i.test(restriction))) {
  throw new Error('A Fase 8.18 precisa preservar o arquivo original.');
}
