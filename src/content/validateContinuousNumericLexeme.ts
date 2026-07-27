import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousNumericLexemeBiblicalUnit,
  continuousNumericLexemeCatalog,
  continuousNumericLexemeRestrictions
} from './continuousNumericLexeme';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_numeric_lexeme_v1'),
  reference: z.literal('Provérbios 16:11'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousNumericLexemeBiblicalUnit);

z.object({
  id: z.literal('continuous-numeric-lexeme-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('exact-decimal-measure-before-json-parse-v1'),
  mode: z.literal('raw-json-number-lexeme-inspection'),
  maxSafeInteger: z.literal(Number.MAX_SAFE_INTEGER),
  maxLexemeCharacters: z.literal(128),
  negativeZeroAccepted: z.literal(false),
  overflowAccepted: z.literal(false),
  underflowToZeroAccepted: z.literal(false),
  silentRoundingAccepted: z.literal(false),
  equivalentNotationAccepted: z.literal(true)
}).parse(continuousNumericLexemeCatalog);

z.array(z.string().min(1)).min(15).parse(continuousNumericLexemeRestrictions);

if (!continuousNumericLexemeRestrictions.some((restriction) => /MAX_SAFE_INTEGER/i.test(restriction))) {
  throw new Error('A Fase 8.17 precisa declarar a faixa inteira segura.');
}
if (!continuousNumericLexemeRestrictions.some((restriction) => /Underflow/i.test(restriction))) {
  throw new Error('A Fase 8.17 precisa recusar underflow silencioso.');
}
if (!continuousNumericLexemeRestrictions.some((restriction) => /não arredonda/i.test(restriction))) {
  throw new Error('A Fase 8.17 precisa negar correção numérica automática.');
}
if (!continuousNumericLexemeRestrictions.some((restriction) => /não autentica identidade/i.test(restriction))) {
  throw new Error('A Fase 8.17 precisa negar autenticação de identidade.');
}
