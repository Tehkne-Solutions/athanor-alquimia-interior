import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousExactTextBiblicalUnit,
  continuousExactTextCatalog,
  continuousExactTextRestrictions
} from './continuousExactText';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_exact_text_v1'),
  reference: z.literal('Provérbios 22:28'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousExactTextBiblicalUnit);

z.object({
  id: z.literal('continuous-exact-text-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('reject-boundary-whitespace-before-sanitization-v1'),
  mode: z.literal('exact-string-boundaries'),
  comparison: z.literal('ecmascript-trim-equality'),
  maxReportedIssues: z.literal(20),
  modifiesInput: z.literal(false),
  internalWhitespacePreserved: z.literal(true),
  emptyStringHandledByDomain: z.literal(true)
}).parse(continuousExactTextCatalog);

z.array(z.string().min(1)).min(14).parse(continuousExactTextRestrictions);

if (!continuousExactTextRestrictions.some((restriction) => /não executa getters/i.test(restriction))) {
  throw new Error('A Fase 8.19 precisa impedir execução de getters.');
}

if (!continuousExactTextRestrictions.some((restriction) => /não usa(?:m)? trim/i.test(restriction))) {
  throw new Error('A Fase 8.19 precisa remover trim dos parsers.');
}

if (!continuousExactTextRestrictions.some((restriction) => /internas permanecem preservados/i.test(restriction))) {
  throw new Error('A Fase 8.19 precisa preservar espaços internos.');
}

if (!continuousExactTextRestrictions.some((restriction) => /não autentica identidade/i.test(restriction))) {
  throw new Error('A Fase 8.19 precisa declarar seus limites de garantia.');
}
