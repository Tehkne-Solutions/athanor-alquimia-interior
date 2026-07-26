import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  EarthStoneActiveLimit,
  EarthStoneFunction,
  EarthStoneResource,
  EarthStoneReviewWindow,
  EarthStoneRhythm,
  EarthStoneSmallStep
} from '../domain/earthStone';

export const earthStoneBiblicalUnit: BiblicalUnit = {
  id: 'proverb_first_step_stone_v1',
  reference: 'Provérbios 16:9',
  title: 'Caminho, passo e revisão',
  principle: 'Planejar pode orientar um passo pequeno sem transformar o plano em garantia ou obrigação de resultado.',
  context: 'O provérbio relaciona intenção e caminho. O Athanor aplica esse princípio editorialmente a escolhas pequenas, recursos presentes, ritmo, limite e revisão; não promete direção sobrenatural ou sucesso material.',
  themes: ['caminho', 'passo', 'recurso', 'ritmo', 'limite', 'revisão'],
  application: 'Reunir os cinco componentes da Terra em um item que registre uma unidade possível, pausável e revisável.',
  provenance: [{
    id: 'prov-earth-stone-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a receita; a Pedra, seus componentes e seus estados são adaptações editoriais e de gameplay do Athanor.',
    sourceLabel: 'Provérbios 16:9'
  }]
};

export const earthStoneRecipe = {
  id: 'recipe_first_step_stone_v1',
  name: 'Pedra do Primeiro Passo',
  componentIds: [
    'body_presence_mark_v1',
    'first_step_seed_v1',
    'possible_resources_basket_v1',
    'sustainable_rhythm_compass_v1',
    'possible_order_map_v1'
  ],
  principle: 'Reunir presença percebida, unidade pequena, recurso possível, ritmo sustentável e ordem limitada em uma fórmula revisável.',
  restrictions: [
    'Não mede saúde, produtividade, disciplina ou valor pessoal',
    'Não promete recurso, resultado, estabilidade ou direção espiritual',
    'Não executa tarefas, lembretes, compras ou ações externas',
    'Não transforma prioridade em urgência',
    'Não exige passo, recurso, frequência ou item ativo',
    'Não conclui o capítulo sem revisão própria'
  ],
  version: '1.0.0'
};

export const earthStoneFunctions: Array<{ id: EarthStoneFunction; label: string; description: string }> = [
  { id: 'ground_first_step', label: 'Assentar um primeiro passo', description: 'Registrar uma unidade pequena sem obrigação de executá-la.' },
  { id: 'support_available_resource', label: 'Sustentar um recurso disponível', description: 'Usar apenas aquilo que já foi marcado como possível.' },
  { id: 'hold_sustainable_rhythm', label: 'Manter um ritmo pausável', description: 'Organizar uma única cadência sem streak ou compensação.' },
  { id: 'organize_active_limit', label: 'Guardar um limite ativo', description: 'Preservar um limite de itens sem transformar prioridade em urgência.' },
  { id: 'no_external_action', label: 'Nenhuma ação externa', description: 'Usar a receita somente como registro de gameplay.' }
];

export const earthStoneSmallSteps: Array<{ id: EarthStoneSmallStep; label: string; description: string }> = [
  { id: 'observe', label: 'Apenas observar', description: 'Nenhuma alteração ou execução.' },
  { id: 'one_item', label: 'Uma unidade fictícia', description: 'Limitar o passo a um único elemento.' },
  { id: 'five_minutes', label: 'Até cinco minutos', description: 'Janela curta sem cronômetro automático.' },
  { id: 'one_line', label: 'Uma linha de rascunho', description: 'Preparação mínima sem envio ou publicação.' },
  { id: 'no_step', label: 'Nenhum passo agora', description: 'Concluir sem definir uma unidade de ação.' }
];

export const earthStoneResources: Array<{ id: EarthStoneResource; label: string; description: string }> = [
  { id: 'time', label: 'Tempo disponível', description: 'Uma janela percebida, sem consultar agenda.' },
  { id: 'space', label: 'Espaço disponível', description: 'Um ambiente fictício suficiente para a unidade.' },
  { id: 'verified_information', label: 'Informação verificável', description: 'Contexto suficiente para reduzir suposições.' },
  { id: 'material', label: 'Material disponível', description: 'Um recurso fictício já presente.' },
  { id: 'support', label: 'Apoio disponível', description: 'Uma categoria de apoio, sem consultar contatos.' },
  { id: 'none_available', label: 'Nenhum recurso disponível agora', description: 'A ausência de recurso não reduz progresso.' }
];

export const earthStoneRhythms: Array<{ id: EarthStoneRhythm; label: string; description: string }> = [
  { id: 'single_cycle', label: 'Um único ciclo', description: 'Experimentar no máximo uma unidade e então parar.' },
  { id: 'flexible_window', label: 'Quando houver janela possível', description: 'Sem dias fixos ou sequência obrigatória.' },
  { id: 'action_then_rest', label: 'Ação seguida de repouso', description: 'Alternar uma unidade curta e uma pausa suficiente.' },
  { id: 'wait_resource', label: 'Esperar o recurso mudar', description: 'Não iniciar enquanto a condição percebida não mudar.' },
  { id: 'no_rhythm', label: 'Nenhum ritmo agora', description: 'Concluir sem frequência ou ciclo.' }
];

export const earthStoneActiveLimits: Array<{ id: EarthStoneActiveLimit; label: string; description: string }> = [
  { id: 'one_item', label: 'Um item ativo', description: 'Manter somente uma unidade visível.' },
  { id: 'two_items', label: 'Até dois itens ativos', description: 'Limite máximo, não meta de preenchimento.' },
  { id: 'three_items', label: 'Até três itens ativos', description: 'Limite máximo sem obrigação de usar todos.' },
  { id: 'no_active_items', label: 'Nenhum item ativo', description: 'Guardar, pausar ou arquivar tudo sem perda.' }
];

export const earthStoneReviewWindows: Array<{ id: EarthStoneReviewWindow; label: string; description: string }> = [
  { id: 'later_today', label: 'Mais tarde hoje', description: 'Revisar no mesmo dia, sem alerta automático.' },
  { id: 'tomorrow', label: 'Amanhã', description: 'Revisar depois de uma mudança de contexto.' },
  { id: 'three_days', label: 'Em três dias', description: 'Revisar após um ciclo curto.' },
  { id: 'when_context_changes', label: 'Quando o contexto mudar', description: 'Retornar somente diante de uma mudança percebida.' },
  { id: 'when_ready', label: 'Quando eu decidir retornar', description: 'Sem prazo obrigatório.' }
];

export const earthStoneComponentLabels: Record<string, string> = {
  body_presence_mark_v1: 'Marca da Presença Corporal',
  first_step_seed_v1: 'Semente do Primeiro Passo',
  possible_resources_basket_v1: 'Cesto dos Recursos Possíveis',
  sustainable_rhythm_compass_v1: 'Compasso do Ritmo Sustentável',
  possible_order_map_v1: 'Mapa da Ordem Possível'
};

export const earthStoneNodes: SymbolicNode[] = [
  {
    id: 'malkhut_stone_v1', name: 'Malkhut', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'grounded_workshop_v1',
    description: 'Comparação opcional com forma, presença material e limite concreto.',
    provenance: { id: 'prov-malkhut-stone-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Comparação do Athanor; não é conteúdo de Provérbios.' }
  },
  {
    id: 'grounded_workshop_v1', name: 'Oficina do Chão Presente', category: 'athanor',
    description: 'Fallback autoral para organizar passo, recurso, ritmo e limite.',
    provenance: { id: 'prov-grounded-workshop-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura criada pela Tehkné Solutions.' }
  },
  {
    id: 'kun_stone_v1', name: 'Kun · Terra', category: 'trigram', layer: 'iching', fallbackNodeId: 'supporting_ground_v1',
    description: 'Comparação opcional com receptividade e sustentação, sem previsão.',
    provenance: { id: 'prov-kun-stone-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Uso comparativo do Athanor.' }
  },
  {
    id: 'supporting_ground_v1', name: 'Movimento do Chão que Sustenta', category: 'athanor',
    description: 'Fallback autoral para trabalhar somente com o que está disponível.',
    provenance: { id: 'prov-supporting-ground-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Movimento criado para o gameplay.' }
  },
  {
    id: 'empress_stone_v1', name: 'A Imperatriz', category: 'archetype', layer: 'tarot', fallbackNodeId: 'keeper_first_step_v1',
    description: 'Arquétipo opcional de cultivo e forma viva, sem garantir crescimento.',
    provenance: { id: 'prov-empress-stone-v1', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não define identidade, fertilidade ou resultado.' }
  },
  {
    id: 'keeper_first_step_v1', name: 'Guardiã do Primeiro Passo', category: 'athanor',
    description: 'Fallback autoral para sustentar uma unidade pequena e revisável.',
    provenance: { id: 'prov-keeper-first-step-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'first_step_stone_v1', name: 'Pedra do Primeiro Passo', category: 'athanor',
    description: 'Item de gameplay que reúne cinco componentes da Terra em uma fórmula revisável.',
    provenance: { id: 'prov-first-step-stone-v1', label: 'Item Athanor', class: 'ATH', explanation: 'Não representa estabilidade, produtividade, cura ou direção garantida.' }
  }
];
