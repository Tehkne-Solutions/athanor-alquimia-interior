import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  EarthResourceAvailability,
  EarthResourceCategory,
  EarthResourceDecisionId,
  EarthResourceKind,
  EarthResourceScopeId,
  EarthResourceSubstitutionId
} from '../domain/earthResources';

export const earthResourcesBiblicalUnit: BiblicalUnit = {
  id: 'proverb_know_resources_01',
  reference: 'Provérbios 27:23–24',
  title: 'Conhecer o que está disponível',
  principle: 'Cuidar de uma obra começa por reconhecer com honestidade quais recursos existem, quais podem chegar depois e quais não estão disponíveis.',
  context: 'Provérbios associa atenção cuidadosa ao conhecimento do que está sob responsabilidade. O Athanor aplica esse princípio ao inventário de recursos fictícios, sem prometer segurança material ou resultado.',
  themes: ['recursos', 'atenção', 'limite', 'responsabilidade'],
  application: 'Distinguir recurso, desejo, dependência e garantia antes de reduzir, substituir, esperar, pausar ou abandonar uma atividade fictícia.',
  provenance: [{ id: 'earth_resources_proverb_bib', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência bíblica que inicia a terceira missão da Terra.', sourceLabel: 'Provérbios 27:23–24' }]
};

export const earthResourcesNodes: SymbolicNode[] = [
  {
    id: 'earth_possible_resources_basket_v1',
    name: 'Cesto dos Recursos Possíveis',
    category: 'athanor',
    description: 'Componente de gameplay que registra disponibilidades, substituições, redução de escopo e uma decisão recusável.',
    provenance: { id: 'earth_possible_resources_basket_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Componente autoral criado pela Tehkné Solutions.' }
  }
];

export const earthResourceEntries: Array<{ id: string; text: string; suggestedCategory: EarthResourceCategory; explanation: string }> = [
  { id: 'resource-entry-1', text: 'Há quinze minutos livres no cenário fictício.', suggestedCategory: 'resource', explanation: 'Descreve algo atualmente disponível.' },
  { id: 'resource-entry-2', text: 'Seria bom ter uma mesa maior.', suggestedCategory: 'desire', explanation: 'Expressa preferência, não requisito obrigatório.' },
  { id: 'resource-entry-3', text: 'A etapa só pode começar depois de receber a referência.', suggestedCategory: 'dependency', explanation: 'Indica uma condição necessária para continuar.' },
  { id: 'resource-entry-4', text: 'Com o material certo, tudo dará certo.', suggestedCategory: 'guarantee', explanation: 'Transforma um recurso em promessa de resultado.' },
  { id: 'resource-entry-5', text: 'Existe uma folha reutilizável na oficina fictícia.', suggestedCategory: 'resource', explanation: 'Registra um material disponível sem prometer efeito.' },
  { id: 'resource-entry-6', text: 'Eu preferiria ter ajuda para organizar os itens.', suggestedCategory: 'desire', explanation: 'Aponta uma preferência que pode ou não ser atendida.' },
  { id: 'resource-entry-7', text: 'Sem saber o tamanho do espaço, a montagem precisa esperar.', suggestedCategory: 'dependency', explanation: 'Identifica informação necessária antes da ação.' },
  { id: 'resource-entry-8', text: 'Se houver apoio, a atividade será fácil.', suggestedCategory: 'guarantee', explanation: 'A disponibilidade de apoio não garante facilidade ou resultado.' }
];

export const earthResourceKindOptions: Array<{ id: EarthResourceKind; label: string; description: string }> = [
  { id: 'time', label: 'Tempo', description: 'Uma janela limitada para a atividade fictícia.' },
  { id: 'space', label: 'Espaço', description: 'Uma superfície ou ambiente adequado ao exemplo.' },
  { id: 'information', label: 'Informação', description: 'Uma referência verificável necessária ao cenário.' },
  { id: 'materials', label: 'Materiais', description: 'Itens básicos, reutilizáveis e fictícios.' },
  { id: 'support', label: 'Apoio', description: 'Ajuda disponível sem promessa de resultado.' }
];

export const earthResourceAvailabilityOptions: Array<{ id: EarthResourceAvailability; label: string }> = [
  { id: 'available_now', label: 'Disponível agora' },
  { id: 'available_later', label: 'Pode estar disponível depois' },
  { id: 'unavailable', label: 'Indisponível' },
  { id: 'unknown', label: 'Não sei ainda' }
];

export const earthResourceSubstitutionOptions: Array<{ id: EarthResourceSubstitutionId; label: string; description: string }> = [
  { id: 'shorter_time_window', label: 'Usar uma janela menor', description: 'Reduzir o tempo sem acelerar a atividade.' },
  { id: 'smaller_space', label: 'Usar um espaço menor', description: 'Limitar o cenário a uma superfície pequena.' },
  { id: 'existing_information', label: 'Usar apenas informação existente', description: 'Não inventar dados nem buscar confirmação automática.' },
  { id: 'single_material', label: 'Usar um único material', description: 'Simplificar o exemplo para um item disponível.' },
  { id: 'independent_safe_step', label: 'Escolher um passo independente', description: 'Separar uma unidade que não dependa de outra pessoa.' },
  { id: 'no_substitute', label: 'Nenhuma substituição adequada', description: 'Reconhecer que não há alternativa segura agora.' }
];

export const earthResourceScopeOptions: Array<{ id: EarthResourceScopeId; label: string; description: string }> = [
  { id: 'keep_scope', label: 'Manter o escopo fictício', description: 'Somente quando os recursos necessários estão presentes.' },
  { id: 'reduce_half', label: 'Reduzir o escopo pela metade', description: 'Diminuir a quantidade sem aumentar intensidade.' },
  { id: 'one_unit', label: 'Trabalhar com uma unidade', description: 'Limitar a atividade a um único elemento.' },
  { id: 'observe_only', label: 'Apenas observar', description: 'Conhecer os recursos sem alterar o cenário.' },
  { id: 'pause_scope', label: 'Pausar o escopo', description: 'Não manter uma atividade ativa agora.' }
];

export const earthResourceDecisionOptions: Array<{ id: EarthResourceDecisionId; label: string; description: string }> = [
  { id: 'proceed_with_available', label: 'Continuar com o que existe', description: 'Prosseguir somente dentro do escopo escolhido.' },
  { id: 'wait_for_resource', label: 'Esperar pelo recurso', description: 'Não executar enquanto uma dependência permanece ausente.' },
  { id: 'use_substitute', label: 'Usar uma substituição', description: 'Aplicar somente a alternativa escolhida e reversível.' },
  { id: 'pause', label: 'Pausar a atividade', description: 'Suspender sem transformar a pausa em fracasso.' },
  { id: 'abandon_activity', label: 'Abandonar a atividade fictícia', description: 'Encerrar o exemplo sem punição ou perda.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Concluir sem executar, agendar ou assumir compromisso.' }
];
