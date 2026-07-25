import type { BiblicalUnit, ClassificationEntry, SymbolicNode } from '../domain/types';

export const biblicalUnits: BiblicalUnit[] = [
  {
    id: 'proverb_listen_before_reply_01',
    reference: 'Provérbios 18:13',
    title: 'Escuta antes da resposta',
    principle: 'Ouvir e compreender antes de responder.',
    context: 'A unidade editorial trabalha prudência na comunicação. O texto bíblico é apresentado como fundamento; as camadas seguintes são leituras comparativas de gameplay.',
    themes: ['escuta', 'prudência', 'comunicação'],
    application: 'Separar o que foi observado, o que foi interpretado e o que ainda precisa ser perguntado.',
    provenance: [
      { id: 'bib-prov-18-13', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência de Provérbios utilizada como ponto de partida editorial.', sourceLabel: 'Provérbios 18:13' }
    ]
  },
  {
    id: 'proverb_proportional_speech_01',
    reference: 'Provérbios 15:1',
    title: 'Palavra proporcional',
    principle: 'A forma, o momento e a intensidade da palavra influenciam suas consequências.',
    context: 'Unidade voltada à revisão da forma de uma resposta, sem invalidar limites firmes ou comunicação direta.',
    themes: ['palavra', 'proporção', 'consequência'],
    application: 'Reformular uma mensagem preservando clareza, objetivo e limite.',
    provenance: [
      { id: 'bib-prov-15-1', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência de Provérbios usada como base do princípio editorial.', sourceLabel: 'Provérbios 15:1' }
    ]
  },
  {
    id: 'proverb_seek_counsel_01',
    reference: 'Provérbios 15:22',
    title: 'Perspectivas e conselho',
    principle: 'Decisões podem ganhar contexto quando outras perspectivas são consideradas.',
    context: 'A aplicação não terceiriza a decisão e não presume que qualquer conselho seja adequado.',
    themes: ['conselho', 'perspectiva', 'decisão'],
    application: 'Identificar qual informação, perspectiva ou apoio está faltando.',
    provenance: [
      { id: 'bib-prov-15-22', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência bíblica para o tema de conselho e planejamento.', sourceLabel: 'Provérbios 15:22' }
    ]
  },
  {
    id: 'proverb_first_step_01',
    reference: 'Provérbios 21:5',
    title: 'Planejamento e primeiro passo',
    principle: 'Planejamento ganha forma quando se torna uma primeira ação possível.',
    context: 'A unidade evita transformar produtividade em valor moral e trabalha somente um passo proporcional.',
    themes: ['planejamento', 'diligência', 'ação'],
    application: 'Definir um primeiro passo limitado e uma revisão posterior.',
    provenance: [
      { id: 'bib-prov-21-5', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência de Provérbios usada no tema de planejamento.', sourceLabel: 'Provérbios 21:5' }
    ]
  }
];

export const chainNodes: SymbolicNode[] = [
  {
    id: 'node_bible_proverbs',
    name: 'Provérbios',
    category: 'biblical',
    description: 'Núcleo bíblico da primeira missão.',
    provenance: { id: 'p-bib', label: 'Fonte bíblica', class: 'BIB', explanation: 'Ponto de partida da cadeia.' }
  },
  {
    id: 'node_prudence_speech',
    name: 'Prudência na palavra',
    category: 'principle',
    description: 'Princípio editorial: ouvir, distinguir e considerar consequências antes de responder.',
    provenance: { id: 'p-principle', label: 'Aplicação editorial', class: 'BIB', explanation: 'Princípio derivado do tema bíblico, separado do texto da fonte.' }
  },
  {
    id: 'node_hod',
    name: 'Hod',
    category: 'sefirah',
    description: 'Campo de linguagem, análise e organização dentro da arquitetura do Templo.',
    layer: 'kabbalah',
    fallbackNodeId: 'node_language_chamber',
    provenance: { id: 'p-hod', label: 'Comparação temática', class: 'CMP', explanation: 'Relação criada para o gameplay entre prudência na palavra e Hod.' }
  },
  {
    id: 'node_language_chamber',
    name: 'Câmara da Linguagem',
    category: 'athanor',
    description: 'Equivalente autoral usado quando a camada cabalística está desligada.',
    provenance: { id: 'p-language', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura autoral de gameplay.' }
  },
  {
    id: 'node_air',
    name: 'Ar',
    category: 'element',
    description: 'Movimento de linguagem, circulação de informação e possibilidade.',
    provenance: { id: 'p-air', label: 'Sistema de gameplay', class: 'ATH', explanation: 'Uso do elemento Ar como eixo funcional do capítulo.' }
  },
  {
    id: 'node_aleph',
    name: 'Aleph',
    category: 'letter',
    description: 'Letra apresentada com contexto do Sefer Yetzirah e usada como componente opcional.',
    layer: 'sefer',
    fallbackNodeId: 'node_breath_symbol',
    provenance: { id: 'p-aleph', label: 'Fonte textual e tradição', class: 'SRC', explanation: 'Camada contextualizada do Sefer Yetzirah.' }
  },
  {
    id: 'node_breath_symbol',
    name: 'Símbolo do Sopro',
    category: 'athanor',
    description: 'Símbolo autoral equivalente para o modo sem Sefer Yetzirah.',
    provenance: { id: 'p-breath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Fallback autoral de gameplay.' }
  },
  {
    id: 'node_xun',
    name: 'Xun',
    category: 'trigram',
    description: 'Movimento gradual e penetrante usado como comparação temática.',
    layer: 'iching',
    fallbackNodeId: 'node_constancy',
    provenance: { id: 'p-xun', label: 'Comparação temática', class: 'CMP', explanation: 'Uso comparativo, não equivalência histórica.' }
  },
  {
    id: 'node_constancy',
    name: 'Movimento da Constância',
    category: 'athanor',
    description: 'Movimento autoral de revisão gradual.',
    provenance: { id: 'p-constancy', label: 'Síntese Athanor', class: 'ATH', explanation: 'Fallback autoral de gameplay.' }
  },
  {
    id: 'node_magician',
    name: 'O Mago',
    category: 'archetype',
    description: 'Arquétipo secundário de direcionamento dos recursos disponíveis.',
    layer: 'tarot',
    fallbackNodeId: 'node_first_artisan',
    provenance: { id: 'p-magician', label: 'Comparação arquetípica', class: 'CMP', explanation: 'Camada narrativa secundária, não origem da missão.' }
  },
  {
    id: 'node_first_artisan',
    name: 'Artesão da Primeira Obra',
    category: 'athanor',
    description: 'Arquétipo autoral equivalente ao Mago.',
    provenance: { id: 'p-artisan', label: 'Síntese Athanor', class: 'ATH', explanation: 'Personagem autoral de gameplay.' }
  },
  {
    id: 'node_lamp',
    name: 'Lâmpada da Palavra Clara',
    category: 'athanor',
    description: 'Instrumento de Jornada criado pela missão.',
    provenance: { id: 'p-lamp', label: 'Síntese Athanor', class: 'ATH', explanation: 'Item original do sistema de crafting.' }
  }
];

export const classificationEntries: ClassificationEntry[] = [
  { id: 'c1', text: 'A reunião está marcada para amanhã.', correctCategory: 'fact' },
  { id: 'c2', text: 'Minha apresentação ficou ruim.', correctCategory: 'interpretation' },
  { id: 'c3', text: 'Todos rejeitarão a proposta.', correctCategory: 'prediction' },
  { id: 'c4', text: 'Quero revisar os três pontos principais.', correctCategory: 'intention' },
  { id: 'c5', text: 'Recebi duas mensagens sem resposta.', correctCategory: 'fact' },
  { id: 'c6', text: 'A pessoa está me ignorando de propósito.', correctCategory: 'interpretation' }
];

export const categories = [
  { id: 'fact', label: 'Fato', help: 'Algo observável ou verificável.' },
  { id: 'interpretation', label: 'Interpretação', help: 'Um significado atribuído ao que ocorreu.' },
  { id: 'prediction', label: 'Previsão', help: 'Uma possibilidade futura tratada como conclusão.' },
  { id: 'intention', label: 'Intenção', help: 'Aquilo que você deseja realizar.' }
] as const;
