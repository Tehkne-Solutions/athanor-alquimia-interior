import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  SpiritDecisionCategory,
  SpiritDecisionChoice,
  SpiritDecisionCondition,
  SpiritDecisionPosition,
  SpiritDecisionRevision,
  SpiritDecisionWindow
} from '../domain/spiritDecision';
import type { SpiritDimension } from '../domain/spiritThread';

export interface SpiritDecisionEntry {
  id: string;
  text: string;
  suggestedCategory: SpiritDecisionCategory;
  explanation: string;
}

export interface SpiritDecisionScenario {
  id: string;
  title: string;
  description: string;
  positions: Record<SpiritDimension, string>;
}

export const spiritDecisionBiblicalUnit: BiblicalUnit = {
  id: 'proverb_revisable_decision_01',
  reference: 'Provérbios 19:2',
  title: 'Um passo que não precisa virar destino',
  principle: 'Decidir com atenção inclui reconhecer limites de conhecimento, evitar pressa e manter aberta a possibilidade de revisão.',
  context: 'O provérbio aproxima falta de conhecimento e precipitação. O Athanor usa esse princípio editorial para decisões fictícias, pequenas e revisáveis; não oferece direção divina específica nem garantia de resultado.',
  themes: ['decisão', 'conhecimento', 'pressa', 'revisão', 'limite'],
  application: 'Revisar uma decisão fictícia sem transformá-la em promessa, previsão ou obediência obrigatória.',
  provenance: [{
    id: 'spirit_proverb_19_2_bib',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'Referência bíblica que inicia a missão. Os cenários, opções e a Marca são adaptações editoriais e de gameplay.',
    sourceLabel: 'Provérbios 19:2'
  }]
};

export const spiritDecisionEntries: SpiritDecisionEntry[] = [
  { id: 'decision-entry-01', text: 'Por enquanto, o grupo escolhe observar uma etapa e revisar depois.', suggestedCategory: 'provisional_decision', explanation: 'A escolha é limitada, explícita e revisável.' },
  { id: 'decision-entry-02', text: 'Esta escolha nunca será alterada, aconteça o que acontecer.', suggestedCategory: 'promise', explanation: 'Transforma uma escolha atual em compromisso absoluto.' },
  { id: 'decision-entry-03', text: 'Se a porta for aberta, o resultado certamente será favorável.', suggestedCategory: 'prediction', explanation: 'Afirma um resultado futuro sem base verificável.' },
  { id: 'decision-entry-04', text: 'A personagem deve aceitar porque a voz central ordenou.', suggestedCategory: 'obedience', explanation: 'Substitui decisão por submissão obrigatória.' },
  { id: 'decision-entry-05', text: 'O próximo passo pode ser reduzido se algum recurso mudar.', suggestedCategory: 'provisional_decision', explanation: 'Mantém escopo e condição de revisão.' },
  { id: 'decision-entry-06', text: 'Eu garanto que continuarei mesmo sem informação suficiente.', suggestedCategory: 'promise', explanation: 'Cria obrigação futura apesar da incerteza.' },
  { id: 'decision-entry-07', text: 'A discordância significa que o plano vai fracassar.', suggestedCategory: 'prediction', explanation: 'Converte diferença presente em previsão.' },
  { id: 'decision-entry-08', text: 'A parte que falou por último deve ser seguida sem revisão.', suggestedCategory: 'obedience', explanation: 'Confunde ordem de fala com autoridade.' }
];

export const spiritDecisionScenarios: SpiritDecisionScenario[] = [
  {
    id: 'decision-scenario-01',
    title: 'A ponte de madeira removível',
    description: 'Um grupo fictício decide se testa uma única tábua antes de atravessar uma maquete segura.',
    positions: {
      word: 'propõe registrar o teste',
      emotion: 'permanece cautelosa',
      impulse: 'quer avançar de uma vez',
      body: 'percebe tensão leve',
      action: 'pode testar apenas uma peça'
    }
  },
  {
    id: 'decision-scenario-02',
    title: 'O mapa ainda incompleto',
    description: 'Exploradores fictícios possuem informações parciais e precisam decidir somente o próximo movimento no tabuleiro.',
    positions: {
      word: 'pede mais contexto',
      emotion: 'aceita esperar',
      impulse: 'quer escolher uma direção',
      body: 'pede uma pausa',
      action: 'pode apenas marcar o ponto atual'
    }
  },
  {
    id: 'decision-scenario-03',
    title: 'A peça que pode ser recolocada',
    description: 'Uma artesã fictícia avalia uma alteração reversível em um objeto de oficina.',
    positions: {
      word: 'descreve duas alternativas',
      emotion: 'prefere preservar',
      impulse: 'quer experimentar',
      body: 'não apresenta sinal conhecido',
      action: 'pode criar uma cópia primeiro'
    }
  },
  {
    id: 'decision-scenario-04',
    title: 'O ensaio interrompido',
    description: 'Uma banda fictícia decide se retoma um trecho, reduz o ritmo ou encerra o ensaio por hoje.',
    positions: {
      word: 'propõe uma revisão breve',
      emotion: 'está dividida',
      impulse: 'quer terminar o trecho',
      body: 'pede descanso',
      action: 'pode pausar sem perder o registro'
    }
  }
];

export const spiritDecisionDimensionLabels: Record<SpiritDimension, string> = {
  word: 'Palavra',
  emotion: 'Emoção',
  impulse: 'Impulso',
  body: 'Corpo percebido',
  action: 'Ação'
};

export const spiritDecisionPositionOptions: { id: SpiritDecisionPosition; label: string; description: string }[] = [
  { id: 'supports', label: 'Apoia provisoriamente', description: 'A parte oferece apoio limitado, não uma garantia.' },
  { id: 'disagrees', label: 'Continua em desacordo', description: 'A discordância permanece registrada.' },
  { id: 'passes', label: 'Passa', description: 'A parte não assume posição e continua presente.' },
  { id: 'unknown', label: 'Permanece desconhecida', description: 'Nenhuma interpretação é inventada.' }
];

export const spiritDecisionChoiceOptions: { id: SpiritDecisionChoice; label: string; description: string }[] = [
  { id: 'small_step', label: 'Um passo pequeno', description: 'Realizar somente a menor unidade fictícia e reversível.' },
  { id: 'pause', label: 'Pausar', description: 'Interromper sem perder o estado atual.' },
  { id: 'ask_time', label: 'Pedir tempo no cenário', description: 'Registrar necessidade de tempo sem enviar comunicação real.' },
  { id: 'observe_only', label: 'Somente observar', description: 'Manter a decisão no campo da observação.' },
  { id: 'none', label: 'Nenhuma decisão agora', description: 'Não assumir compromisso nesta missão.' }
];

export const spiritDecisionRevisionOptions: { id: SpiritDecisionRevision; label: string; description: string }[] = [
  { id: 'confirm', label: 'Confirmar provisoriamente', description: 'Manter o passo, ainda sujeito à próxima revisão.' },
  { id: 'reduce', label: 'Reduzir', description: 'Diminuir escopo, duração ou intensidade fictícia.' },
  { id: 'alter', label: 'Alterar', description: 'Trocar a decisão por outra opção curada e reversível.' },
  { id: 'withdraw', label: 'Retirar', description: 'Remover a decisão sem tratar isso como falha.' },
  { id: 'no_commitment', label: 'Não assumir compromisso', description: 'Encerrar sem decisão ou promessa.' }
];

export const spiritDecisionWindowOptions: { id: SpiritDecisionWindow; label: string; description: string }[] = [
  { id: 'next_step', label: 'Após o próximo passo', description: 'Revisar logo depois da unidade fictícia.' },
  { id: 'one_day', label: 'Em um dia', description: 'Janela narrativa, sem lembrete automático.' },
  { id: 'three_days', label: 'Em três dias', description: 'Janela narrativa, sem calendário externo.' },
  { id: 'context_change', label: 'Quando o contexto mudar', description: 'Revisar diante de alteração observável.' },
  { id: 'none', label: 'Sem janela', description: 'Usado apenas para retirada ou ausência de compromisso.' }
];

export const spiritDecisionConditionOptions: { id: SpiritDecisionCondition; label: string; description: string }[] = [
  { id: 'new_information', label: 'Nova informação', description: 'Revisar quando surgir informação relevante no cenário.' },
  { id: 'resource_change', label: 'Mudança de recurso', description: 'Revisar se disponibilidade fictícia mudar.' },
  { id: 'part_disagrees', label: 'Uma parte mantém desacordo', description: 'Preservar a discordância como motivo válido de revisão.' },
  { id: 'safety_change', label: 'Mudança de segurança', description: 'Suspender o simbolismo diante de risco ou insegurança.' },
  { id: 'unknown', label: 'Condição desconhecida', description: 'Registrar incerteza sem inventar critério.' },
  { id: 'none', label: 'Nenhuma condição', description: 'Usado quando não há compromisso ativo.' }
];

export const spiritDecisionNodes: SymbolicNode[] = [
  {
    id: 'spirit_revisable_decision_v1',
    name: 'Decisão Revisável',
    category: 'principle',
    description: 'Princípio autoral para decisões limitadas, retiradas ou não assumidas sem promessa de resultado.',
    provenance: { id: 'spirit_revisable_decision_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura didática criada pela Tehkné Solutions.' }
  },
  {
    id: 'spirit_hod_revision_v1',
    name: 'Hod · Formulação e Revisão',
    category: 'sefirah',
    description: 'Comparação opcional com formulação, linguagem e revisão, sem medir verdade espiritual.',
    layer: 'kabbalah',
    fallbackNodeId: 'spirit_revision_table_v1',
    provenance: { id: 'spirit_hod_revision_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Hod é usado como arquitetura comparativa, não como conteúdo bíblico ou estágio espiritual.' }
  },
  {
    id: 'spirit_revision_table_v1',
    name: 'Mesa da Revisão',
    category: 'athanor',
    description: 'Fallback autoral para formular e revisar uma decisão provisória.',
    provenance: { id: 'spirit_revision_table_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Cabala está desativada.' }
  },
  {
    id: 'spirit_ruach_return_v1',
    name: 'Ruach · Movimento do Retorno',
    category: 'element',
    description: 'Comparação opcional com retorno e reconsideração, sem atribuir identidade espiritual.',
    layer: 'sefer',
    fallbackNodeId: 'spirit_reconsideration_motion_v1',
    provenance: { id: 'spirit_ruach_return_cmp', label: 'Comparação textual', class: 'CMP', explanation: 'Uso comparativo para revisão, não apresentado como conteúdo de Provérbios.' }
  },
  {
    id: 'spirit_reconsideration_motion_v1',
    name: 'Movimento da Reconsideração',
    category: 'athanor',
    description: 'Fallback autoral para confirmar, reduzir, alterar ou retirar uma decisão.',
    provenance: { id: 'spirit_reconsideration_motion_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Sefer está desativado.' }
  },
  {
    id: 'spirit_xun_revision_v1',
    name: 'Xun · Vento',
    category: 'trigram',
    description: 'Comparação opcional com ajuste gradual, sem consulta oracular ou previsão.',
    layer: 'iching',
    fallbackNodeId: 'spirit_gradual_adjustment_v1',
    provenance: { id: 'spirit_xun_revision_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Xun representa ajuste narrativo no gameplay, sem função divinatória.' }
  },
  {
    id: 'spirit_gradual_adjustment_v1',
    name: 'Ajuste Gradual',
    category: 'athanor',
    description: 'Fallback autoral para reduzir ou alterar sem exigir ruptura.',
    provenance: { id: 'spirit_gradual_adjustment_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando I Ching está desativado.' }
  },
  {
    id: 'spirit_hanged_revision_v1',
    name: 'O Enforcado',
    category: 'archetype',
    description: 'Arquétipo opcional de pausa e mudança de perspectiva, sem sacrifício obrigatório ou leitura de destino.',
    layer: 'tarot',
    fallbackNodeId: 'spirit_keeper_open_decision_v1',
    provenance: { id: 'spirit_hanged_revision_cmp', label: 'Comparação arquetípica', class: 'CMP', explanation: 'Postura narrativa de suspensão e revisão, sem função divinatória.' }
  },
  {
    id: 'spirit_keeper_open_decision_v1',
    name: 'Guardiã da Decisão Aberta',
    category: 'athanor',
    description: 'Fallback autoral para manter uma decisão limitada e revisável.',
    provenance: { id: 'spirit_keeper_open_decision_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Tarot está desativado.' }
  },
  {
    id: 'spirit_revisable_decision_mark_v1',
    name: 'Marca da Decisão Revisável',
    category: 'athanor',
    description: 'Componente de gameplay que registra confirmação, redução, alteração, retirada ou ausência de compromisso.',
    provenance: { id: 'spirit_revisable_decision_mark_ath', label: 'Componente Athanor', class: 'ATH', explanation: 'Item autoral sem função clínica, oracular ou espiritual.' }
  }
];
