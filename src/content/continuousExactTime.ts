import type { BiblicalUnit } from '../domain/types';

export const continuousExactTimeBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_exact_time_v1',
  reference: 'Eclesiastes 3:1',
  title: 'Nomear um tempo não autoriza transformá-lo em outro',
  principle: 'Um instante declarado pode ser conferido sem ser aproximado, deslocado de fuso ou corrigido silenciosamente.',
  context: 'Eclesiastes reconhece tempos distintos. O Athanor usa essa imagem editorialmente para exigir instantes UTC explícitos e canônicos, sem interpretar o significado humano de uma data nem prometer exatidão do relógio de origem.',
  themes: ['tempo', 'instante', 'limite', 'clareza', 'preservação'],
  application: 'Validar campos temporais conhecidos antes do parser de domínio, sem converter, completar ou normalizar o texto recebido.',
  provenance: [{
    id: 'prov-continuous-exact-time-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; formato UTC, round-trip e relações temporais são estruturas autorais do Athanor.',
    sourceLabel: 'Eclesiastes 3:1'
  }]
};

export const continuousExactTimeCatalog = {
  id: 'continuous-exact-time-catalog',
  version: '1.0.0',
  policy: 'reject-noncanonical-temporal-instants-before-domain-v1',
  format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  timezone: 'UTC',
  fractionalDigits: 3,
  acceptsOffsets: false,
  normalizesInput: false,
  validatesRoundTrip: true,
  validatesItemOrder: true,
  maxReportedIssues: 20
} as const;

export const continuousExactTimeRestrictions = [
  'Somente instantes UTC com milissegundos e sufixo Z são aceitos',
  'Offsets como +00:00 ou -03:00 são recusados mesmo quando representam o mesmo instante',
  'Horários sem fuso explícito são recusados',
  'Datas impossíveis são recusadas em vez de normalizadas pelo Date',
  'Segundos intercalares não são convertidos automaticamente',
  'A precisão precisa conter exatamente três dígitos de milissegundos',
  'A representação precisa sobreviver ao round-trip de Date.toISOString sem mudança',
  'Quando ocorrência e conclusão coexistem, a conclusão não pode anteceder a ocorrência',
  'Campos temporais opcionais ausentes permanecem ausentes',
  'A validação não altera, completa ou substitui o texto recebido',
  'A validação não comprova que o relógio de origem estava correto',
  'A validação não comprova identidade, autoria, intenção ou veracidade',
  'Nenhum fuso local do dispositivo participa da interpretação',
  'Nenhum histórico de recusas ou correções é persistido',
  'A geração de arquivos usa a mesma regra aplicada à recepção'
];
