import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousResponseBiblicalUnit,
  continuousResponseCatalog,
  continuousResponseConsentSteps,
  continuousResponseGestures,
  continuousResponseRestrictions
} from './continuousResponse';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('ecclesiastes_continuous_response_v1'),
  reference: z.literal('Eclesiastes 3:7'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousResponseBiblicalUnit);

z.object({
  id: z.literal('continuous-response-catalog'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  schema: z.literal('athanor-continuous-response-v1'),
  policy: z.literal('optional-curated-no-tracking-v1'),
  mode: z.literal('manual-local-file-or-silence'),
  automaticSending: z.literal(false),
  freeText: z.literal(false),
  identityStorage: z.literal(false),
  responseHistory: z.literal(false)
}).parse(continuousResponseCatalog);

z.array(z.object({
  id: z.enum(['gratitude', 'received', 'time', 'boundary', 'silence']),
  label: z.string().min(1),
  description: z.string().min(1),
  statement: z.string().min(1),
  createsFile: z.boolean()
})).length(5).parse(continuousResponseGestures);

z.array(z.object({
  id: z.enum(['source', 'preview', 'local-file', 'no-reply']),
  label: z.string().min(1),
  description: z.string().min(1)
})).length(4).parse(continuousResponseConsentSteps);

z.array(z.string().min(1)).min(12).parse(continuousResponseRestrictions);

if (new Set(continuousResponseGestures.map((gesture) => gesture.id)).size !== continuousResponseGestures.length) {
  throw new Error('A Fase 8.9 contém gestos de resposta duplicados.');
}

const silence = continuousResponseGestures.find((gesture) => gesture.id === 'silence');
if (!silence || silence.createsFile) {
  throw new Error('A Fase 8.9 precisa reconhecer silêncio sem gerar arquivo.');
}

if (!continuousResponseGestures.filter((gesture) => gesture.createsFile).every((gesture) => /nenhuma resposta adicional|sem prazo ou obrigação/i.test(gesture.statement))) {
  throw new Error('Todo gesto exportável precisa remover a cobrança de novo retorno.');
}

if (!continuousResponseRestrictions.some((restriction) => /histórico/i.test(restriction))) {
  throw new Error('A Fase 8.9 precisa impedir histórico de respostas.');
}

if (!continuousResponseRestrictions.some((restriction) => /mensagem livre/i.test(restriction))) {
  throw new Error('A Fase 8.9 precisa impedir mensagem livre.');
}
