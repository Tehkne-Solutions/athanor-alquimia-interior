import type { BiblicalUnit, SymbolicNode } from '../domain/types';

export const fireFoundationBiblicalUnit: BiblicalUnit = {
  id: 'proverb_name_the_flame_01',
  reference: 'Provérbios 16:32',
  title: 'Potência, medida e domínio do gesto',
  principle: 'Força também pode significar reconhecer a intensidade, criar um intervalo e escolher uma ação proporcional.',
  context: 'O provérbio contrapõe conquista externa e domínio de si. O Athanor utiliza essa tensão como entrada editorial para distinguir emoção, impulso, intenção e ação sem tratar ira ou intensidade como diagnóstico.',
  themes: ['potência', 'medida', 'ira', 'ação proporcional'],
  application: 'Iniciar O Nome da Chama, reconhecendo intensidade sem convertê-la automaticamente em ação.',
  provenance: [
    {
      id: 'bib-proverb-16-32',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência de Provérbios usada como núcleo editorial da primeira missão do capítulo do Fogo.',
      sourceLabel: 'Provérbios 16:32'
    }
  ]
};

export const fireFoundationNodes: SymbolicNode[] = [
  {
    id: 'gevurah_limit_v1',
    name: 'Gevurah',
    category: 'sefirah',
    description: 'Camada comparativa para limite, contenção e responsabilidade. Não é apresentada como conteúdo de Provérbios.',
    layer: 'kabbalah',
    fallbackNodeId: 'limit_chamber_v1',
    provenance: {
      id: 'cmp-gevurah-limit',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Uso comparativo na arquitetura do capítulo do Fogo.',
      sourceLabel: 'Síntese Athanor'
    }
  },
  {
    id: 'limit_chamber_v1',
    name: 'Câmara do Limite',
    category: 'athanor',
    description: 'Fallback autoral para organizar intensidade, pausa e ação proporcional.',
    provenance: {
      id: 'ath-limit-chamber',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Ambiente autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'named_flame_v1',
    name: 'Chama Nomeada',
    category: 'athanor',
    description: 'Componente de gameplay que registra o reconhecimento de intensidade, pausa, necessidade e ação sem atribuir valor moral ou clínico.',
    provenance: {
      id: 'ath-named-flame',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Componente criado pela primeira missão do Fogo.',
      sourceLabel: 'Tehkné Solutions'
    }
  }
];
