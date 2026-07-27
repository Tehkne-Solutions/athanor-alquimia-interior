import type { BiblicalUnit } from '../domain/types';

export const continuousNumericLexemeBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_numeric_lexeme_v1',
  reference: 'Provérbios 16:11',
  title: 'Uma medida declarada não deve mudar sem ser percebida',
  principle: 'Conferir a medida técnica de um número protege o significado declarado sem atribuir valor moral, espiritual ou pessoal ao conteúdo.',
  context: 'O provérbio usa pesos e balanças como imagem de medida justa. O Athanor aplica essa abertura somente à representação numérica de arquivos JSON: um valor não deve ser arredondado, saturado ou reduzido a zero silenciosamente antes da validação.',
  themes: ['medida', 'clareza', 'limite', 'precisão', 'prudência'],
  application: 'Inspecionar os lexemas numéricos antes do JSON.parse e interromper valores que não permanecem equivalentes no modelo Number do JavaScript.',
  provenance: [{
    id: 'prov-continuous-numeric-lexeme-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; scanner lexical, faixa segura e equivalência decimal são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 16:11'
  }]
};

export const continuousNumericLexemeCatalog = {
  id: 'continuous-numeric-lexeme-catalog',
  version: '1.0.0',
  policy: 'exact-decimal-measure-before-json-parse-v1',
  mode: 'raw-json-number-lexeme-inspection',
  maxSafeInteger: Number.MAX_SAFE_INTEGER,
  maxLexemeCharacters: 128,
  negativeZeroAccepted: false,
  overflowAccepted: false,
  underflowToZeroAccepted: false,
  silentRoundingAccepted: false,
  equivalentNotationAccepted: true
} as const;

export const continuousNumericLexemeRestrictions = [
  'A inspeção acontece no texto bruto antes do JSON.parse',
  'Inteiros matemáticos não podem exceder Number.MAX_SAFE_INTEGER',
  'Overflow para Infinity ou -Infinity é recusado',
  'Underflow de valor não zero para zero é recusado',
  'Arredondamentos que alterem a quantidade decimal declarada são recusados',
  'O valor -0 é recusado porque perde o sinal ao ser serializado novamente',
  'Notações equivalentes como 1, 1.0 e 1e0 continuam válidas',
  'Zeros finais e escolha entre E ou e não criam diferença de medida',
  'O Athanor não arredonda, trunca ou substitui o número recebido',
  'O Athanor não converte números recusados em texto',
  'A inspeção não interpreta importância, mérito, custo ou significado pessoal',
  'A inspeção não autentica identidade, autoria, intenção ou veracidade',
  'Nenhuma recusa numérica é persistida, enviada ou contabilizada',
  'Os arquivos gerados pelo Athanor também precisam preservar a própria medida numérica',
  'A política não promete aritmética decimal exata para cálculos futuros'
];
