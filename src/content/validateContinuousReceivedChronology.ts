import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedChronologyBiblicalUnit,
  continuousReceivedChronologyPolicy,
  continuousReceivedChronologyRestrictions
} from './continuousReceivedChronology';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_received_chronology_v1'),
  reference: z.literal('Eclesiastes 3:11'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedChronologyBiblicalUnit);

z.object({
  id: z.literal('continuous-received-chronology-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('canonical-local-time-never-regresses-v1'),
  canonicalPattern: z.literal('YYYY-MM-DDTHH:mm:ss.sssZ'),
  equalInstantsAllowed: z.literal(true),
  compareExternalPackageClock: z.literal(false),
  autoCorrectTime: z.literal(false),
  maxReportedIssues: z.literal(20)
}).parse(continuousReceivedChronologyPolicy);

z.array(z.string().min(1)).min(12).parse(continuousReceivedChronologyRestrictions);

if (!continuousReceivedChronologyRestrictions.some((restriction) => /nunca pode anteceder/i.test(restriction))) {
  throw new Error('A Fase 8.27 precisa impedir regressão temporal local.');
}
if (!continuousReceivedChronologyRestrictions.some((restriction) => /não é comparado/i.test(restriction))) {
  throw new Error('A Fase 8.27 precisa preservar a separação entre relógio externo e relógio local.');
}
if (!continuousReceivedChronologyRestrictions.some((restriction) => /não comprova autoria/i.test(restriction))) {
  throw new Error('A Fase 8.27 precisa declarar os limites da cronologia local.');
}
