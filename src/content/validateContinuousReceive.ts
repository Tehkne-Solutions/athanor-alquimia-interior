import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceiveBiblicalUnit,
  continuousReceiveCatalog,
  continuousReceiveConsentSteps,
  continuousReceiveRestrictions
} from './continuousReceive';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_receive_v1'),
  reference: z.literal('Provérbios 18:13'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceiveBiblicalUnit);

z.object({
  id: z.literal('continuous-receive-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  acceptedSchema: z.literal('athanor-continuous-collection-share-v1'),
  acceptedPolicy: z.literal('explicit-consent-minimized-local-export-v1'),
  mode: z.literal('separate-received-library'),
  mergeIntoJourneys: z.literal(false),
  mergeIntoCollections: z.literal(false),
  senderIdentity: z.literal(false),
  automaticResponse: z.literal(false)
}).parse(continuousReceiveCatalog);

z.array(z.object({
  id: z.enum(['file', 'preview', 'separate-library', 'keep-copy']),
  label: z.string().min(1),
  description: z.string().min(1)
})).length(4).parse(continuousReceiveConsentSteps);

z.array(z.string().min(1)).min(14).parse(continuousReceiveRestrictions);

if (new Set(continuousReceiveConsentSteps.map((step) => step.id)).size !== continuousReceiveConsentSteps.length) {
  throw new Error('A Fase 8.8 contém consentimentos de recepção duplicados.');
}

if (!continuousReceiveRestrictions.some((restriction) => /não cria jornadas/i.test(restriction))) {
  throw new Error('A Fase 8.8 precisa impedir que pacotes recebidos criem jornadas.');
}

if (!continuousReceiveRestrictions.some((restriction) => /não é mesclado/i.test(restriction))) {
  throw new Error('A Fase 8.8 precisa manter a biblioteca recebida separada das coleções próprias.');
}

if (!continuousReceiveRestrictions.some((restriction) => /identidade/i.test(restriction))) {
  throw new Error('A Fase 8.8 precisa proibir inferência ou registro da identidade de origem.');
}

if (!continuousReceiveRestrictions.some((restriction) => /duplicados/i.test(restriction))) {
  throw new Error('A Fase 8.8 precisa declarar a deduplicação local de pacotes.');
}
