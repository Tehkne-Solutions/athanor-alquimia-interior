import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousExactTimeBiblicalUnit,
  continuousExactTimeCatalog,
  continuousExactTimeRestrictions
} from './continuousExactTime';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_exact_time_v1'),
  reference: z.literal('Eclesiastes 3:1'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousExactTimeBiblicalUnit);

z.object({
  id: z.literal('continuous-exact-time-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('reject-noncanonical-temporal-instants-before-domain-v1'),
  format: z.literal('YYYY-MM-DDTHH:mm:ss.sssZ'),
  timezone: z.literal('UTC'),
  fractionalDigits: z.literal(3),
  acceptsOffsets: z.literal(false),
  normalizesInput: z.literal(false),
  validatesRoundTrip: z.literal(true),
  validatesItemOrder: z.literal(true),
  maxReportedIssues: z.literal(20)
}).parse(continuousExactTimeCatalog);

z.array(z.string().min(1)).min(15).parse(continuousExactTimeRestrictions);

if (!continuousExactTimeRestrictions.some((restriction) => /sem fuso explícito são recusados/i.test(restriction))) {
  throw new Error('A Fase 8.20 precisa recusar tempo sem fuso explícito.');
}

if (!continuousExactTimeRestrictions.some((restriction) => /datas impossíveis são recusadas/i.test(restriction))) {
  throw new Error('A Fase 8.20 precisa recusar datas normalizadas silenciosamente.');
}

if (!continuousExactTimeRestrictions.some((restriction) => /não altera, completa ou substitui/i.test(restriction))) {
  throw new Error('A Fase 8.20 precisa negar normalização do arquivo.');
}

if (!continuousExactTimeRestrictions.some((restriction) => /não comprova que o relógio/i.test(restriction))) {
  throw new Error('A Fase 8.20 precisa declarar o limite do relógio de origem.');
}
