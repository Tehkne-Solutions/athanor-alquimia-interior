import type { BiblicalUnit } from '../domain/types';
import { continuousTrailPractices, continuousTrailVariants } from './continuousTrail';

export const continuousVariationBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_variation_v1',
  reference: 'Provérbios 25:11',
  title: 'A forma pode variar sem perder o núcleo',
  principle: 'Uma formulação adequada ao momento pode mudar de forma sem transformar variedade em verdade superior, previsão ou obrigação.',
  context: 'O provérbio relaciona palavra e circunstância. O Athanor aplica essa imagem editorialmente à rotação entre conteúdos previamente curados, sem interpretar o momento pessoal do usuário nem produzir uma mensagem sob medida.',
  themes: ['forma', 'tempo', 'variação', 'núcleo', 'medida'],
  application: 'Manter a variante atual ou solicitar outra versão curada, preservando a mesma estrutura de orientação, observação e revisão.',
  provenance: [{
    id: 'prov-continuous-variation-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; catálogo, rotação e histórico de variantes são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 25:11'
  }]
};

export const continuousTrailCatalogDefinition = {
  id: 'continuous-trail-catalog',
  version: '2.0.0',
  policy: 'deterministic-curated-no-immediate-repeat-v1',
  generationMode: 'curated-only',
  stages: ['orientation', 'observation', 'review'],
  startPoints: ['word', 'water', 'fire', 'earth', 'spirit', 'rest'],
  practiceCount: continuousTrailPractices.length,
  variantCount: continuousTrailVariants.length,
  sensitivePersonalization: false,
  description: 'Catálogo versionado de práticas e variantes auditáveis. A semente define somente a ordem de apresentação entre conteúdos já escritos.'
} as const;

export const continuousVariationActions = [
  {
    id: 'keep_current',
    label: 'Manter variante atual',
    description: 'Preservar o conteúdo exibido sem alterar etapa, prática ou progresso.'
  },
  {
    id: 'request_another',
    label: 'Solicitar outra variante',
    description: 'Selecionar deterministicamente outra variante curada do mesmo elemento, sem repetir imediatamente a atual.'
  }
] as const;

export const continuousVariationRestrictions = [
  'A rotação utiliza somente o elemento, a semente, a versão do catálogo e o contador local de solicitações',
  'Nenhum texto, emoção, decisão, nota ou dado clínico participa da seleção',
  'Solicitar outra variante não altera prática, etapa, resultado ou recompensa',
  'Manter a variante atual é uma escolha completa e não cria penalidade',
  'A rotação nunca devolve imediatamente a variante atual quando existe outra opção',
  'Todas as variantes permanecem escritas, versionadas, auditáveis e armazenadas localmente',
  'Nenhuma variante produz diagnóstico, previsão, leitura oculta ou direção espiritual específica'
];
