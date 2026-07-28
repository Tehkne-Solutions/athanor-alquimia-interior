import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousReceivedHydrationGateBiblicalUnit,
  continuousReceivedHydrationGatePolicy,
  continuousReceivedHydrationGateRestrictions
} from './continuousReceivedHydrationGate';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('eclesiastes_continuous_received_hydration_gate_v1'),
  reference: z.literal('Eclesiastes 3:1'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousReceivedHydrationGateBiblicalUnit);

z.object({
  id: z.literal('continuous-received-hydration-gate-policy'),
  version: z.literal('1.0.0'),
  policy: z.literal('block-received-actions-until-hydration-settles-v1'),
  blockedStatus: z.literal('initial'),
  unavailableStatus: z.literal('unavailable'),
  queueBlockedActions: z.literal(false),
  replayBlockedActions: z.literal(false),
  preserveRuntimeRegistryOnBlock: z.literal(true),
  persistBlockedDiagnostics: z.literal(false),
  disableInteractiveControls: z.literal(true)
}).parse(continuousReceivedHydrationGatePolicy);

z.array(z.string().min(1)).min(10).parse(continuousReceivedHydrationGateRestrictions);

if (!continuousReceivedHydrationGateRestrictions.some((item) => /não é enfileirada/i.test(item))) {
  throw new Error('A Fase 8.33 precisa proibir fila e repetição automática de ações bloqueadas.');
}
if (!continuousReceivedHydrationGateRestrictions.some((item) => /unavailable/i.test(item))) {
  throw new Error('A Fase 8.33 precisa diferenciar falha da IndexedDB de biblioteca vazia.');
}
if (!continuousReceivedHydrationGateRestrictions.some((item) => /fora da IndexedDB/i.test(item))) {
  throw new Error('A Fase 8.33 precisa manter diagnósticos de bloqueio fora da persistência.');
}
