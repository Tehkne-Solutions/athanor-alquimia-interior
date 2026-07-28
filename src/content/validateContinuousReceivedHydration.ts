import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedHydrationBiblicalUnit,
  continuousReceivedHydrationPolicy,
  continuousReceivedHydrationRestrictions
} from './continuousReceivedHydration';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('tessalonicenses_continuous_received_hydration_v1'),
  reference: z.literal('1 Tessalonicenses 5:21'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedHydrationBiblicalUnit);

z.object({
  id: z.literal('continuous-received-hydration-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('validate-persisted-received-state-before-hydration-v1'),
  storageKey: z.literal('athanor-continuous-received-state'),
  expectedSchemaVersion: z.literal(1),
  requireInertJson: z.literal(true),
  requireStrictEnvelope: z.literal(true),
  revalidatePackages: z.literal(true),
  revalidateRegistry: z.literal(true),
  preserveRejectedStorage: z.literal(true),
  allowSilentMigration: z.literal(false),
  persistDiagnostics: z.literal(false),
  maxReportedIssues: z.literal(20)
}).parse(continuousReceivedHydrationPolicy);

z.array(z.string().min(1)).min(13).parse(continuousReceivedHydrationRestrictions);

if (!continuousReceivedHydrationRestrictions.some((restriction) => /validado novamente|validados novamente|conferidos novamente/i.test(restriction))) {
  throw new Error('A Fase 8.32 precisa revalidar a memória persistida antes da hidratação.');
}
if (!continuousReceivedHydrationRestrictions.some((restriction) => /não são apagados automaticamente/i.test(restriction))) {
  throw new Error('A Fase 8.32 precisa preservar os bytes recusados sem apagamento silencioso.');
}
if (!continuousReceivedHydrationRestrictions.some((restriction) => /diagnóstico.*transitório/i.test(restriction))) {
  throw new Error('A Fase 8.32 precisa manter o diagnóstico fora da persistência.');
}
