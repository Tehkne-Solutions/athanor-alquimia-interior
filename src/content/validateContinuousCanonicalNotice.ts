import { z } from 'zod';
import { provenanceClassSchema } from '../domain/types';
import {
  continuousCanonicalNoticeBiblicalUnit,
  continuousCanonicalNoticeCatalog,
  continuousCanonicalNoticeRestrictions,
  continuousResponseMandatoryNotices,
  continuousShareMandatoryNotices
} from './continuousCanonicalNotice';

const provenanceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  class: provenanceClassSchema,
  explanation: z.string().min(1),
  sourceLabel: z.string().optional()
});

z.object({
  id: z.literal('proverb_continuous_canonical_notice_v1'),
  reference: z.literal('Provérbios 30:6'),
  title: z.string().min(1),
  principle: z.string().min(1),
  context: z.string().min(1),
  themes: z.array(z.string().min(1)).min(5),
  application: z.string().min(1),
  provenance: z.array(provenanceSchema).min(1)
}).parse(continuousCanonicalNoticeBiblicalUnit);

z.object({
  id: z.literal('continuous-canonical-notice-catalog'),
  version: z.literal('1.0.0'),
  policy: z.literal('require-canonical-unique-ordered-notices-v1'),
  unknownNoticesAllowed: z.literal(false),
  duplicateNoticesAllowed: z.literal(false),
  canonicalOrderRequired: z.literal(true),
  derivableConditionsRequired: z.literal(true),
  minimizedOriginNoticeOptional: z.literal(true),
  maxReportedIssues: z.literal(20),
  share: z.object({
    mandatory: z.array(z.string().min(1)).length(11),
    conditional: z.object({
      datesOmitted: z.string().min(1),
      emptyCollection: z.string().min(1),
      unlinkedRecords: z.string().min(1)
    }),
    order: z.array(z.string().min(1)).length(14)
  }),
  response: z.object({
    mandatory: z.array(z.string().min(1)).length(12),
    conditional: z.object({
      emptySource: z.string().min(1),
      silencePreserved: z.string().min(1)
    }),
    order: z.array(z.string().min(1)).length(14)
  })
}).parse(continuousCanonicalNoticeCatalog);

z.array(z.string().min(1)).min(15).parse(continuousCanonicalNoticeRestrictions);

if (new Set(continuousCanonicalNoticeCatalog.share.order).size !== continuousCanonicalNoticeCatalog.share.order.length) {
  throw new Error('A ordem canônica da partilha não pode conter avisos duplicados.');
}
if (new Set(continuousCanonicalNoticeCatalog.response.order).size !== continuousCanonicalNoticeCatalog.response.order.length) {
  throw new Error('A ordem canônica da resposta não pode conter avisos duplicados.');
}
if (!continuousShareMandatoryNotices.every((notice, index) => continuousCanonicalNoticeCatalog.share.order[index] === notice)) {
  throw new Error('Avisos obrigatórios da partilha precisam iniciar a ordem canônica.');
}
if (!continuousResponseMandatoryNotices.every((notice, index) => continuousCanonicalNoticeCatalog.response.order[index] === notice)) {
  throw new Error('Avisos obrigatórios da resposta precisam iniciar a ordem canônica.');
}
if (!continuousCanonicalNoticeRestrictions.some((restriction) => /texto livre/i.test(restriction))) {
  throw new Error('A Fase 8.24 precisa recusar avisos desconhecidos como texto livre.');
}
if (!continuousCanonicalNoticeRestrictions.some((restriction) => /não atravessa a minimização/i.test(restriction))) {
  throw new Error('A Fase 8.24 precisa documentar o aviso opcional cuja origem foi minimizada.');
}
if (!continuousCanonicalNoticeRestrictions.some((restriction) => /não comprovam identidade/i.test(restriction))) {
  throw new Error('A Fase 8.24 precisa declarar os limites dos avisos canônicos.');
}
