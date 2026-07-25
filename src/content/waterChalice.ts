import type {
  WaterChaliceIntentId,
  WaterChaliceLimitId,
  WaterChaliceReviewWindowId
} from '../domain/waterChalice';

export const waterChaliceRecipe = {
  id: 'recipe_memory_serene_chalice_v1',
  name: 'Cálice da Memória Serena',
  componentIds: [
    'named_drop_v1',
    'lament_fragment_v1',
    'water_mirror_v1',
    'trust_bridge_v1'
  ],
  principle: 'Reunir emoção, lamento, memória e apoio em uma ação limitada e revisável.',
  restrictions: [
    'Não apaga memórias ou emoções',
    'Não garante serenidade, proteção ou melhora',
    'Não confirma interpretações espirituais ou psicológicas',
    'Não substitui apoio humano ou profissional',
    'Não exige uma ação externa imediata'
  ],
  version: '1.0.0'
};

export const waterChaliceIntentions: {
  id: WaterChaliceIntentId;
  label: string;
  description: string;
}[] = [
  {
    id: 'hold_with_context',
    label: 'Manter a experiência em contexto',
    description: 'Reconhecer o que aconteceu sem transformar uma parte da experiência no todo.'
  },
  {
    id: 'remember_without_identity',
    label: 'Lembrar sem fixar identidade',
    description: 'Registrar que uma memória existe sem definir a pessoa inteira por ela.'
  },
  {
    id: 'seek_support',
    label: 'Organizar apoio possível',
    description: 'Considerar recursos disponíveis sem convertê-los em garantia.'
  },
  {
    id: 'rest_before_action',
    label: 'Repousar antes de agir',
    description: 'Dar espaço para uma pausa quando não houver risco imediato.'
  },
  {
    id: 'continue_small_step',
    label: 'Continuar por um passo pequeno',
    description: 'Escolher uma ação limitada, observável e passível de revisão.'
  }
];

export const waterChaliceLimits: {
  id: WaterChaliceLimitId;
  label: string;
  description: string;
}[] = [
  {
    id: 'one_step',
    label: 'Somente um passo',
    description: 'Encerrar a ação depois de uma única etapa observável.'
  },
  {
    id: 'ten_minutes',
    label: 'Até dez minutos',
    description: 'Interromper a prática ao atingir o limite de tempo.'
  },
  {
    id: 'until_tomorrow',
    label: 'Sem nova decisão até amanhã',
    description: 'Adiar uma nova escolha, quando isso for seguro e possível.'
  },
  {
    id: 'with_support',
    label: 'Somente com apoio disponível',
    description: 'Executar a ação apenas quando o recurso escolhido estiver realmente acessível.'
  },
  {
    id: 'stop_if_overwhelming',
    label: 'Parar se ficar excessivo',
    description: 'Interromper a atividade e procurar apoio quando necessário.'
  }
];

export const waterChaliceReviewWindows: {
  id: WaterChaliceReviewWindowId;
  label: string;
  description: string;
}[] = [
  { id: 'later_today', label: 'Mais tarde hoje', description: 'Revisar em outro momento do mesmo dia.' },
  { id: 'tomorrow', label: 'Amanhã', description: 'Revisar depois de uma noite ou mudança de contexto.' },
  { id: 'three_days', label: 'Em três dias', description: 'Permitir um intervalo curto antes da revisão.' },
  { id: 'next_week', label: 'Na próxima semana', description: 'Revisar em um ciclo mais amplo.' },
  { id: 'when_ready', label: 'Quando eu decidir retornar', description: 'Manter a revisão sem prazo obrigatório.' }
];

export const waterChaliceComponentLabels: Record<string, string> = {
  named_drop_v1: 'Gota Nomeada',
  lament_fragment_v1: 'Fragmento do Lamento',
  water_mirror_v1: 'Espelho das Águas',
  trust_bridge_v1: 'Ponte da Confiança'
};
