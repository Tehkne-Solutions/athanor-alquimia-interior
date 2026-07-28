import type { BiblicalUnit } from '../domain/types';

export const continuousFingerprintEquivalenceBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_fingerprint_equivalence_v1',
  reference: 'Provérbios 18:17',
  title: 'A primeira impressão não encerra a conferência',
  principle: 'Um indício pode orientar a busca, mas não deve decidir sozinho que dois registros são o mesmo conteúdo.',
  context: 'O provérbio lembra que uma primeira apresentação pode parecer suficiente até ser examinada. O Athanor aplica essa imagem tecnicamente às impressões locais, sem transformar o texto bíblico em prova de identidade ou regra criptográfica.',
  themes: ['impressão', 'conferência', 'equivalência', 'colisão', 'preservação'],
  application: 'Usar a impressão apenas para agrupar candidatos e exigir equivalência canônica antes de descartar uma cópia como duplicada.',
  provenance: [{
    id: 'prov-fingerprint-equivalence-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; algoritmo, projeção de equivalência e política de colisões são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 18:17'
  }]
};

export const continuousFingerprintEquivalenceCatalog = {
  id: 'continuous-fingerprint-equivalence-catalog',
  version: '1.0.0',
  policy: 'fingerprint-is-hint-equivalence-decides-v1',
  fingerprint: {
    prefix: 'received-',
    hexadecimalLength: 8,
    lowercaseOnly: true,
    algorithm: 'fnv1a-32',
    cryptographic: false,
    authenticatesIdentity: false,
    uniqueIdentity: false
  },
  equivalence: {
    includes: [
      'schema',
      'policy',
      'catalogVersion',
      'provenance',
      'collection',
      'options',
      'items',
      'notices'
    ],
    excludes: ['generatedAt', 'consistency'],
    canonicalPropertyOrder: true,
    noticeOrderSignificant: true
  },
  duplicateRule: 'same-fingerprint-and-canonical-equivalence',
  collisionRule: 'same-fingerprint-and-different-equivalence-keeps-both',
  lookupRule: 'fingerprint-may-return-multiple-records',
  maxReportedIssues: 20
} as const;

export const continuousFingerprintEquivalenceRestrictions = [
  'A impressão local nunca é tratada como identidade exclusiva',
  'Uma impressão igual somente seleciona candidatos para comparação',
  'A deduplicação exige impressão igual e equivalência canônica do conteúdo',
  'Pacotes com a mesma impressão e conteúdo diferente são preservados separadamente',
  'Diferenças nos avisos canônicos participam da equivalência',
  'Diferenças somente em generatedAt não criam uma nova cópia equivalente',
  'Diferenças somente no selo de consistência não criam uma nova cópia equivalente',
  'A ordem das propriedades de objetos não altera a equivalência canônica',
  'A ordem de itens e avisos permanece semanticamente significativa',
  'A busca por impressão pode retornar mais de um registro',
  'A primeira ocorrência por impressão permanece apenas como compatibilidade legada',
  'Nenhum pacote é removido ou sobrescrito por uma colisão descritiva',
  'A impressão de resposta precisa usar o formato received seguido de oito hexadecimais minúsculos',
  'Formato canônico não comprova que a origem existe ou pertence a alguém',
  'A validação não executa getters nem consulta fontes externas',
  'Nenhum histórico de colisões, analytics ou telemetria é criado'
];
