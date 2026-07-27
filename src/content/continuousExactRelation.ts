import type { BiblicalUnit } from '../domain/types';

export const continuousExactRelationBiblicalUnit: BiblicalUnit = {
  id: 'ecclesiastes_continuous_exact_relation_v1',
  reference: 'Eclesiastes 3:11',
  title: 'Reconhecer uma sequência não é possuir o tempo inteiro',
  principle: 'Campos relacionados podem permanecer coerentes entre si sem transformar sua ordem em prova de verdade, destino ou controle.',
  context: 'Eclesiastes reconhece limites humanos diante do tempo. O Athanor aplica essa imagem a relações técnicas restritas: quantidades, posições e instantes declarados precisam concordar entre si, sem afirmar que o relógio, a narrativa ou a origem são verdadeiros.',
  themes: ['sequência', 'coerência', 'limite', 'tempo', 'relação'],
  application: 'Interromper pacotes cujos campos individualmente válidos se contradizem quando observados em conjunto.',
  provenance: [{
    id: 'eccl-continuous-exact-relation-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; invariantes relacionais e ordem das barreiras são estruturas autorais do Athanor.',
    sourceLabel: 'Eclesiastes 3:11'
  }]
};

export const continuousExactRelationCatalog = {
  id: 'continuous-exact-relation-catalog',
  version: '1.0.0',
  policy: 'reject-cross-field-contradictions-before-domain-v1',
  shareRelations: [
    'item-count-matches-array',
    'positions-sequential-from-one',
    'dates-follow-include-dates-option',
    'completion-requires-occurrence',
    'completion-not-before-occurrence',
    'item-times-not-after-generation'
  ],
  responseRelations: ['no-additional-temporal-relation-v1'],
  comparesWithCurrentClock: false,
  repairsContradictions: false
} as const;

export const continuousExactRelationRestrictions = [
  'A quantidade declarada precisa corresponder à lista de itens',
  'As posições precisam ser sequenciais e iniciar em 1',
  'Datas não podem existir quando a opção declara omissão',
  'Uma conclusão temporal exige ocorrência temporal no mesmo item',
  'Conclusão não pode anteceder ocorrência',
  'Ocorrência e conclusão não podem ser posteriores à geração do pacote',
  'O relógio atual do dispositivo não participa da comparação',
  'Nenhum campo é reordenado, removido, completado ou recalculado',
  'A barreira não prova que um evento realmente aconteceu',
  'A barreira não autentica relógio, identidade, autoria ou intenção',
  'Contradições interrompem o pacote inteiro sem histórico de recusa',
  'Pacotes vazios com quantidade zero continuam válidos'
];
