import type { BiblicalUnit } from '../domain/types';

export const continuousFieldCompatibilityBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_field_compatibility_v1',
  reference: '1 Coríntios 12:4–6',
  title: 'Distinguir funções não cria uma hierarquia de valor',
  principle: 'Campos diferentes podem cooperar no mesmo registro sem trocar de função, apagar seus limites ou competir por importância.',
  context: 'A passagem reconhece diversidade de dons, serviços e operações. O Athanor usa essa imagem editorialmente para preservar distinções técnicas entre Rastro, ciclo, tema, pacote e encerramento, sem transformar estrutura de dados em julgamento espiritual.',
  themes: ['distinção', 'função', 'compatibilidade', 'limite', 'cooperação'],
  application: 'Interromper combinações de campos incompatíveis antes do parser de domínio, sem completar, remover ou reinterpretar o pacote.',
  provenance: [{
    id: 'prov-continuous-field-compatibility-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; discriminantes, indicadores e regras de compatibilidade são estruturas autorais do Athanor.',
    sourceLabel: '1 Coríntios 12:4–6'
  }]
};

export const continuousFieldCompatibilityCatalog = {
  id: 'continuous-field-compatibility-catalog',
  version: '1.0.0',
  policy: 'reject-discriminant-field-conflicts-before-domain-v1',
  phase: '8.22',
  maxReportedIssues: 20,
  shareRules: [
    'themeId-excludes-noTheme',
    'packageId-and-packageLabel-travel-together',
    'trail-excludes-cycle-only-fields',
    'declined-status-requires-theme-cycle',
    'endedEarly-requires-theme-cycle-incomplete',
    'completed-excludes-pending-and-early-end'
  ],
  responseRules: []
} as const;

export const continuousFieldCompatibilityRestrictions = [
  'A barreira verifica somente combinações entre campos já conhecidos',
  'Tema explícito e ausência explícita de tema não podem coexistir',
  'Identificador e rótulo de pacote precisam aparecer juntos',
  'Rastros não podem carregar pacote, profundidade, recusa ou encerramento antecipado de ciclo',
  'Estado recusado pertence somente a ciclo temático',
  'Encerramento antecipado pertence somente a ciclo temático incompleto',
  'Estado concluído não pode manter passagens pendentes nem encerramento antecipado',
  'Tema desconhecido continua válido quando themeId está ausente e noTheme é false',
  'A barreira não exige pacote ou profundidade quando o contrato os mantém opcionais',
  'Nenhum campo é removido, completado, invertido ou recalculado',
  'O pacote de resposta atual não possui discriminantes opcionais adicionais',
  'A coerência estrutural não comprova identidade, autoria, intenção ou veracidade',
  'Nenhum resultado é persistido, enviado ou contabilizado'
];
