import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousTextVisibilityBiblicalUnit,
  continuousTextVisibilityCatalog,
  continuousTextVisibilityRestrictions
} from './continuousTextVisibility';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_text_visibility_v1'),
  reference: z.literal('Provérbios 12:17'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousTextVisibilityBiblicalUnit);

z.object({
  id: z.literal('continuous-text-visibility-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('nfc-visible-text-no-directional-controls-v1'),
  mode: z.literal('reject-without-rewrite'),
  normalization: z.literal('NFC'),
  maxInspectionNodes: z.literal(20_000),
  inspectValues: z.literal(true),
  inspectObjectKeys: z.literal(true),
  allowTab: z.literal(true),
  allowLineFeed: z.literal(true),
  allowCarriageReturn: z.literal(true),
  rejectUnpairedSurrogates: z.literal(true),
  rejectNonCharacters: z.literal(true),
  rejectReplacementCharacter: z.literal(true),
  rejectBidirectionalControls: z.literal(true),
  rejectZeroWidthControls: z.literal(true),
  rewriteText: z.literal(false)
}).parse(continuousTextVisibilityCatalog);

z.array(z.string().min(1)).min(16).parse(continuousTextVisibilityRestrictions);

if (!continuousTextVisibilityRestrictions.some((restriction) => /NFC/i.test(restriction))) {
  throw new Error('A Fase 8.15 precisa declarar normalização Unicode NFC.');
}

if (!continuousTextVisibilityRestrictions.some((restriction) => /nunca corrigido silenciosamente/i.test(restriction))) {
  throw new Error('A Fase 8.15 precisa proibir reescrita silenciosa.');
}

if (!continuousTextVisibilityRestrictions.some((restriction) => /direção bidirecional/i.test(restriction))) {
  throw new Error('A Fase 8.15 precisa recusar controles bidirecionais.');
}

if (!continuousTextVisibilityRestrictions.some((restriction) => /não tenta detectar palavras ofensivas/i.test(restriction))) {
  throw new Error('A Fase 8.15 precisa separar visibilidade técnica de moderação semântica.');
}

if (!continuousTextVisibilityRestrictions.some((restriction) => /não promete detectar todos os caracteres visualmente semelhantes/i.test(restriction))) {
  throw new Error('A Fase 8.15 precisa declarar o limite sobre confusáveis visuais.');
}
