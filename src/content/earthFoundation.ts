import type { BiblicalUnit, SymbolicNode } from '../domain/types';

export const earthFoundationBiblicalUnit: BiblicalUnit = {
  id: 'psalm_rest_and_measure_01',
  reference: 'Salmos 127:2',
  title: 'Descanso, trabalho e medida',
  principle: 'Trabalho, descanso e sustento precisam de medida; atividade contínua não é prova de valor.',
  context: 'O Salmo contrasta esforço ansioso e repouso. O Athanor usa essa tensão editorialmente, sem prometer prosperidade, sono ou resultado material.',
  themes: ['descanso', 'trabalho', 'medida', 'corpo', 'limite'],
  application: 'Observar condições percebidas do corpo e escolher uma ação pequena, segura e recusável antes de organizar tarefas.',
  provenance: [
    {
      id: 'earth_psalm_127_2_bib',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência bíblica que inicia a fundação do capítulo da Terra.',
      sourceLabel: 'Salmos 127:2'
    }
  ]
};

export const earthFoundationNodes: SymbolicNode[] = [
  {
    id: 'earth_psalm_127_2',
    name: 'Salmos 127:2',
    category: 'biblical',
    description: 'Núcleo editorial sobre esforço, repouso e medida.',
    provenance: earthFoundationBiblicalUnit.provenance[0]
  },
  {
    id: 'earth_body_before_work',
    name: 'O Corpo Chega Primeiro',
    category: 'principle',
    description: 'Princípio de gameplay que coloca observação e limite antes da tarefa.',
    provenance: {
      id: 'earth_body_before_work_ath',
      label: 'Síntese Athanor',
      class: 'ATH',
      explanation: 'Aplicação de gameplay criada pela Tehkné Solutions.'
    }
  },
  {
    id: 'earth_malkhut',
    name: 'Malkhut',
    category: 'sefirah',
    description: 'Comparação temática opcional com presença material, forma e realização.',
    layer: 'kabbalah',
    fallbackNodeId: 'earth_embodied_room',
    provenance: {
      id: 'earth_malkhut_cmp',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Malkhut é usada como arquitetura comparativa, não como conteúdo bíblico.'
    }
  },
  {
    id: 'earth_embodied_room',
    name: 'Câmara da Presença Concreta',
    category: 'athanor',
    description: 'Fallback autoral para a camada cabalística.',
    provenance: {
      id: 'earth_embodied_room_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Nome autoral utilizado quando Cabala está desativada.'
    }
  },
  {
    id: 'earth_kun',
    name: 'Kun',
    category: 'trigram',
    description: 'Comparação temática opcional com receptividade, sustentação e solo.',
    layer: 'iching',
    fallbackNodeId: 'earth_receptive_ground',
    provenance: {
      id: 'earth_kun_cmp',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Kun é aplicado comparativamente à sustentação, sem prever resultados.'
    }
  },
  {
    id: 'earth_receptive_ground',
    name: 'Movimento do Solo Receptivo',
    category: 'athanor',
    description: 'Fallback autoral para a camada do I Ching.',
    provenance: {
      id: 'earth_receptive_ground_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Movimento autoral utilizado quando I Ching está desativado.'
    }
  },
  {
    id: 'earth_empress',
    name: 'A Imperatriz',
    category: 'archetype',
    description: 'Comparação arquetípica opcional com cultivo, cuidado e forma viva.',
    layer: 'tarot',
    fallbackNodeId: 'earth_keeper_living_form',
    provenance: {
      id: 'earth_empress_cmp',
      label: 'Comparação arquetípica',
      class: 'CMP',
      explanation: 'O Arcano é usado como postura narrativa, sem definir identidade ou destino.'
    }
  },
  {
    id: 'earth_keeper_living_form',
    name: 'Guardiã da Forma Viva',
    category: 'athanor',
    description: 'Fallback autoral para a camada de Tarot.',
    provenance: {
      id: 'earth_keeper_living_form_ath',
      label: 'Fallback Athanor',
      class: 'ATH',
      explanation: 'Arquétipo autoral utilizado quando Tarot está desativado.'
    }
  }
];
