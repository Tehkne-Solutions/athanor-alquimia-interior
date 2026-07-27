import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousShareBiblicalUnit,
  continuousShareCatalog,
  continuousShareConsentSteps,
  continuousShareRestrictions
} from './continuousShare';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_share_v1'),
  reference: z.literal('Provérbios 11:13'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousShareBiblicalUnit);

z.object({
  id: z.literal('continuous-share-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  schema: z.literal('athanor-continuous-collection-share-v1'),
  policy: z.literal('explicit-consent-minimized-local-export-v1'),
  mode: z.literal('manual-local-file'),
  automaticSending: z.literal(false),
  recipientStorage: z.literal(false),
  personalNotes: z.literal(false)
}).parse(continuousShareCatalog);

z.array(z.object({
  id: z.enum(['collection', 'preview', 'local-file', 'recipient', 'no-personal-notes']),
  label: z.string().min(1),
  description: z.string().min(1)
})).length(5).parse(continuousShareConsentSteps);

z.array(z.string().min(1)).min(12).parse(continuousShareRestrictions);

if (new Set(continuousShareConsentSteps.map((step) => step.id)).size !== continuousShareConsentSteps.length) {
  throw new Error('A Fase 8.7 contém confirmações de consentimento duplicadas.');
}

if (!continuousShareRestrictions.some((restriction) => /automaticamente/i.test(restriction))) {
  throw new Error('A Fase 8.7 precisa proibir envio automático.');
}

if (!continuousShareRestrictions.some((restriction) => /datas são omitidas/i.test(restriction))) {
  throw new Error('A Fase 8.7 precisa omitir datas por padrão.');
}

if (!continuousShareRestrictions.some((restriction) => /notas pessoais/i.test(restriction))) {
  throw new Error('A Fase 8.7 precisa excluir notas pessoais do schema.');
}
