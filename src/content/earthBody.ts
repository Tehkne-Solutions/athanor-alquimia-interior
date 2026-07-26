import type { SymbolicNode } from '../domain/types';
import type {
  EarthActionId,
  EarthBodyCategory,
  EarthPerceptionDimension,
  EarthPerceptionLevel,
  EarthResourceId
} from '../domain/earthBody';

export interface EarthBodyEntry {
  id: string;
  text: string;
  suggestedCategory: EarthBodyCategory;
  explanation: string;
}

export const earthPerceptionLabels: Record<EarthPerceptionDimension, { title: string; description: string }> = {
  energy: { title: 'Energia percebida', description: 'Como a disponibilidade parece agora, sem medir desempenho.' },
  rest: { title: 'Descanso percebido', description: 'Como o repouso parece agora, sem avaliar qualidade do sono.' },
  tension: { title: 'Tensão percebida', description: 'Quanto aperto ou rigidez é percebido, sem interpretar causa.' },
  comfort: { title: 'Conforto percebido', description: 'Como o ambiente e a posição parecem agora.' }
};

export const earthPerceptionLevelLabels: Record<EarthPerceptionLevel, string> = {
  low: 'Baixo',
  moderate: 'Moderado',
  high: 'Alto',
  unknown: 'Não sei'
};

export const earthBodyEntries: EarthBodyEntry[] = [
  { id: 'earth-entry-01', text: 'Os ombros parecem elevados neste momento.', suggestedCategory: 'perceived_signal', explanation: 'Descreve algo percebido sem explicar a causa.' },
  { id: 'earth-entry-02', text: 'Isso significa que não conseguirei terminar nada.', suggestedCategory: 'interpretation', explanation: 'Transforma uma percepção em conclusão sobre desempenho.' },
  { id: 'earth-entry-03', text: 'Preciso de alguns minutos sem novas demandas.', suggestedCategory: 'need', explanation: 'Formula uma necessidade sem impor ação a terceiros.' },
  { id: 'earth-entry-04', text: 'Vou sentar e reduzir o próximo passo.', suggestedCategory: 'action', explanation: 'Descreve uma ação própria, pequena e reversível.' },
  { id: 'earth-entry-05', text: 'A boca parece seca agora.', suggestedCategory: 'perceived_signal', explanation: 'Registra uma sensação atual sem diagnóstico.' },
  { id: 'earth-entry-06', text: 'Meu corpo está me dizendo que algo grave acontecerá.', suggestedCategory: 'interpretation', explanation: 'Atribui previsão a uma sensação e não deve ser tratada como certeza.' },
  { id: 'earth-entry-07', text: 'Preciso verificar se água está disponível.', suggestedCategory: 'need', explanation: 'Identifica um recurso possível sem afirmar condição médica.' },
  { id: 'earth-entry-08', text: 'Vou pausar antes de organizar a tarefa.', suggestedCategory: 'action', explanation: 'Escolhe uma ação segura sem exigir produtividade.' }
];

export const earthResourceOptions: { id: EarthResourceId; label: string; description: string }[] = [
  { id: 'water', label: 'Água disponível', description: 'Recurso básico que pode ser preparado, sem obrigação de consumo.' },
  { id: 'food', label: 'Alimento disponível', description: 'Recurso básico percebido, sem orientação nutricional.' },
  { id: 'place_to_rest', label: 'Lugar para repousar', description: 'Espaço onde uma pausa pode ser considerada.' },
  { id: 'comfortable_position', label: 'Posição mais confortável', description: 'Possibilidade de ajustar apoio ou postura sem prescrição.' },
  { id: 'time', label: 'Alguns minutos disponíveis', description: 'Janela pequena sem cobrança de produtividade.' },
  { id: 'trusted_person', label: 'Pessoa de confiança', description: 'Contato possível, sem presumir disponibilidade ou resposta.' },
  { id: 'verified_information', label: 'Informação verificável', description: 'Fonte concreta para decidir o próximo passo.' },
  { id: 'none_available', label: 'Nenhum recurso disponível agora', description: 'Conclusão válida que não reduz progresso.' }
];

export const earthActionOptions: { id: EarthActionId; label: string; description: string }[] = [
  { id: 'rest_now', label: 'Repousar agora', description: 'Interromper a atividade quando isso for possível e seguro.' },
  { id: 'brief_pause', label: 'Fazer uma pausa breve', description: 'Criar um pequeno intervalo antes de continuar.' },
  { id: 'adjust_position', label: 'Ajustar posição ou ambiente', description: 'Mudar apoio, luz ou ruído de modo simples e reversível.' },
  { id: 'prepare_basic_resource', label: 'Preparar um recurso básico', description: 'Deixar água, alimento ou local de repouso acessível, se apropriado.' },
  { id: 'reduce_next_step', label: 'Reduzir o próximo passo', description: 'Escolher uma etapa menor sem avaliar produtividade.' },
  { id: 'seek_support', label: 'Buscar apoio', description: 'Considerar uma pessoa ou serviço adequado ao contexto.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Registrar presença sem transformar a observação em obrigação.' }
];

export const earthBodyNodes: SymbolicNode[] = [
  {
    id: 'earth_perceived_presence_v1',
    name: 'Presença Percebida',
    category: 'principle',
    description: 'Distingue sensação atual, interpretação, necessidade e ação sem diagnóstico.',
    provenance: {
      id: 'earth_perceived_presence_ath',
      label: 'Síntese Athanor',
      class: 'ATH',
      explanation: 'Estrutura didática criada pela Tehkné Solutions.'
    }
  },
  {
    id: 'earth_body_presence_mark_v1',
    name: 'Marca da Presença Corporal',
    category: 'athanor',
    description: 'Componente de gameplay que registra a conclusão de uma prática perceptiva e recusável.',
    provenance: {
      id: 'earth_body_presence_mark_ath',
      label: 'Componente Athanor',
      class: 'ATH',
      explanation: 'Item autoral sem função clínica, espiritual ou preditiva.'
    }
  }
];
