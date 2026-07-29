import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedPersistedTextBiblicalUnit,
  continuousReceivedPersistedTextPolicy,
  continuousReceivedPersistedTextRestrictions
} from './continuousReceivedPersistedText';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_received_persisted_text_v1'),
  reference: z.literal('Provérbios 22:21'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedPersistedTextBiblicalUnit);

z.object({
  id: z.literal('continuous-received-persisted-text-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('inspect-persisted-json-text-before-parse-v1'),
  order: z.tuple([
    z.literal('utf8-bytes'),
    z.literal('text-characters'),
    z.literal('unique-decoded-object-keys'),
    z.literal('exact-numeric-lexemes'),
    z.literal('json-parse'),
    z.literal('inert-json'),
    z.literal('structural-budget'),
    z.literal('visible-unicode-text'),
    z.literal('persist-envelope'),
    z.literal('received-hydration')
  ]),
  maxUtf8Bytes: z.literal(524_288),
  maxTextCharacters: z.literal(524_288),
  recordsRefusal: z.literal(false),
  repairsAutomatically: z.literal(false),
  rewritesText: z.literal(false),
  choosesDuplicateValue: z.literal(false),
  roundsNumbers: z.literal(false)
}).parse(continuousReceivedPersistedTextPolicy);

z.array(z.string().min(1)).min(10).parse(continuousReceivedPersistedTextRestrictions);

if (!continuousReceivedPersistedTextRestrictions.some((entry) => /antes do JSON\.parse/i.test(entry))) {
  throw new Error('A Fase 8.37 precisa inspecionar o texto persistido antes do JSON.parse.');
}
if (!continuousReceivedPersistedTextRestrictions.some((entry) => /nenhum primeiro ou último valor repetido.*escolhido/i.test(entry))) {
  throw new Error('A Fase 8.37 precisa proibir escolha silenciosa entre chaves repetidas.');
}
if (!continuousReceivedPersistedTextRestrictions.some((entry) => /bytes existentes na IndexedDB/i.test(entry))) {
  throw new Error('A Fase 8.37 precisa preservar a memória persistida recusada.');
}
