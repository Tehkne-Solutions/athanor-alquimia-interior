import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousUniqueKeysBiblicalUnit,
  continuousUniqueKeysCatalog,
  continuousUniqueKeysRestrictions
} from './continuousUniqueKeys';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_unique_keys_v1'),
  reference: z.literal('Provérbios 20:10'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousUniqueKeysBiblicalUnit);

z.object({
  id: z.literal('continuous-unique-keys-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('unique-decoded-object-keys-before-json-parse-v1'),
  scope: z.literal('raw-json-text'),
  comparison: z.literal('decoded-json-string-exact'),
  automaticResolution: z.literal(false),
  lastWriteWins: z.literal(false),
  maxScannerDepth: z.number().int().min(32),
  maxScannerTokens: z.number().int().min(100_000)
}).parse(continuousUniqueKeysCatalog);

z.array(z.string().min(1)).min(14).parse(continuousUniqueKeysRestrictions);

if (!continuousUniqueKeysRestrictions.some((restriction) => /antes do JSON\.parse/i.test(restriction))) {
  throw new Error('A Fase 8.16 precisa operar antes do JSON.parse.');
}

if (!continuousUniqueKeysRestrictions.some((restriction) => /último valor/i.test(restriction))) {
  throw new Error('A Fase 8.16 precisa negar a regra de último valor.');
}

if (!continuousUniqueKeysRestrictions.some((restriction) => /escapes equivalentes/i.test(restriction))) {
  throw new Error('A Fase 8.16 precisa comparar chaves JSON decodificadas.');
}

if (!continuousUniqueKeysRestrictions.some((restriction) => /não é possível recuperar/i.test(restriction))) {
  throw new Error('A Fase 8.16 precisa documentar a perda posterior ao parse.');
}
