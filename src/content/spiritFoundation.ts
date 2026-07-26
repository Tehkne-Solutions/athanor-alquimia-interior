import type { BiblicalUnit, SymbolicNode } from '../domain/types';

export const spiritFoundationBiblicalUnit: BiblicalUnit = {
  id: 'psalm_word_and_inner_meditation_01',
  reference: 'Salmos 19:14',
  title: 'Palavra, interioridade e caminho',
  principle: 'Palavra e movimento interior podem ser observados juntos antes de uma escolha, sem transformar essa observação em certeza ou julgamento.',
  context: 'O Salmo aproxima as palavras pronunciadas e a meditação interior. O Athanor usa essa relação como núcleo editorial para integrar palavra, emoção, impulso, corpo e ação; não afirma ler o coração, diagnosticar estados ou garantir aprovação espiritual.',
  themes: ['palavra', 'interioridade', 'síntese', 'corpo', 'ação', 'revisão'],
  application: 'Preparar uma prática de síntese que permita distinguir e reunir cinco dimensões sem exigir confissão, interpretação oculta ou resposta imediata.',
  provenance: [{
    id: 'spirit_psalm_19_14_bib',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'Referência bíblica que inicia o Capítulo do Espírito. A missão, os estados e o Santuário são adaptações editoriais e de gameplay do Athanor.',
    sourceLabel: 'Salmos 19:14'
  }]
};

export const spiritFoundationNodes: SymbolicNode[] = [
  {
    id: 'spirit_psalm_19_14',
    name: 'Salmos 19:14',
    category: 'biblical',
    description: 'Núcleo editorial que aproxima palavra pronunciada e movimento interior.',
    provenance: spiritFoundationBiblicalUnit.provenance[0]
  },
  {
    id: 'spirit_integrated_thread_v1',
    name: 'O Fio que Reúne',
    category: 'principle',
    description: 'Primeira missão planejada do Espírito: distinguir e reunir palavra, emoção, impulso, corpo e ação sem produzir diagnóstico ou oráculo.',
    provenance: {
      id: 'spirit_integrated_thread_ath',
      label: 'Síntese Athanor',
      class: 'ATH',
      explanation: 'Princípio e missão autorais criados pela Tehkné Solutions.'
    }
  },
  {
    id: 'spirit_keter_v1',
    name: 'Keter',
    category: 'sefirah',
    description: 'Comparação opcional com unidade e perspectiva acima das partes, sem hierarquizar a experiência do usuário.',
    layer: 'kabbalah',
    fallbackNodeId: 'spirit_center_sanctuary_v1',
    provenance: {
      id: 'spirit_keter_cmp',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Keter é usada como arquitetura comparativa; não é conteúdo de Salmos nem medida de realização espiritual.'
    }
  },
  {
    id: 'spirit_center_sanctuary_v1',
    name: 'Centro do Santuário',
    category: 'athanor',
    description: 'Fallback autoral para reunir dimensões sem estabelecer superioridade entre elas.',
    provenance: {
      id: 'spirit_center_sanctuary_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Estrutura autoral usada quando Cabala está desativada.'
    }
  },
  {
    id: 'spirit_ruach_v1',
    name: 'Ruach · Sopro',
    category: 'element',
    description: 'Comparação textual opcional com sopro e movimento, sem identificar o usuário com uma entidade ou estado espiritual.',
    layer: 'sefer',
    fallbackNodeId: 'spirit_breath_integration_v1',
    provenance: {
      id: 'spirit_ruach_cmp',
      label: 'Comparação textual',
      class: 'CMP',
      explanation: 'Uso comparativo do Athanor para representar transição e integração; não é apresentado como conteúdo bíblico.'
    }
  },
  {
    id: 'spirit_breath_integration_v1',
    name: 'Sopro da Integração',
    category: 'athanor',
    description: 'Fallback autoral para passagem entre observação, pausa e escolha.',
    provenance: {
      id: 'spirit_breath_integration_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Movimento autoral usado quando Sefer está desativado.'
    }
  },
  {
    id: 'spirit_qian_v1',
    name: 'Qian · Céu',
    category: 'trigram',
    description: 'Comparação opcional com iniciativa e movimento criativo, sem função de previsão ou recomendação automática.',
    layer: 'iching',
    fallbackNodeId: 'spirit_coherent_movement_v1',
    provenance: {
      id: 'spirit_qian_cmp',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Qian é aplicado comparativamente à passagem da síntese para uma ação escolhida, sem uso oracular nesta fase.'
    }
  },
  {
    id: 'spirit_coherent_movement_v1',
    name: 'Movimento da Coerência Possível',
    category: 'athanor',
    description: 'Fallback autoral para escolher uma direção revisável sem prometer coerência perfeita.',
    provenance: {
      id: 'spirit_coherent_movement_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Movimento autoral usado quando I Ching está desativado.'
    }
  },
  {
    id: 'spirit_world_v1',
    name: 'O Mundo',
    category: 'archetype',
    description: 'Arquétipo opcional de síntese e fechamento de ciclo, sem definir identidade, destino ou completude pessoal.',
    layer: 'tarot',
    fallbackNodeId: 'spirit_keeper_whole_v1',
    provenance: {
      id: 'spirit_world_cmp',
      label: 'Comparação arquetípica',
      class: 'CMP',
      explanation: 'O Arcano é usado como postura narrativa de síntese; não determina resultado ou condição espiritual.'
    }
  },
  {
    id: 'spirit_keeper_whole_v1',
    name: 'Guardiã do Conjunto Possível',
    category: 'athanor',
    description: 'Fallback autoral para preservar diferenças enquanto as dimensões são observadas em conjunto.',
    provenance: {
      id: 'spirit_keeper_whole_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Arquétipo autoral usado quando Tarot está desativado.'
    }
  }
];

export const spiritSynthesisDimensions = [
  { id: 'word', label: 'Palavra', description: 'O que foi dito, ouvido ou formulado, sem confirmar intenções ocultas.' },
  { id: 'emotion', label: 'Emoção', description: 'Movimento emocional nomeado sem diagnóstico ou valor moral.' },
  { id: 'impulse', label: 'Impulso', description: 'Vontade imediata distinguida da ação que será escolhida.' },
  { id: 'body', label: 'Corpo percebido', description: 'Sinal percebido sem interpretação médica.' },
  { id: 'action', label: 'Ação', description: 'Uma escolha segura, reversível e recusável — incluindo não agir.' }
] as const;
