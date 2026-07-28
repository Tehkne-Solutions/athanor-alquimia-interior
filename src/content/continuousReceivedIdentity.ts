import type { BiblicalUnit } from '../domain/types';

export const continuousReceivedIdentityBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_received_identity_v1',
  reference: 'Provérbios 20:10',
  title: 'O sinal local não recebe duas medidas',
  principle: 'Um identificador usado para agir sobre uma cópia local precisa apontar para uma única ocorrência, sem alcançar outra por coincidência.',
  context: 'O provérbio recusa medidas divergentes. O Athanor aplica essa imagem somente ao contrato técnico da biblioteca recebida: um mesmo identificador local não pode selecionar duas cópias distintas.',
  themes: ['identificador', 'medida', 'unicidade', 'biblioteca', 'ação local'],
  application: 'Alocar identificadores locais únicos, informar desambiguação e interromper ações quando uma biblioteca legada contém mais de uma ocorrência do mesmo identificador.',
  provenance: [{
    id: 'prov-received-identity-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; alocação, sufixos e estados de mutação são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 20:10'
  }]
};

export const continuousReceivedIdentityPolicy = {
  id: 'continuous-received-identity-policy',
  version: '1.0.0',
  policy: 'unique-local-record-id-no-bulk-mutation-v1',
  separator: '--',
  firstSuffix: 2,
  maxSuffix: 10_000,
  equivalentCopyPrecedesAllocation: true,
  disambiguationReported: true,
  ambiguousLegacyMutationAllowed: false,
  bulkMutationByIdAllowed: false,
  renamesPackageContent: false,
  persistsConflictHistory: false
} as const;

export const continuousReceivedIdentityRestrictions = [
  'O identificador solicitado é tratado como candidato local e não como dado do pacote',
  'Uma cópia equivalente é reconhecida antes da alocação de identificador',
  'Um identificador livre é preservado exatamente',
  'Um identificador ocupado recebe o primeiro sufixo local disponível',
  'A desambiguação é informada pelo resultado explícito da operação',
  'Nenhum campo do pacote recebido é reescrito durante a desambiguação',
  'Bibliotecas legadas podem conter identificadores duplicados e permanecem preservadas',
  'Uma ação por identificador ambíguo não arquiva, reativa ou remove nenhuma cópia',
  'Ações singulares nunca percorrem e alteram todas as ocorrências de um identificador',
  'Ausência de registro e ambiguidade são estados diferentes',
  'Nenhum histórico de conflitos, analytics ou telemetria é criado',
  'Identificador local não comprova identidade, autoria, origem ou autenticidade'
];
