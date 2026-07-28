import type { ProvenanceEntry } from '../domain/types';

export const continuousReceivedFingerprintIntegrityBiblicalUnit = {
  id: 'proverb_continuous_received_fingerprint_integrity_v1',
  reference: 'Provérbios 16:11',
  title: 'A medida guardada precisa continuar correspondendo ao que mede',
  principle: 'Uma marca local só pode orientar decisões quando permanece coerente com o conteúdo do qual foi calculada.',
  context: 'A impressão curta da biblioteca é descritiva, local e sujeita a colisões; por isso não pode divergir silenciosamente do pacote armazenado.',
  themes: ['medida', 'coerência', 'registro', 'prudência', 'integridade'],
  application: 'Recalcular a impressão antes de deduplicar ou alterar a biblioteca, recusando divergências sem reparo automático.',
  provenance: [{
    id: 'bib-continuous-received-fingerprint-integrity',
    label: 'Peso e balança justos',
    class: 'BIB',
    explanation: 'Provérbios 16:11 orienta a coerência da medida sem transformar a impressão local em prova de autoria.',
    sourceLabel: 'Provérbios 16:11'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedFingerprintIntegrityPolicy = {
  id: 'continuous-received-fingerprint-integrity-policy',
  version: '1.0.0',
  policy: 'stored-fingerprint-matches-package-scope-v1',
  recomputeBeforeDeduplication: true,
  recomputeBeforeMutation: true,
  repairMismatch: false,
  trustStoredFingerprintAlone: false,
  inspectOnlyHistoricalFingerprintScope: true,
  maxReportedIssues: 20
} as const;

export const continuousReceivedFingerprintIntegrityRestrictions = [
  'A impressão armazenada precisa usar o formato canônico received-xxxxxxxx.',
  'A impressão precisa ser recalculada com o mesmo algoritmo e escopo histórico.',
  'Uma divergência bloqueia deduplicação, arquivamento, reativação e remoção.',
  'A divergência nunca é corrigida substituindo o campo persistido.',
  'O pacote guardado nunca é reescrito para coincidir com a impressão.',
  'A impressão curta continua sujeita a colisões e não decide equivalência sozinha.',
  'A comparação canônica completa continua posterior à seleção dos candidatos.',
  'generatedAt permanece fora do escopo histórico da impressão.',
  'notices permanece fora do escopo histórico da impressão.',
  'consistency permanece fora do escopo histórico da impressão.',
  'Uma falha preserva exatamente a instância original da biblioteca.',
  'A impressão não comprova autoria, identidade, origem, entrega ou autenticidade.'
] as const;
