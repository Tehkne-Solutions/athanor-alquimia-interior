import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  EarthCapacityId,
  EarthSmallStepId,
  EarthTimeId,
  EarthWorkCategory,
  EarthWorkContextId,
  EarthWorkDecisionId,
  EarthWorkSupportId
} from '../domain/earthWork';

export const earthWorkBiblicalUnit: BiblicalUnit = {
  id: 'proverb_planning_small_step_01',
  reference: 'Provérbios 21:5',
  title: 'Planejamento, medida e direção',
  principle: 'Uma intenção ampla ganha forma quando é transformada em uma unidade possível, limitada e revisável.',
  context: 'Provérbios relaciona planejamento cuidadoso e direção. O Athanor usa esse princípio editorialmente, sem prometer prosperidade, produtividade ou resultado material.',
  themes: ['planejamento', 'trabalho', 'medida', 'primeiro passo'],
  application: 'Distinguir intenção, projeto, tarefa e primeiro passo antes de decidir fazer, adiar, delegar, repousar ou não agir.',
  provenance: [{ id: 'earth_work_proverb_bib', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência bíblica que inicia a segunda missão da Terra.', sourceLabel: 'Provérbios 21:5' }]
};

export const earthWorkNodes: SymbolicNode[] = [
  {
    id: 'earth_first_step_seed_v1',
    name: 'Semente do Primeiro Passo',
    category: 'athanor',
    description: 'Componente de gameplay que registra uma unidade pequena e uma decisão recusável.',
    provenance: { id: 'earth_first_step_seed_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Componente autoral criado pela Tehkné Solutions.' }
  }
];

export const earthWorkEntries: Array<{ id: string; text: string; suggestedCategory: EarthWorkCategory; explanation: string }> = [
  { id: 'work-entry-1', text: 'Quero cuidar melhor do arquivo.', suggestedCategory: 'intention', explanation: 'Expressa uma direção ampla, sem definir entrega.' },
  { id: 'work-entry-2', text: 'Organizar o arquivo digital do projeto fictício.', suggestedCategory: 'project', explanation: 'Reúne várias tarefas em um resultado maior.' },
  { id: 'work-entry-3', text: 'Separar os documentos da pasta de abril.', suggestedCategory: 'task', explanation: 'Define uma unidade de trabalho delimitada.' },
  { id: 'work-entry-4', text: 'Abrir a pasta e selecionar três arquivos.', suggestedCategory: 'first_step', explanation: 'É uma ação inicial pequena e observável.' },
  { id: 'work-entry-5', text: 'Quero preparar uma nota clara.', suggestedCategory: 'intention', explanation: 'Aponta uma direção, mas ainda não uma entrega.' },
  { id: 'work-entry-6', text: 'Produzir uma nota de uma página.', suggestedCategory: 'project', explanation: 'Contém mais de uma tarefa e um resultado final.' },
  { id: 'work-entry-7', text: 'Listar os três pontos da nota.', suggestedCategory: 'task', explanation: 'É uma tarefa delimitada dentro do projeto.' },
  { id: 'work-entry-8', text: 'Escrever apenas o primeiro tópico.', suggestedCategory: 'first_step', explanation: 'É a menor unidade inicial do exemplo.' }
];

export const earthWorkContextOptions: Array<{ id: EarthWorkContextId; label: string; description: string }> = [
  { id: 'desk_corner', label: 'Canto de mesa fictício', description: 'Organizar uma superfície pequena e simbólica.' },
  { id: 'digital_folder', label: 'Pasta digital fictícia', description: 'Trabalhar com arquivos de exemplo.' },
  { id: 'simple_note', label: 'Nota curta fictícia', description: 'Preparar uma estrutura de texto sem envio.' },
  { id: 'plant_corner', label: 'Canto de cultivo fictício', description: 'Organizar materiais de cuidado de uma planta imaginária.' },
  { id: 'meal_outline', label: 'Esboço de refeição fictícia', description: 'Organizar uma lista ilustrativa, sem recomendação alimentar.' }
];

export const earthCapacityOptions: Array<{ id: EarthCapacityId; label: string }> = [
  { id: 'unavailable', label: 'Sem capacidade disponível agora' },
  { id: 'limited', label: 'Capacidade limitada' },
  { id: 'available', label: 'Alguma capacidade disponível' },
  { id: 'unknown', label: 'Não sei ainda' }
];

export const earthTimeOptions: Array<{ id: EarthTimeId; label: string }> = [
  { id: 'five_minutes', label: 'Até 5 minutos' },
  { id: 'fifteen_minutes', label: 'Até 15 minutos' },
  { id: 'thirty_minutes', label: 'Até 30 minutos' },
  { id: 'unknown', label: 'Tempo desconhecido' }
];

export const earthSmallStepOptions: Array<{ id: EarthSmallStepId; label: string; description: string }> = [
  { id: 'observe_materials', label: 'Apenas observar', description: 'Ver o que existe sem alterar nada.' },
  { id: 'gather_one_item', label: 'Reunir um item', description: 'Preparar somente um recurso.' },
  { id: 'open_document', label: 'Abrir um documento', description: 'Abrir sem obrigação de continuar.' },
  { id: 'write_one_line', label: 'Escrever uma linha', description: 'Criar apenas uma linha de rascunho.' },
  { id: 'sort_three_items', label: 'Separar três itens', description: 'Limitar a unidade a três elementos.' },
  { id: 'ask_one_question', label: 'Preparar uma pergunta', description: 'Registrar uma pergunta sem enviar.' },
  { id: 'no_step', label: 'Nenhum passo definido', description: 'Concluir sem escolher uma execução.' }
];

export const earthWorkDecisionOptions: Array<{ id: EarthWorkDecisionId; label: string; description: string }> = [
  { id: 'do_small_step', label: 'Fazer o passo pequeno', description: 'Executar somente a unidade escolhida.' },
  { id: 'delay', label: 'Adiar conscientemente', description: 'Manter a unidade para outro momento.' },
  { id: 'delegate', label: 'Preparar para delegar', description: 'Organizar a solicitação sem enviá-la automaticamente.' },
  { id: 'rest_first', label: 'Repousar antes', description: 'Colocar descanso antes da atividade.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Encerrar sem executar ou agendar.' }
];

export const earthWorkSupportOptions: Array<{ id: EarthWorkSupportId; label: string }> = [
  { id: 'timer', label: 'Temporizador opcional' },
  { id: 'checklist', label: 'Lista curta' },
  { id: 'quiet_space', label: 'Ambiente mais silencioso' },
  { id: 'trusted_person', label: 'Pessoa de confiança' },
  { id: 'none_available', label: 'Nenhum apoio disponível agora' }
];
