import type { BiblicalUnit } from '../domain/types';

export const continuousMapBiblicalUnit: BiblicalUnit = {
  id: 'psalm_continuous_map_v1',
  reference: 'Salmos 77:11–12',
  title: 'Lembrar sem transformar memória em medida',
  principle: 'Revisitar registros pode preservar memória e contexto sem produzir ranking, culpa, previsão ou prova de evolução.',
  context: 'O salmo reúne lembrança e meditação sobre obras anteriores. O Athanor aplica essa imagem editorialmente a um mapa local de Rastros e ciclos, sem comparar valor pessoal, maturidade ou direção espiritual.',
  themes: ['memória', 'registro', 'contexto', 'revisão', 'continuidade'],
  application: 'Visualizar, filtrar, comparar e exportar registros locais sem hierarquizar pessoas, elementos, temas, pacotes ou resultados.',
  provenance: [{
    id: 'psalm-continuous-map-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; mapa, filtros, comparação e exportação são estruturas autorais do Athanor.',
    sourceLabel: 'Salmos 77:11–12'
  }]
};

export const continuousMapCatalog = {
  id: 'continuous-map-catalog',
  version: '1.0.0',
  policy: 'descriptive-local-no-ranking-v1',
  mode: 'derived-read-only',
  itemKinds: ['trail', 'theme-cycle'],
  groupKeys: ['element', 'theme', 'package'],
  statusKeys: ['active', 'paused', 'completed', 'declined', 'incomplete', 'unknown'],
  exportFormat: 'json'
} as const;

export const continuousMapGroupOptions = [
  { id: 'element', label: 'Elemento' },
  { id: 'theme', label: 'Tema' },
  { id: 'package', label: 'Pacote' }
] as const;

export const continuousMapStatusOptions = [
  { id: 'all', label: 'Todos os estados' },
  { id: 'active', label: 'Ativo' },
  { id: 'paused', label: 'Pausado' },
  { id: 'completed', label: 'Concluído' },
  { id: 'declined', label: 'Sem ciclo adicional' },
  { id: 'incomplete', label: 'Encerrado ou incompleto' },
  { id: 'unknown', label: 'Desconhecido' }
] as const;

export const continuousMapKindOptions = [
  { id: 'all', label: 'Rastros e ciclos' },
  { id: 'trail', label: 'Somente Rastros' },
  { id: 'theme-cycle', label: 'Somente ciclos temáticos' }
] as const;

export const continuousMapRestrictions = [
  'O mapa é derivado dos registros existentes e não altera nenhum store de progresso.',
  'Quantidade, profundidade, conclusão e repetição não produzem ranking ou pontuação.',
  'Comparações mostram somente igualdade, diferença ou informação desconhecida.',
  'Linha do tempo não calcula streak, frequência ideal, tendência ou consistência.',
  'Registros incompletos, antigos, desconhecidos ou sem tema permanecem visíveis.',
  'Filtros são locais à tela e não redefinem o histórico.',
  'A exportação contém somente IDs curados, metadados de ciclo e datas locais já registradas.',
  'Nenhuma interpretação clínica, psicológica, espiritual ou comportamental é produzida.'
];
