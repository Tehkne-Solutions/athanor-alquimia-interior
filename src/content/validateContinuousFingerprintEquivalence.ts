import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousFingerprintEquivalenceBiblicalUnit,
  continuousFingerprintEquivalenceCatalog,
  continuousFingerprintEquivalenceRestrictions
} from './continuousFingerprintEquivalence';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_fingerprint_equivalence_v1'),
  reference: z.literal('Provérbios 18:17'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousFingerprintEquivalenceBiblicalUnit);

z.object({
  id: z.literal('continuous-fingerprint-equivalence-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('fingerprint-is-hint-equivalence-decides-v1'),
  fingerprint: z.object({
    prefix: z.literal('received-'),
    hexadecimalLength: z.literal(8),
    lowercaseOnly: z.literal(true),
    algorithm: z.literal('fnv1a-32'),
    cryptographic: z.literal(false),
    authenticatesIdentity: z.literal(false),
    uniqueIdentity: z.literal(false)
  }),
  equivalence: z.object({
    includes: z.array(z.string().min(1)).length(8),
    excludes: z.tuple([z.literal('generatedAt'), z.literal('consistency')]),
    canonicalPropertyOrder: z.literal(true),
    noticeOrderSignificant: z.literal(true)
  }),
  duplicateRule: z.literal('same-fingerprint-and-canonical-equivalence'),
  collisionRule: z.literal('same-fingerprint-and-different-equivalence-keeps-both'),
  lookupRule: z.literal('fingerprint-may-return-multiple-records'),
  maxReportedIssues: z.literal(20)
}).parse(continuousFingerprintEquivalenceCatalog);

z.array(z.string().min(1)).min(16).parse(continuousFingerprintEquivalenceRestrictions);

if (!continuousFingerprintEquivalenceCatalog.equivalence.includes.includes('notices')) {
  throw new Error('A Fase 8.25 precisa incluir avisos canônicos na equivalência.');
}
if (!continuousFingerprintEquivalenceRestrictions.some((restriction) => /preservados separadamente/i.test(restriction))) {
  throw new Error('A Fase 8.25 precisa preservar colisões em vez de descartar pacotes.');
}
if (!continuousFingerprintEquivalenceRestrictions.some((restriction) => /compatibilidade legada/i.test(restriction))) {
  throw new Error('A Fase 8.25 precisa limitar a busca singular por impressão à compatibilidade.');
}
if (!continuousFingerprintEquivalenceRestrictions.some((restriction) => /não comprova/i.test(restriction))) {
  throw new Error('A Fase 8.25 precisa declarar o limite de identidade da impressão.');
}
