import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReturnBiblicalUnit,
  continuousReturnCatalog,
  continuousReturnConsentSteps,
  continuousReturnRestrictions
} from './continuousReturn';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('ecclesiastes_continuous_return_v1'),
  reference: z.literal('Eclesiastes 3:6'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReturnBiblicalUnit);

z.object({
  id: z.literal('continuous-return-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  acceptedSchema: z.literal('athanor-continuous-response-v1'),
  acceptedPolicy: z.literal('optional-curated-no-tracking-v1'),
  mode: z.literal('transient-local-preview'),
  persistentHistory: z.literal(false),
  sourceReopened: z.literal(false),
  followUpCreated: z.literal(false)
}).parse(continuousReturnCatalog);

z.array(z.object({
  id: z.enum(['file', 'preview', 'no-reopen']),
  label: z.string().min(1),
  description: z.string().min(1)
})).length(3).parse(continuousReturnConsentSteps);

z.array(z.string().min(1)).min(14).parse(continuousReturnRestrictions);

if (new Set(continuousReturnConsentSteps.map((step) => step.id)).size !== continuousReturnConsentSteps.length) {
  throw new Error('A Fase 8.10 contém confirmações duplicadas.');
}

if (!continuousReturnRestrictions.some((restriction) => /histórico/i.test(restriction))) {
  throw new Error('A Fase 8.10 precisa proibir histórico persistente.');
}

if (!continuousReturnRestrictions.some((restriction) => /reaberta/i.test(restriction))) {
  throw new Error('A Fase 8.10 precisa proibir reabertura da origem.');
}

if (!continuousReturnRestrictions.some((restriction) => /lembrete/i.test(restriction))) {
  throw new Error('A Fase 8.10 precisa proibir lembretes e acompanhamento.');
}
