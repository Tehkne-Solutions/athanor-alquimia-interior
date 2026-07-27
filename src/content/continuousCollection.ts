import type { BiblicalUnit } from '../domain/types';

export interface ContinuousCollectionTemplate {
  id: string;
  label: string;
  description: string;
}

export const continuousCollectionBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_collection_v1',
  reference: 'Provérbios 24:3–4',
  title: 'Organizar uma casa não mede o valor de quem a habita',
  principle: 'Sabedoria, entendimento e conhecimento podem organizar uma coleção sem transformar quantidade, raridade ou preenchimento em mérito pessoal.',
  context: 'O provérbio descreve uma casa edificada e seus espaços preenchidos. O Athanor usa essa imagem editorialmente para reunir registros locais, sem prometer prosperidade, superioridade, completude ou aprovação espiritual.',
  themes: ['casa', 'organização', 'memória', 'limite', 'coleção'],
  application: 'Criar coleções vazias ou preenchidas, ordenar referências e arquivá-las sem alterar os registros de origem.',
  provenance: [{
    id: 'prov-continuous-collection-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; catálogo, coleções, ordenação e importação são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 24:3–4'
  }]
};

export const continuousCollectionCatalog = {
  id: 'continuous-collection-catalog',
  version: '1.0.0',
  policy: 'explicit-reference-no-accumulated-value-v1',
  mode: 'local-curated-references',
  importSchemas: ['athanor-continuous-map-export-v1'],
  futureSharing: 'explicit-consent-only'
} as const;

export const continuousCollectionTemplates: ContinuousCollectionTemplate[] = [
  { id: 'collection-open', label: 'Coleção aberta', description: 'Reunir referências sem impor tema ou direção.' },
  { id: 'collection-word', label: 'Palavra e formulação', description: 'Agrupar Rastros e ciclos ligados à Palavra.' },
  { id: 'collection-water', label: 'Água, memória e apoio', description: 'Agrupar registros de emoção, memória, apoio e repouso.' },
  { id: 'collection-fire', label: 'Fogo, limite e transformação', description: 'Agrupar registros de impulso, limite e transformação.' },
  { id: 'collection-earth', label: 'Terra, recurso e ritmo', description: 'Agrupar registros de corpo, recursos, ritmo e ordem.' },
  { id: 'collection-spirit', label: 'Espírito e síntese possível', description: 'Agrupar registros de conselho, decisão e retorno.' },
  { id: 'collection-rest', label: 'Repouso e memória preservada', description: 'Reunir pausas e registros sem convertê-los em produtividade.' }
];

export const continuousCollectionRestrictions = [
  'Coleções vazias são válidas e completas',
  'Quantidade de itens não concede recompensa, nível ou restauração',
  'Remover uma referência não apaga o Rastro ou ciclo de origem',
  'Ordenação manual não representa prioridade, importância ou valor',
  'Coleções arquivadas permanecem preservadas e podem ser reativadas',
  'Importação aceita somente schema e política conhecidos do mapa local',
  'Registros desconhecidos são preservados como desconhecidos, sem interpretação',
  'Nenhum texto pessoal, emoção, nota ou diagnóstico é solicitado',
  'Partilha exige consentimento explícito e gera somente um arquivo local minimizado',
  'Todos os dados permanecem no dispositivo até uma exportação deliberada'
];
