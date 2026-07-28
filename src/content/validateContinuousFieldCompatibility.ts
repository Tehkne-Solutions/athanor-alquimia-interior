import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousFieldCompatibilityBiblicalUnit,
  continuousFieldCompatibilityCatalog,
  continuousFieldCompatibilityRestrictions
} from './continuousFieldCompatibility';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_field_compatibility_v1'),
  reference: z.literal('1 Coríntios 12:4–6'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousFieldCompatibilityBiblicalUnit);

z.object({
  id: z.literal('continuous-field-compatibility-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('reject-discriminant-field-conflicts-before-domain-v1'),
  phase: z.literal('8.22'),
  maxReportedIssues: z.literal(20),
  shareRules: z.array(z.string().min(1)).min(6),
  responseRules: z.array(z.string())
}).parse(continuousFieldCompatibilityCatalog);

z.array(z.string().min(1)).min(13).parse(continuousFieldCompatibilityRestrictions);

if (!continuousFieldCompatibilityRestrictions.some((entry) => /tema explícito.*ausência explícita/i.test(entry))) {
  throw new Error('A Fase 8.22 precisa impedir tema explícito e ausência explícita simultâneos.');
}

if (!continuousFieldCompatibilityRestrictions.some((entry) => /Rastros não podem carregar pacote/i.test(entry))) {
  throw new Error('A Fase 8.22 precisa separar campos de Rastro e ciclo temático.');
}

if (!continuousFieldCompatibilityRestrictions.some((entry) => /não comprova identidade/i.test(entry))) {
  throw new Error('A Fase 8.22 precisa declarar os limites da coerência estrutural.');
}
