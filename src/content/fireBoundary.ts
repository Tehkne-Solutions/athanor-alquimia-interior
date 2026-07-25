import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  FireBoundaryAction,
  FireBoundaryCondition,
  FireBoundaryDuration,
  FireBoundaryReview,
  FireBoundaryScope,
  FireBoundaryStatementCategory
} from '../domain/fireBoundary';

export interface FireBoundaryStatement {
  id: string;
  text: string;
  suggestedCategory: FireBoundaryStatementCategory;
  explanation: string;
}

export const fireBoundaryBiblicalUnit: BiblicalUnit = {
  id: 'proverb_boundary_guard_v1',
  reference: 'Provérbios 4:23',
  title: 'Cuidar do que sustenta a vida',
  principle: 'Limites podem organizar acesso, tempo e resposta quando são formulados sobre a própria ação e permanecem abertos à revisão.',
  context: 'O provérbio trata do cuidado atento com o centro da vida. No Athanor, essa referência não autoriza isolamento, controle de terceiros, punição ou permanência em situação de risco.',
  themes: ['limite', 'cuidado', 'responsabilidade', 'revisão'],
  application: 'Distinguir limite, controle e punição e construir uma formulação em primeira pessoa com duração e revisão explícitas.',
  provenance: [{
    id: 'prov-fire-boundary-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a missão; a arquitetura do limite é uma adaptação editorial e de gameplay do Athanor.',
    sourceLabel: 'Provérbios 4:23'
  }]
};

export const fireBoundaryStatements: FireBoundaryStatement[] = [
  { id: 'boundary-1', text: 'Eu vou pausar esta conversa se os insultos continuarem.', suggestedCategory: 'boundary', explanation: 'A frase descreve uma ação própria diante de uma condição observável.' },
  { id: 'control-1', text: 'Você não pode conversar com mais ninguém sobre isso.', suggestedCategory: 'control', explanation: 'A frase tenta dirigir o comportamento de outra pessoa.' },
  { id: 'punishment-1', text: 'Se você não responder agora, vou expor você para todos.', suggestedCategory: 'punishment', explanation: 'A frase ameaça causar dano para obter obediência.' },
  { id: 'boundary-2', text: 'Eu responderei amanhã, dentro do meu horário disponível.', suggestedCategory: 'boundary', explanation: 'A formulação organiza disponibilidade e ação própria.' },
  { id: 'control-2', text: 'Você deve apagar todas as mensagens antes que eu volte.', suggestedCategory: 'control', explanation: 'A frase impõe uma ação a outra pessoa.' },
  { id: 'punishment-2', text: 'Vou ignorar você por um mês para que aprenda.', suggestedCategory: 'punishment', explanation: 'A intenção declarada é punir, não proteger uma ação própria.' },
  { id: 'boundary-3', text: 'Eu sairei do ambiente se não houver segurança para continuar.', suggestedCategory: 'boundary', explanation: 'A ação prioriza segurança sem tentar controlar terceiros.' },
  { id: 'control-3', text: 'Você só poderá sair quando eu permitir.', suggestedCategory: 'control', explanation: 'A frase restringe a autonomia de outra pessoa.' },
  { id: 'punishment-3', text: 'Vou destruir seu trabalho se você discordar de mim.', suggestedCategory: 'punishment', explanation: 'A frase anuncia retaliação e não pode ser transformada em limite.' }
];

export const fireBoundaryScopeOptions: Array<{ id: FireBoundaryScope; label: string; description: string }> = [
  { id: 'conversation', label: 'Conversa', description: 'Organizar como e quando uma conversa pode continuar.' },
  { id: 'availability', label: 'Disponibilidade', description: 'Definir horários e momentos em que você pode responder.' },
  { id: 'digital_contact', label: 'Contato digital', description: 'Escolher canal, frequência ou momento de resposta.' },
  { id: 'physical_space', label: 'Espaço físico', description: 'Priorizar distância e saída segura quando necessário.' },
  { id: 'workload', label: 'Carga de trabalho', description: 'Recusar ou adiar uma demanda que não cabe no ciclo atual.' }
];

export const fireBoundaryConditionOptions: Array<{ id: FireBoundaryCondition; label: string; description: string }> = [
  { id: 'raised_voice', label: 'Se a voz continuar elevada', description: 'Condição observável de escalada na conversa.' },
  { id: 'repeated_messages', label: 'Se as mensagens continuarem repetidas', description: 'Condição relacionada à frequência do contato.' },
  { id: 'outside_availability', label: 'Quando estiver fora do horário disponível', description: 'Condição ligada ao tempo definido por você.' },
  { id: 'insufficient_information', label: 'Enquanto faltarem informações', description: 'Adiar uma decisão até existir contexto suficiente.' },
  { id: 'physical_risk', label: 'Se houver risco físico', description: 'A saída segura tem prioridade sobre a missão simbólica.' },
  { id: 'none', label: 'Sem condição adicional', description: 'Aplicar a escolha ao escopo definido sem outro gatilho.' }
];

export const fireBoundaryActionOptions: Array<{ id: FireBoundaryAction; label: string; description: string }> = [
  { id: 'pause_conversation', label: 'Eu vou pausar a conversa', description: 'Interromper a interação e comunicar a pausa quando for seguro.' },
  { id: 'leave_safely', label: 'Eu vou sair com segurança', description: 'Priorizar distância física e apoio direto quando necessário.' },
  { id: 'respond_later', label: 'Eu vou responder depois', description: 'Criar tempo para verificar informações ou reduzir pressão.' },
  { id: 'limit_channel', label: 'Eu vou limitar o canal de contato', description: 'Escolher um meio ou horário específico para responder.' },
  { id: 'decline_request', label: 'Eu vou recusar esta solicitação', description: 'Não assumir uma tarefa ou compromisso que não cabe agora.' },
  { id: 'seek_support', label: 'Eu vou buscar apoio', description: 'Acionar uma pessoa, serviço ou recurso apropriado.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Concluir a prática sem executar uma ação externa.' }
];

export const fireBoundaryDurationOptions: Array<{ id: FireBoundaryDuration; label: string; description: string }> = [
  { id: 'this_interaction', label: 'Somente nesta interação', description: 'O limite vale para o ciclo atual.' },
  { id: 'until_tomorrow', label: 'Até amanhã', description: 'Criar uma pausa curta antes da revisão.' },
  { id: 'seven_days', label: 'Por sete dias', description: 'Manter a estrutura por um período definido.' },
  { id: 'until_review', label: 'Até a próxima revisão', description: 'Manter o limite até uma decisão explícita de ajuste.' }
];

export const fireBoundaryReviewOptions: Array<{ id: FireBoundaryReview; label: string; description: string }> = [
  { id: 'review_in_24h', label: 'Revisar em 24 horas', description: 'Verificar se o limite ainda serve à situação.' },
  { id: 'review_in_3d', label: 'Revisar em três dias', description: 'Observar contexto e efeitos sem prometer resultado.' },
  { id: 'review_in_7d', label: 'Revisar em sete dias', description: 'Manter uma janela definida de observação.' },
  { id: 'review_when_context_changes', label: 'Revisar quando o contexto mudar', description: 'Permitir abertura quando surgirem novas informações.' },
  { id: 'no_scheduled_review', label: 'Sem revisão agendada', description: 'Registrar a estrutura sem criar obrigação de retorno.' }
];

export const fireBoundaryNodes: SymbolicNode[] = [
  {
    id: 'gevurah_boundary_v1', name: 'Gevurah', category: 'sefirah', layer: 'kabbalah', fallbackNodeId: 'boundary_hall_v1',
    description: 'Camada opcional de limite, medida e responsabilidade sobre a própria ação.',
    provenance: { id: 'prov-gevurah-boundary-v1', label: 'Comparação temática', class: 'CMP', explanation: 'Comparação do Athanor; não é conteúdo de Provérbios.' }
  },
  {
    id: 'boundary_hall_v1', name: 'Salão do Limite', category: 'athanor',
    description: 'Fallback autoral para construir limites em primeira pessoa.',
    provenance: { id: 'prov-boundary-hall-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura de gameplay criada pela Tehkné Solutions.' }
  },
  {
    id: 'gen_boundary_v1', name: 'Gen · Montanha', category: 'trigram', layer: 'iching', fallbackNodeId: 'boundary_pause_movement_v1',
    description: 'Comparação opcional com pausa, imobilidade e delimitação de movimento.',
    provenance: { id: 'prov-gen-boundary-v1', label: 'Comparação temática', class: 'CMP', explanation: 'O uso é comparativo e não possui função de previsão.' }
  },
  {
    id: 'boundary_pause_movement_v1', name: 'Movimento da Delimitação', category: 'athanor',
    description: 'Fallback autoral para indicar onde uma ação começa e termina.',
    provenance: { id: 'prov-boundary-pause-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Movimento criado para o gameplay.' }
  },
  {
    id: 'emperor_boundary_v1', name: 'O Imperador', category: 'archetype', layer: 'tarot', fallbackNodeId: 'keeper_boundary_v1',
    description: 'Arquétipo opcional de estrutura e responsabilidade, sem autoridade sobre terceiros.',
    provenance: { id: 'prov-emperor-boundary-v1', label: 'Comparação arquetípica', class: 'CMP', explanation: 'A carta não define identidade, poder ou decisão.' }
  },
  {
    id: 'keeper_boundary_v1', name: 'Guardião da Estrutura', category: 'athanor',
    description: 'Fallback autoral para sustentar forma, duração e revisão.',
    provenance: { id: 'prov-keeper-boundary-v1', label: 'Síntese Athanor', class: 'ATH', explanation: 'Arquétipo autoral do Athanor.' }
  },
  {
    id: 'boundary_plate_v1', name: 'Placa do Limite', category: 'athanor',
    description: 'Componente que registra uma arquitetura de limite em primeira pessoa.',
    provenance: { id: 'prov-boundary-plate-v1', label: 'Componente Athanor', class: 'ATH', explanation: 'Não controla terceiros, não garante proteção e não prova assertividade.' }
  }
];
