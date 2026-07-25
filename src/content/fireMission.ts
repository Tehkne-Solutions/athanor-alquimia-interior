import type { SymbolicNode } from '../domain/types';
import type {
  FireActionId,
  FireClassificationCategory,
  FireEmotionId,
  FireNeedId,
  FirePauseId
} from '../domain/fire';

export const fireEmotionOptions: Array<{ id: FireEmotionId; label: string }> = [
  { id: 'anger', label: 'Ira' },
  { id: 'courage', label: 'Coragem' },
  { id: 'frustration', label: 'Frustração' },
  { id: 'urgency', label: 'Urgência' },
  { id: 'enthusiasm', label: 'Entusiasmo' },
  { id: 'fear', label: 'Medo' }
];

export const fireNeedOptions: Array<{ id: FireNeedId; label: string; description: string }> = [
  { id: 'pause', label: 'Pausa', description: 'Criar intervalo antes de decidir.' },
  { id: 'protection', label: 'Proteção', description: 'Buscar um contexto mais seguro.' },
  { id: 'clarity', label: 'Clareza', description: 'Separar o que ocorreu do que foi interpretado.' },
  { id: 'expression', label: 'Expressão', description: 'Organizar uma fala sem descarregar intensidade.' },
  { id: 'boundary', label: 'Limite', description: 'Definir o que pode ou não continuar.' },
  { id: 'movement', label: 'Movimento', description: 'Usar energia em uma ação corporal segura.' },
  { id: 'support', label: 'Apoio', description: 'Procurar alguém ou serviço disponível.' },
  { id: 'unknown', label: 'Não sei ainda', description: 'Manter a pergunta aberta sem forçar resposta.' }
];

export const fireActionOptions: Array<{ id: FireActionId; label: string; description: string }> = [
  { id: 'breathe_and_wait', label: 'Respirar e esperar', description: 'Adiar a resposta até a intensidade diminuir.' },
  { id: 'write_without_sending', label: 'Escrever sem enviar', description: 'Organizar a mensagem sem colocá-la em circulação.' },
  { id: 'step_away', label: 'Afastar-se por alguns minutos', description: 'Criar distância física quando isso for seguro.' },
  { id: 'ask_for_time', label: 'Pedir tempo', description: 'Informar que a resposta virá depois.' },
  { id: 'state_boundary_calmly', label: 'Comunicar um limite com calma', description: 'Falar em primeira pessoa, sem ameaça ou controle.' },
  { id: 'seek_support', label: 'Buscar apoio', description: 'Contatar uma pessoa ou serviço realmente disponível.' },
  { id: 'no_action', label: 'Não responder agora', description: 'Nenhuma ação imediata também é uma escolha válida.' }
];

export const firePauseOptions: Array<{ id: FirePauseId; label: string }> = [
  { id: 'three_breaths', label: 'Três respirações sem controlar o ritmo' },
  { id: 'physical_distance', label: 'Criar distância física segura' },
  { id: 'brief_silence', label: 'Manter um breve silêncio' },
  { id: 'none', label: 'Não realizar prática agora' }
];

export interface FireClassificationEntry {
  id: string;
  text: string;
  suggestedCategory: FireClassificationCategory;
  explanation: string;
}

export const fireClassificationEntries: FireClassificationEntry[] = [
  {
    id: 'fire-entry-01',
    text: 'Sinto irritação quando lembro da conversa.',
    suggestedCategory: 'emotion',
    explanation: 'A frase nomeia um estado percebido, sem decidir o que fazer.'
  },
  {
    id: 'fire-entry-02',
    text: 'Quero responder imediatamente, antes que eu mude de ideia.',
    suggestedCategory: 'impulse',
    explanation: 'A urgência de agir é um impulso; ela não precisa se tornar ação.'
  },
  {
    id: 'fire-entry-03',
    text: 'Preciso de alguns minutos para organizar o que aconteceu.',
    suggestedCategory: 'need',
    explanation: 'A frase identifica uma condição necessária para seguir.'
  },
  {
    id: 'fire-entry-04',
    text: 'Vou pedir que a conversa seja retomada mais tarde.',
    suggestedCategory: 'action',
    explanation: 'A frase descreve um passo observável e limitado.'
  },
  {
    id: 'fire-entry-05',
    text: 'Estou entusiasmado e com muita energia para começar.',
    suggestedCategory: 'emotion',
    explanation: 'Entusiasmo também é intensidade e não precisa ser tratado como ordem.'
  },
  {
    id: 'fire-entry-06',
    text: 'Quero abandonar tudo agora.',
    suggestedCategory: 'impulse',
    explanation: 'A vontade imediata pode ser reconhecida sem ser executada.'
  },
  {
    id: 'fire-entry-07',
    text: 'Preciso saber qual limite consigo sustentar.',
    suggestedCategory: 'need',
    explanation: 'A frase busca uma condição de cuidado e sustentação.'
  },
  {
    id: 'fire-entry-08',
    text: 'Vou escrever uma versão da mensagem e não enviá-la hoje.',
    suggestedCategory: 'action',
    explanation: 'A frase transforma energia em uma ação concreta e reversível.'
  }
];

export const fireMissionNodes: SymbolicNode[] = [
  {
    id: 'shin_fire_v1',
    name: 'Shin',
    category: 'letter',
    description: 'No Sefer Yetzirah, Shin é relacionada ao Fogo. No Athanor, a letra permanece uma camada textual opcional, não uma leitura de Provérbios.',
    layer: 'sefer',
    fallbackNodeId: 'symbol_of_heat_v1',
    provenance: {
      id: 'src-shin-fire',
      label: 'Fonte textual',
      class: 'SRC',
      explanation: 'Relação textual entre Shin e Fogo, usada sem afirmar equivalência bíblica.',
      sourceLabel: 'Sefer Yetzirah'
    }
  },
  {
    id: 'symbol_of_heat_v1',
    name: 'Símbolo do Calor',
    category: 'athanor',
    description: 'Fallback autoral para representar intensidade percebida.',
    provenance: {
      id: 'ath-symbol-heat',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Componente autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'gen_stillness_v1',
    name: 'Gen · Quietude',
    category: 'trigram',
    description: 'Comparação temática com interrupção e pausa antes do gesto.',
    layer: 'iching',
    fallbackNodeId: 'gate_of_pause_v1',
    provenance: {
      id: 'cmp-gen-pause',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Uso comparativo para a mecânica de pausa.',
      sourceLabel: 'I Ching'
    }
  },
  {
    id: 'gate_of_pause_v1',
    name: 'Portal da Pausa',
    category: 'athanor',
    description: 'Fallback autoral para criar intervalo entre intensidade e gesto.',
    provenance: {
      id: 'ath-gate-pause',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Mecânica autoral de pausa.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'zhen_movement_v1',
    name: 'Zhen · Movimento',
    category: 'trigram',
    description: 'Comparação temática com início de movimento depois da pausa e da medida.',
    layer: 'iching',
    fallbackNodeId: 'first_safe_step_v1',
    provenance: {
      id: 'cmp-zhen-movement',
      label: 'Comparação temática',
      class: 'CMP',
      explanation: 'Uso comparativo para uma ação inicial limitada.',
      sourceLabel: 'I Ching'
    }
  },
  {
    id: 'first_safe_step_v1',
    name: 'Primeiro Passo Seguro',
    category: 'athanor',
    description: 'Fallback autoral para uma ação proporcional, reversível e sem violência.',
    provenance: {
      id: 'ath-first-safe-step',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Resultado autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  },
  {
    id: 'strength_archetype_v1',
    name: 'A Força',
    category: 'archetype',
    description: 'Arquétipo opcional de potência orientada por cuidado e medida.',
    layer: 'tarot',
    fallbackNodeId: 'guardian_of_measure_v1',
    provenance: {
      id: 'cmp-strength-measure',
      label: 'Comparação arquetípica',
      class: 'CMP',
      explanation: 'Uso comparativo, sem função oracular ou preditiva.',
      sourceLabel: 'Tarot'
    }
  },
  {
    id: 'guardian_of_measure_v1',
    name: 'Guardião da Medida',
    category: 'athanor',
    description: 'Fallback autoral para coragem, limite e responsabilidade.',
    provenance: {
      id: 'ath-guardian-measure',
      label: 'Criação Athanor',
      class: 'ATH',
      explanation: 'Arquétipo autoral de gameplay.',
      sourceLabel: 'Tehkné Solutions'
    }
  }
];
