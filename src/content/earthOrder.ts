import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  EarthOrderActiveLimit,
  EarthOrderCategory,
  EarthOrderDecisionId,
  EarthOrderItemId,
  EarthOrderItemState,
  EarthOrderReviewRuleId
} from '../domain/earthOrder';

export const earthOrderBiblicalUnit: BiblicalUnit = {
  id: 'proverb_prepare_order_01',
  reference: 'Provérbios 24:27',
  title: 'Preparação, sequência e limite',
  principle: 'Preparar condições e ordenar etapas pode servir à ação sem transformar prioridade em urgência.',
  context: 'O provérbio apresenta uma sequência entre preparação e construção. O Athanor aplica esse princípio editorialmente, sem impor produtividade, prazo ou modelo único de organização.',
  themes: ['ordem', 'preparação', 'prioridade', 'limite', 'revisão'],
  application: 'Organizar objetos fictícios com limite visível, estados reversíveis e prioridade sem urgência automática.',
  provenance: [{ id: 'earth_order_proverb_bib', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência bíblica que inicia a quinta missão da Terra.', sourceLabel: 'Provérbios 24:27' }]
};

export const earthOrderNodes: SymbolicNode[] = [
  {
    id: 'earth_possible_order_map_v1',
    name: 'Mapa da Ordem Possível',
    category: 'athanor',
    description: 'Componente de gameplay que registra limite visível, estados reversíveis, prioridade e revisão.',
    provenance: { id: 'earth_order_map_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Componente autoral criado pela Tehkné Solutions.' }
  }
];

export const earthOrderEntries: Array<{ id: string; text: string; suggestedCategory: EarthOrderCategory; explanation: string }> = [
  { id: 'order-entry-1', text: 'Deixar duas peças visíveis e guardar as demais para revisar depois.', suggestedCategory: 'order', explanation: 'Há limite, estado reversível e revisão.' },
  { id: 'order-entry-2', text: 'Escolher uma peça para observar primeiro, sem exigir conclusão imediata.', suggestedCategory: 'priority', explanation: 'Prioridade define atenção, não urgência.' },
  { id: 'order-entry-3', text: 'Manter a posição original mesmo depois de o contexto fictício mudar.', suggestedCategory: 'rigidity', explanation: 'A ordem deixa de poder ser revista.' },
  { id: 'order-entry-4', text: 'Adicionar novas peças sem retirar, guardar ou pausar nenhuma.', suggestedCategory: 'accumulation', explanation: 'O conjunto cresce sem limite ativo.' },
  { id: 'order-entry-5', text: 'Mover uma peça para cima e preservar todo o restante do mapa.', suggestedCategory: 'order', explanation: 'A sequência muda sem apagar progresso.' },
  { id: 'order-entry-6', text: 'Marcar uma peça como primeira apenas para orientar a próxima revisão.', suggestedCategory: 'priority', explanation: 'A escolha é temporária e não cria prazo.' },
  { id: 'order-entry-7', text: 'Impedir qualquer mudança porque a primeira organização deve ser definitiva.', suggestedCategory: 'rigidity', explanation: 'A estrutura é tratada como imutável.' },
  { id: 'order-entry-8', text: 'Manter todas as peças visíveis para não sentir que algo foi perdido.', suggestedCategory: 'accumulation', explanation: 'Visibilidade é confundida com preservação.' }
];

export const earthOrderActiveLimitOptions: Array<{ id: EarthOrderActiveLimit; label: string; description: string }> = [
  { id: 1, label: 'Um item visível', description: 'Uma única peça ocupa o primeiro plano.' },
  { id: 2, label: 'Até dois itens visíveis', description: 'Limite pequeno para comparação.' },
  { id: 3, label: 'Até três itens visíveis', description: 'Máximo permitido nesta missão fictícia.' }
];

export const earthOrderItems: Array<{ id: EarthOrderItemId; label: string; description: string }> = [
  { id: 'paper_cards', label: 'Cartões de papel', description: 'Conjunto fictício de cartões sem conteúdo pessoal.' },
  { id: 'wood_tokens', label: 'Marcadores de madeira', description: 'Peças neutras de uma oficina imaginária.' },
  { id: 'glass_jars', label: 'Frascos de vidro', description: 'Recipientes fictícios sem substâncias reais.' },
  { id: 'cloth_strips', label: 'Faixas de tecido', description: 'Materiais de cenário sem uso corporal.' },
  { id: 'stone_tiles', label: 'Placas de pedra', description: 'Elementos neutros do Jardim.' }
];

export const earthOrderStateOptions: Array<{ id: EarthOrderItemState; label: string; description: string }> = [
  { id: 'visible', label: 'Visível', description: 'Permanece no primeiro plano dentro do limite.' },
  { id: 'stored', label: 'Guardado', description: 'Continua disponível sem ocupar o primeiro plano.' },
  { id: 'paused', label: 'Pausado', description: 'Fica fora da ordem ativa até revisão.' },
  { id: 'archived', label: 'Arquivado', description: 'Sai deste mapa sem ser apagado ou avaliado.' }
];

export const earthOrderReviewRuleOptions: Array<{ id: EarthOrderReviewRuleId; label: string; description: string }> = [
  { id: 'after_one_move', label: 'Depois de uma mudança', description: 'Revisar após mover ou alterar um estado.' },
  { id: 'when_context_changes', label: 'Quando o contexto fictício mudar', description: 'Sem data ou frequência obrigatória.' },
  { id: 'after_pause', label: 'Depois de uma pausa', description: 'A ordem pode permanecer parada antes da revisão.' },
  { id: 'no_review', label: 'Sem revisão definida', description: 'Concluir sem agendar retorno.' }
];

export const earthOrderDecisionOptions: Array<{ id: EarthOrderDecisionId; label: string; description: string }> = [
  { id: 'apply_once', label: 'Aplicar a ordem uma vez', description: 'Usar o primeiro item somente como orientação fictícia.' },
  { id: 'save_layout', label: 'Somente salvar o mapa', description: 'Registrar a distribuição sem executar nada.' },
  { id: 'pause', label: 'Pausar a organização', description: 'Interromper sem perder estados ou sequência.' },
  { id: 'archive_map', label: 'Arquivar este mapa', description: 'Encerrar o modelo sem avaliação negativa.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Concluir sem aplicar, agendar ou reorganizar.' }
];
