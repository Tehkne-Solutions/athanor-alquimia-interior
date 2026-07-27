import type { BiblicalUnit } from '../domain/types';

export const continuousInertJsonBiblicalUnit: BiblicalUnit = {
  id: 'corinthians_continuous_inert_json_v1',
  reference: '1 Coríntios 14:40',
  title: 'Ordem visível não precisa esconder comportamento',
  principle: 'Uma estrutura pode permanecer simples, legível e limitada sem carregar ações ocultas, identidade presumida ou autoridade sobre quem a recebe.',
  context: 'A referência bíblica inicia uma reflexão sobre ordem. O Athanor aplica essa imagem apenas ao formato técnico dos arquivos: dados compartilhados precisam permanecer JSON inerte, sem funções, acessores, protótipos especiais ou chaves reservadas.',
  themes: ['ordem', 'forma', 'limite', 'clareza', 'inércia'],
  application: 'Validar que pacotes locais contêm somente valores JSON simples e propriedades de dados visíveis antes das demais barreiras técnicas.',
  provenance: [{
    id: 'prov-continuous-inert-json-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; validação de protótipos, descritores e chaves reservadas é estrutura autoral do Athanor.',
    sourceLabel: '1 Coríntios 14:40'
  }]
};

export const continuousInertJsonCatalog = {
  id: 'continuous-inert-json-catalog',
  version: '1.0.0',
  policy: 'plain-json-no-hidden-behavior-v1',
  mode: 'iterative-own-data-properties-only',
  maxInspectionNodes: 10_000,
  allowObjectPrototype: true,
  allowNullPrototype: true,
  allowArrayPrototype: true,
  allowAccessors: false,
  allowSymbols: false,
  allowFunctions: false,
  allowBigInt: false,
  allowUndefined: false,
  allowNonFiniteNumbers: false,
  allowSparseArrays: false,
  allowRepeatedReferences: false,
  dangerousKeys: ['__proto__', 'prototype', 'constructor'] as const
} as const;

export const continuousInertJsonRestrictions = [
  'Somente null, booleanos, strings, números finitos, listas e objetos simples são aceitos',
  'Funções, símbolos, bigint e undefined são recusados',
  'NaN e infinitos são recusados porque não pertencem ao JSON interoperável',
  'Objetos de classe, Date, Map, Set e protótipos especiais são recusados',
  'Getters e setters são recusados antes que seus valores sejam lidos',
  'Propriedades simbólicas são recusadas',
  'Chaves __proto__, prototype e constructor são recusadas em qualquer profundidade',
  'Arrays esparsos e propriedades extras em arrays são recusados',
  'Referências repetidas ou circulares são recusadas em chamadas diretas de domínio',
  'Objetos com protótipo nulo são aceitos quando contêm somente propriedades de dados enumeráveis',
  'A validação não executa, converte, normaliza ou repara valores recusados',
  'Recusar uma forma técnica não julga o conteúdo nem a pessoa relacionada a ele',
  'Nenhum resultado de validação é persistido ou enviado',
  'A forma inerte não comprova autenticidade, segurança ou veracidade'
];
