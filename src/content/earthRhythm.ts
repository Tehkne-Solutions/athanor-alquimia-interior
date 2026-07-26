import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  EarthRhythmActionUnitId,
  EarthRhythmCategory,
  EarthRhythmDecisionId,
  EarthRhythmFrequencyId,
  EarthRhythmResourceModeId,
  EarthRhythmRestId,
  EarthRhythmResumeId
} from '../domain/earthRhythm';

export const earthRhythmBiblicalUnit: BiblicalUnit = {
  id: 'psalm_time_discernment_01',
  reference: 'Salmos 90:12',
  title: 'Tempo, medida e discernimento',
  principle: 'Reconhecer limites do tempo pode orientar uma cadência pequena, revisável e aberta ao repouso.',
  context: 'O Salmo relaciona tempo e sabedoria. O Athanor aplica esse princípio editorialmente, sem prever longevidade, produtividade ou resultado material.',
  themes: ['tempo', 'ritmo', 'medida', 'pausa', 'revisão'],
  application: 'Distinguir ritmo, pressa, repetição e cobrança antes de escolher uma cadência mínima que possa ser interrompida sem punição.',
  provenance: [{ id: 'earth_rhythm_psalm_bib', label: 'Fonte bíblica', class: 'BIB', explanation: 'Referência bíblica que inicia a quarta missão da Terra.', sourceLabel: 'Salmos 90:12' }]
};

export const earthRhythmNodes: SymbolicNode[] = [
  {
    id: 'earth_sustainable_rhythm_compass_v1',
    name: 'Compasso do Ritmo Sustentável',
    category: 'athanor',
    description: 'Componente de gameplay que registra uma cadência mínima, pausável e revisável.',
    provenance: { id: 'earth_rhythm_compass_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Componente autoral criado pela Tehkné Solutions.' }
  }
];

export const earthRhythmEntries: Array<{ id: string; text: string; suggestedCategory: EarthRhythmCategory; explanation: string }> = [
  { id: 'rhythm-entry-1', text: 'Uma unidade pequena seguida por uma pausa suficiente.', suggestedCategory: 'rhythm', explanation: 'Há alternância deliberada entre ação e repouso.' },
  { id: 'rhythm-entry-2', text: 'Concluir tudo imediatamente para não perder o embalo.', suggestedCategory: 'rush', explanation: 'A urgência ocupa o lugar da medida.' },
  { id: 'rhythm-entry-3', text: 'Repetir o mesmo gesto sem verificar se ainda faz sentido.', suggestedCategory: 'repetition', explanation: 'Existe repetição, mas não revisão.' },
  { id: 'rhythm-entry-4', text: 'Manter a sequência para provar que houve disciplina.', suggestedCategory: 'pressure', explanation: 'A continuidade vira cobrança de valor pessoal.' },
  { id: 'rhythm-entry-5', text: 'Retomar quando houver uma janela possível, sem recuperar dias perdidos.', suggestedCategory: 'rhythm', explanation: 'A retomada não exige compensação.' },
  { id: 'rhythm-entry-6', text: 'Aumentar a frequência porque o recurso pode acabar.', suggestedCategory: 'rush', explanation: 'A escassez percebida produz aceleração.' },
  { id: 'rhythm-entry-7', text: 'Cumprir o ciclo mesmo quando os recursos mudaram.', suggestedCategory: 'repetition', explanation: 'A sequência continua sem adaptação ao contexto.' },
  { id: 'rhythm-entry-8', text: 'Considerar a pausa como falha que precisa ser compensada.', suggestedCategory: 'pressure', explanation: 'O repouso recebe uma punição simbólica.' }
];

export const earthRhythmFrequencyOptions: Array<{ id: EarthRhythmFrequencyId; label: string; description: string }> = [
  { id: 'once', label: 'Um ciclo', description: 'Experimentar somente uma vez antes de revisar.' },
  { id: 'twice', label: 'Até dois ciclos', description: 'Limite fictício de duas repetições antes da revisão.' },
  { id: 'three_times', label: 'Até três ciclos', description: 'Limite fictício sem obrigação de completar todos.' },
  { id: 'flexible', label: 'Quando houver janela possível', description: 'Sem dias fixos ou sequência obrigatória.' },
  { id: 'no_frequency', label: 'Nenhuma frequência agora', description: 'Concluir sem criar uma cadência.' }
];

export const earthRhythmActionUnitOptions: Array<{ id: EarthRhythmActionUnitId; label: string }> = [
  { id: 'observe_only', label: 'Apenas observar' },
  { id: 'five_minutes', label: 'Até cinco minutos' },
  { id: 'one_item', label: 'Uma unidade fictícia' },
  { id: 'one_line', label: 'Uma linha de rascunho' },
  { id: 'no_action_unit', label: 'Nenhuma unidade de ação' }
];

export const earthRhythmRestOptions: Array<{ id: EarthRhythmRestId; label: string }> = [
  { id: 'equal_pause', label: 'Pausa igual à ação' },
  { id: 'longer_pause', label: 'Pausa maior que a ação' },
  { id: 'next_day', label: 'Retomar somente em outro dia' },
  { id: 'until_ready', label: 'Pausar até haver disponibilidade percebida' },
  { id: 'no_rest_plan', label: 'Sem plano de pausa ou ação' }
];

export const earthRhythmResourceModeOptions: Array<{ id: EarthRhythmResourceModeId; label: string; description: string }> = [
  { id: 'use_current', label: 'Usar somente o disponível agora', description: 'Não antecipar recursos futuros.' },
  { id: 'reduce_scope', label: 'Reduzir a unidade', description: 'Diminuir o ciclo quando os recursos forem limitados.' },
  { id: 'wait_resource', label: 'Esperar mudança de recurso', description: 'Não iniciar enquanto a condição fictícia não mudar.' },
  { id: 'pause_cycle', label: 'Pausar o ciclo', description: 'Encerrar esta tentativa sem perda.' }
];

export const earthRhythmResumeOptions: Array<{ id: EarthRhythmResumeId; label: string }> = [
  { id: 'next_available', label: 'Na próxima janela possível' },
  { id: 'after_resource_change', label: 'Depois de uma mudança de recurso' },
  { id: 'after_review', label: 'Somente depois de revisar' },
  { id: 'no_resume', label: 'Sem retomada definida' }
];

export const earthRhythmDecisionOptions: Array<{ id: EarthRhythmDecisionId; label: string; description: string }> = [
  { id: 'try_one_cycle', label: 'Experimentar um ciclo', description: 'Executar no máximo uma unidade e então parar.' },
  { id: 'wait', label: 'Esperar', description: 'Manter o ciclo sem data obrigatória.' },
  { id: 'pause', label: 'Pausar', description: 'Interromper sem perder o componente.' },
  { id: 'archive', label: 'Arquivar esta cadência', description: 'Encerrar o modelo fictício sem avaliação negativa.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Concluir sem iniciar ou agendar.' }
];
