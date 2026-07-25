import type { BiblicalUnit, SymbolicNode, WaterEmotionId, WaterNeedId } from '../domain/types';
import type { WaterMemoryCategory, WaterMemoryEntry, WaterPresenceAnchor } from '../domain/waterMemory';

export const waterBiblicalUnit: BiblicalUnit = {
  id: 'psalm_name_present_state_01',
  reference: 'Salmo 42',
  title: 'Nomear o movimento presente',
  principle: 'Uma experiência pode ser reconhecida e expressa sem se tornar a identidade inteira da pessoa.',
  context: 'O Salmo 42 articula memória, desejo, abatimento e esperança em uma mesma composição. A missão utiliza essa complexidade como base editorial, sem reduzir o Salmo a uma única emoção ou oferecer interpretação clínica.',
  themes: ['memória', 'lamento', 'esperança', 'presença'],
  application: 'Selecionar um ou mais movimentos percebidos agora, ou seguir sem registrar quando não desejar nomeá-los.',
  provenance: [
    {
      id: 'bib-psalm-42',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência dos Salmos usada como núcleo editorial da missão.',
      sourceLabel: 'Salmo 42'
    }
  ]
};

export const waterLamentBiblicalUnit: BiblicalUnit = {
  id: 'psalm_voice_of_lament_01',
  reference: 'Salmo 13',
  title: 'A voz do lamento',
  principle: 'O lamento pode reunir pergunta, sofrimento, desejo e pedido de apoio sem exigir uma solução imediata.',
  context: 'O Salmo 13 é apresentado como forma poética de lamento. O Athanor não presume que toda experiência precise terminar em gratidão, resposta ou explicação, e não utiliza o texto para avaliar fé, saúde ou risco.',
  themes: ['lamento', 'pergunta', 'desejo', 'apoio'],
  application: 'Registrar somente o que fizer sentido, permanecer em silêncio ou procurar apoio humano quando necessário.',
  provenance: [
    {
      id: 'bib-psalm-13',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência dos Salmos usada como núcleo editorial da segunda missão da Água.',
      sourceLabel: 'Salmo 13'
    }
  ]
};

export const waterMemoryBiblicalUnit: BiblicalUnit = {
  id: 'psalm_memory_and_presence_01',
  reference: 'Salmo 77',
  title: 'Memória, busca e experiência presente',
  principle: 'Uma lembrança pode ser observada sem ser tratada automaticamente como descrição do presente ou previsão do futuro.',
  context: 'O Salmo 77 articula aflição, busca, lembrança e meditação. A missão utiliza essa passagem como núcleo editorial para distinguir memória, sensação atual, previsão, necessidade e ação, sem validar a precisão de lembranças ou atribuir-lhes significado oculto.',
  themes: ['memória', 'presença', 'busca', 'revisão'],
  application: 'Classificar frases fictícias e realizar, opcionalmente, uma breve observação do ambiente atual.',
  provenance: [
    {
      id: 'bib-psalm-77',
      label: 'Fonte bíblica',
      class: 'BIB',
      explanation: 'Referência dos Salmos usada como núcleo editorial da terceira missão da Água.',
      sourceLabel: 'Salmo 77'
    }
  ]
};

export const waterEmotions: { id: WaterEmotionId; label: string; description: string }[] = [
  { id: 'fear', label: 'Medo', description: 'Percepção de ameaça, risco ou incerteza.' },
  { id: 'hope', label: 'Esperança', description: 'Abertura para uma possibilidade desejada.' },
  { id: 'sadness', label: 'Tristeza', description: 'Movimento ligado a perda, ausência ou recolhimento.' },
  { id: 'gratitude', label: 'Gratidão', description: 'Reconhecimento voluntário de algo valioso.' },
  { id: 'anger', label: 'Ira', description: 'Energia ligada a limite, dano percebido ou frustração.' },
  { id: 'loneliness', label: 'Solidão', description: 'Percepção de distância, ausência ou desconexão.' },
  { id: 'trust', label: 'Confiança', description: 'Percepção de apoio, vínculo ou recurso disponível.' },
  { id: 'confusion', label: 'Confusão', description: 'Dificuldade atual de organizar sentidos ou escolhas.' }
];

export const waterNeeds: { id: WaterNeedId; label: string }[] = [
  { id: 'expression', label: 'Expressão' },
  { id: 'silence', label: 'Silêncio' },
  { id: 'rest', label: 'Repouso' },
  { id: 'support', label: 'Apoio' },
  { id: 'clarity', label: 'Clareza' },
  { id: 'time', label: 'Tempo' },
  { id: 'unknown', label: 'Não sei' }
];

export const waterLamentWarnings = [
  'O registro é opcional e fica armazenado localmente neste dispositivo.',
  'Você pode concluir em silêncio, pausar ou sair a qualquer momento.',
  'O Athanor não interpreta causas, memórias, transtornos ou vontade divina.',
  'Em situação de risco imediato, use o botão de apoio direto em vez do fluxo simbólico.'
];

export const waterMemoryCategoryLabels: Record<WaterMemoryCategory, string> = {
  memory: 'Memória',
  present_sensation: 'Sensação atual',
  prediction: 'Previsão',
  need: 'Necessidade',
  action: 'Ação'
};

export const waterMemoryEntries: WaterMemoryEntry[] = [
  {
    id: 'water-memory-01',
    text: 'Lembro que senti medo naquela conversa.',
    suggestedCategory: 'memory',
    explanation: 'A frase relata uma lembrança de uma experiência anterior.'
  },
  {
    id: 'water-memory-02',
    text: 'Percebo tensão nos ombros agora.',
    suggestedCategory: 'present_sensation',
    explanation: 'A frase descreve uma sensação percebida no momento atual.'
  },
  {
    id: 'water-memory-03',
    text: 'Acho que a mesma coisa acontecerá novamente.',
    suggestedCategory: 'prediction',
    explanation: 'A frase antecipa um acontecimento que ainda não ocorreu.'
  },
  {
    id: 'water-memory-04',
    text: 'Preciso de tempo antes de responder.',
    suggestedCategory: 'need',
    explanation: 'A frase identifica uma necessidade atual.'
  },
  {
    id: 'water-memory-05',
    text: 'Vou anotar os pontos e decidir amanhã.',
    suggestedCategory: 'action',
    explanation: 'A frase define uma ação observável.'
  },
  {
    id: 'water-memory-06',
    text: 'Recordo que aquela mudança foi difícil.',
    suggestedCategory: 'memory',
    explanation: 'A frase retorna a uma experiência anterior.'
  },
  {
    id: 'water-memory-07',
    text: 'Escuto um som contínuo neste ambiente.',
    suggestedCategory: 'present_sensation',
    explanation: 'A frase descreve uma percepção presente.'
  },
  {
    id: 'water-memory-08',
    text: 'Tenho certeza de que tudo dará errado.',
    suggestedCategory: 'prediction',
    explanation: 'A frase apresenta uma conclusão sobre o futuro.'
  },
  {
    id: 'water-memory-09',
    text: 'Preciso de apoio para organizar a situação.',
    suggestedCategory: 'need',
    explanation: 'A frase nomeia um recurso necessário.'
  },
  {
    id: 'water-memory-10',
    text: 'Vou procurar uma pessoa de confiança hoje.',
    suggestedCategory: 'action',
    explanation: 'A frase define uma ação própria e situada.'
  }
];

export const waterPresenceAnchors: { id: WaterPresenceAnchor; label: string; description: string }[] = [
  { id: 'color', label: 'Uma cor', description: 'Observe uma cor presente no ambiente.' },
  { id: 'sound', label: 'Um som', description: 'Perceba um som atual, próximo ou distante.' },
  { id: 'support', label: 'Um ponto de apoio', description: 'Note onde o corpo encontra apoio.' },
  { id: 'texture', label: 'Uma textura', description: 'Observe uma textura sem precisar tocá-la.' },
  { id: 'object', label: 'Um objeto', description: 'Escolha um objeto visível no espaço atual.' }
];

export const waterMemoryNodes: SymbolicNode[] = [
  {
    id: 'yesod_memory_v1',
    name: 'Yesod',
    category: 'sefirah',
    description: 'No Athanor, Yesod organiza a camada comparativa de memória, imagem e vínculo desta missão. A relação não é apresentada como conteúdo bíblico.',
    layer: 'kabbalah',
    fallbackNodeId: 'memory_chamber_v1',
    provenance: {
      id: 'cmp-yesod-memory',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Aplicação comparativa do Athanor para a arquitetura da Câmara dos Salmos.',
      sourceLabel: 'Síntese Athanor'
    }
  },
  {
    id: 'memory_chamber_v1',
    name: 'Câmara da Memória',
    category: 'athanor',
    description: 'Fallback autoral para organizar memória e presença quando a camada cabalística estiver desativada.',
    provenance: {
      id: 'ath-memory-chamber',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Elemento autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'mem_water_v1',
    name: 'Mem',
    category: 'letter',
    description: 'O Sefer Yetzirah relaciona Mem à Água. O uso como componente do Espelho é uma adaptação de gameplay identificada.',
    layer: 'sefer',
    fallbackNodeId: 'depth_symbol_v1',
    provenance: {
      id: 'src-mem-water',
      label: 'Fonte textual',
      class: 'SRC',
      explanation: 'Relação textual entre Mem e Água no Sefer Yetzirah.',
      sourceLabel: 'Sefer Yetzirah 3:3'
    }
  },
  {
    id: 'depth_symbol_v1',
    name: 'Símbolo da Profundidade',
    category: 'athanor',
    description: 'Fallback autoral para a função visual de profundidade e reflexão.',
    provenance: {
      id: 'ath-depth-symbol',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Símbolo autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'kan_water_v1',
    name: 'Kan',
    category: 'trigram',
    description: 'Kan possui relação textual com Água no Livro das Mutações. Sua conexão com memória e travessia nesta missão é comparativa.',
    layer: 'iching',
    fallbackNodeId: 'crossing_movement_v1',
    provenance: {
      id: 'src-kan-water',
      label: 'Fonte textual e comparação',
      class: 'CMP',
      explanation: 'O símbolo de Água vem da fonte; sua função na missão é uma comparação Athanor.',
      sourceLabel: 'Yi Jing · Kan'
    }
  },
  {
    id: 'crossing_movement_v1',
    name: 'Movimento da Travessia',
    category: 'athanor',
    description: 'Fallback autoral para a passagem entre memória, presente e próximo passo.',
    provenance: {
      id: 'ath-crossing-movement',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Movimento autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'high_priestess_memory_v1',
    name: 'A Sacerdotisa',
    category: 'archetype',
    description: 'Arquétipo opcional de silêncio, interioridade e conhecimento ainda não formulado. Não interpreta memórias nem revela verdades ocultas.',
    layer: 'tarot',
    fallbackNodeId: 'silence_keeper_v1',
    provenance: {
      id: 'cmp-priestess-memory',
      label: 'Comparação arquetípica',
      class: 'CMP',
      explanation: 'Uso arquetípico secundário criado para a missão.',
      sourceLabel: 'Síntese Athanor'
    }
  },
  {
    id: 'silence_keeper_v1',
    name: 'Guardiã do Silêncio',
    category: 'athanor',
    description: 'Fallback autoral que permite permanecer com uma pergunta sem exigir resposta imediata.',
    provenance: {
      id: 'ath-silence-keeper',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Arquétipo autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'water_mirror_v1',
    name: 'Espelho das Águas',
    category: 'athanor',
    description: 'Componente de gameplay que registra a conclusão da prática de distinção, sem validar lembranças ou medir saúde emocional.',
    provenance: {
      id: 'ath-water-mirror',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Terceiro componente da futura receita do Cálice da Memória Serena.',
      sourceLabel: 'Tehkné Solutions'
    }
  }
];
