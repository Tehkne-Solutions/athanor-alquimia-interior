import type { SymbolicNode } from '../domain/types';
import type {
  SpiritDimension,
  SpiritRelation,
  SpiritThreadCategory,
  SpiritThreadDecision
} from '../domain/spiritThread';

export interface SpiritThreadEntry {
  id: string;
  text: string;
  suggestedCategory: SpiritThreadCategory;
  explanation: string;
}

export interface SpiritScenario {
  id: string;
  title: string;
  context: string;
  dimensions: Record<SpiritDimension, string>;
}

export const spiritDimensionLabels: Record<SpiritDimension, { label: string; description: string }> = {
  word: { label: 'Palavra', description: 'O que foi dito, escrito ou mantido em silêncio no cenário fictício.' },
  emotion: { label: 'Emoção', description: 'Um movimento emocional atribuído ao personagem fictício, sem diagnóstico.' },
  impulse: { label: 'Impulso', description: 'A tendência inicial de agir, evitar, responder ou esperar.' },
  body: { label: 'Corpo percebido', description: 'Uma sensação descrita no cenário, sem interpretar causa ou condição clínica.' },
  action: { label: 'Ação', description: 'Um gesto próprio, pequeno, reversível ou recusável.' }
};

export const spiritThreadCategoryLabels: Record<SpiritThreadCategory, string> = {
  word: 'Palavra',
  emotion: 'Emoção',
  impulse: 'Impulso',
  body: 'Corpo percebido',
  action: 'Ação',
  unknown: 'Não sei'
};

export const spiritThreadEntries: SpiritThreadEntry[] = [
  { id: 'spirit-thread-entry-01', text: 'A personagem diz: “Preciso de alguns minutos antes de responder.”', suggestedCategory: 'word', explanation: 'É uma formulação verbal explícita.' },
  { id: 'spirit-thread-entry-02', text: 'A mensagem recebida contém apenas metade das instruções.', suggestedCategory: 'word', explanation: 'Descreve informação verbal ou escrita disponível.' },
  { id: 'spirit-thread-entry-03', text: 'A personagem percebe frustração diante da instrução incompleta.', suggestedCategory: 'emotion', explanation: 'Nomeia um movimento emocional fictício.' },
  { id: 'spirit-thread-entry-04', text: 'Há curiosidade sobre o que ainda falta entender.', suggestedCategory: 'emotion', explanation: 'Nomeia uma emoção possível sem afirmar identidade.' },
  { id: 'spirit-thread-entry-05', text: 'Surge vontade de responder imediatamente.', suggestedCategory: 'impulse', explanation: 'Descreve uma tendência inicial, não uma ação já executada.' },
  { id: 'spirit-thread-entry-06', text: 'A primeira tendência é abandonar a tarefa fictícia.', suggestedCategory: 'impulse', explanation: 'Apresenta um impulso sem classificá-lo como certo ou errado.' },
  { id: 'spirit-thread-entry-07', text: 'As mãos parecem mais tensas neste momento do cenário.', suggestedCategory: 'body', explanation: 'Registra uma percepção corporal fictícia sem diagnóstico.' },
  { id: 'spirit-thread-entry-08', text: 'A respiração parece mais curta por alguns instantes.', suggestedCategory: 'body', explanation: 'Descreve uma sensação percebida sem explicar sua causa.' },
  { id: 'spirit-thread-entry-09', text: 'A personagem decide pedir a parte ausente da instrução.', suggestedCategory: 'action', explanation: 'É uma ação própria, limitada e reversível.' },
  { id: 'spirit-thread-entry-10', text: 'A personagem fecha o rascunho e retorna depois.', suggestedCategory: 'action', explanation: 'É uma ação de pausa sem execução automática pelo aplicativo.' }
];

export const spiritScenarios: SpiritScenario[] = [
  {
    id: 'spirit-scenario-01',
    title: 'A instrução incompleta',
    context: 'Uma personagem recebe uma tarefa fictícia com uma parte ausente e precisa decidir se responde agora.',
    dimensions: {
      word: 'A instrução escrita não explica o último passo.',
      emotion: 'A personagem percebe frustração e curiosidade ao mesmo tempo.',
      impulse: 'Surge vontade de preencher a lacuna por conta própria.',
      body: 'Os ombros parecem elevados enquanto ela relê o texto.',
      action: 'Ela pode pedir esclarecimento, pausar ou não responder agora.'
    }
  },
  {
    id: 'spirit-scenario-02',
    title: 'O convite inesperado',
    context: 'Uma personagem recebe um convite fictício para participar de uma atividade sem prazo imediato.',
    dimensions: {
      word: 'O convite diz que uma resposta pode ser enviada depois.',
      emotion: 'Há entusiasmo e hesitação presentes no mesmo cenário.',
      impulse: 'A primeira tendência é aceitar antes de verificar recursos.',
      body: 'O peito parece mais aberto e as mãos continuam tensas.',
      action: 'Ela pode pedir tempo, observar ou recusar a atividade fictícia.'
    }
  },
  {
    id: 'spirit-scenario-03',
    title: 'O objeto fora do lugar',
    context: 'Em uma oficina fictícia, um objeto foi movido sem registro e ninguém sabe quem fez a alteração.',
    dimensions: {
      word: 'A única informação disponível é que o objeto estava em outro local pela manhã.',
      emotion: 'A personagem percebe irritação e incerteza.',
      impulse: 'Surge vontade de atribuir responsabilidade imediatamente.',
      body: 'A mandíbula parece contraída durante a busca.',
      action: 'Ela pode registrar o fato, perguntar ou interromper a investigação fictícia.'
    }
  },
  {
    id: 'spirit-scenario-04',
    title: 'A apresentação adiada',
    context: 'Uma apresentação fictícia é transferida para outra data, mas o novo horário ainda não foi confirmado.',
    dimensions: {
      word: 'A mensagem informa o adiamento, mas não apresenta novo horário.',
      emotion: 'Alívio e preocupação aparecem juntos no personagem fictício.',
      impulse: 'Há vontade de reorganizar toda a agenda imediatamente.',
      body: 'A personagem percebe cansaço e menor tensão nos ombros.',
      action: 'Ela pode aguardar informação verificável ou apenas salvar o estado atual.'
    }
  }
];

export const spiritRelationOptions: Array<{ id: SpiritRelation; label: string; description: string }> = [
  { id: 'aligned', label: 'Parecem apontar para direção semelhante', description: 'Uma leitura didática possível, sem representar coerência pessoal.' },
  { id: 'mixed', label: 'Apontam para direções diferentes', description: 'Diferenças podem coexistir sem precisar ser eliminadas.' },
  { id: 'tension', label: 'Há tensão entre algumas partes', description: 'Tensão não significa falha, perigo ou diagnóstico.' },
  { id: 'unknown', label: 'Não sei como se relacionam', description: 'Desconhecimento é um resultado completo.' }
];

export const spiritThreadDecisionOptions: Array<{ id: SpiritThreadDecision; label: string; description: string }> = [
  { id: 'observe', label: 'Somente observar o conjunto', description: 'Registrar as partes sem transformar a síntese em obrigação.' },
  { id: 'pause', label: 'Pausar antes de qualquer gesto', description: 'Encerrar a prática e retornar somente quando desejar.' },
  { id: 'ask_time', label: 'Pedir tempo no cenário fictício', description: 'Escolher uma ação proporcional sem enviar mensagem real.' },
  { id: 'decline', label: 'Recusar a síntese', description: 'Concluir sem reunir ou interpretar as dimensões.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Criar o componente sem ação externa.' }
];

export const spiritThreadNodes: SymbolicNode[] = [
  {
    id: 'spirit_five_dimension_principle_v1',
    name: 'Cinco Dimensões Distintas',
    category: 'principle',
    description: 'Estrutura didática que distingue palavra, emoção, impulso, corpo percebido e ação sem exigir concordância.',
    provenance: {
      id: 'spirit_five_dimension_principle_ath',
      label: 'Síntese Athanor',
      class: 'ATH',
      explanation: 'Estrutura de gameplay criada pela Tehkné Solutions.'
    }
  },
  {
    id: 'spirit_possible_synthesis_thread_v1',
    name: 'Fio da Síntese Possível',
    category: 'athanor',
    description: 'Componente de gameplay que registra conclusão, recusa ou pausa sem medir coerência ou elevação espiritual.',
    provenance: {
      id: 'spirit_possible_synthesis_thread_ath',
      label: 'Componente Athanor',
      class: 'ATH',
      explanation: 'Item autoral sem função clínica, oracular, preditiva ou espiritual objetiva.'
    }
  }
];
