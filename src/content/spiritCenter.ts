import type { BiblicalUnit, SymbolicNode } from '../domain/types';
import type {
  SpiritCenterCategory,
  SpiritCenterDecision,
  SpiritCenterDuration,
  SpiritCenterReview
} from '../domain/spiritCenter';
import type { SpiritDimension } from '../domain/spiritThread';

export interface SpiritCenterEntry {
  id: string;
  text: string;
  suggestedCategory: SpiritCenterCategory;
  explanation: string;
}

export interface SpiritCenterScenario {
  id: string;
  title: string;
  description: string;
  competingParts: string[];
}

export const spiritCenterBiblicalUnit: BiblicalUnit = {
  id: 'psalm_provisional_center_01',
  reference: 'Salmos 86:11',
  title: 'Um centro que orienta sem apagar',
  principle: 'Reunir a atenção pode oferecer direção provisória sem transformar uma parte em dona permanente das demais.',
  context: 'O Salmo reúne caminho e coração em uma direção. O Athanor usa essa imagem como princípio editorial de atenção temporária; não afirma unidade perfeita, aprovação espiritual ou eliminação de conflito.',
  themes: ['atenção', 'centro', 'direção', 'partes', 'revisão'],
  application: 'Escolher, alternar ou recusar um centro temporário em cenários fictícios, preservando todas as partes e o direito de revisar.',
  provenance: [{
    id: 'spirit_psalm_86_11_bib',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'Referência bíblica que inicia a missão. O centro provisório, os cenários e o Nó são adaptações editoriais e de gameplay.',
    sourceLabel: 'Salmos 86:11'
  }]
};

export const spiritCenterEntries: SpiritCenterEntry[] = [
  { id: 'center-entry-01', text: 'Durante um passo, a atenção fica na palavra e depois pode mudar.', suggestedCategory: 'centrality', explanation: 'Define um foco temporário e revisável.' },
  { id: 'center-entry-02', text: 'A emoção é sempre mais verdadeira do que todas as outras partes.', suggestedCategory: 'superiority', explanation: 'Transforma uma dimensão em autoridade permanente.' },
  { id: 'center-entry-03', text: 'O corpo não será considerado porque atrapalha a decisão.', suggestedCategory: 'exclusion', explanation: 'Apaga uma dimensão para simplificar o cenário.' },
  { id: 'center-entry-04', text: 'Palavra, emoção e corpo podem ser observados juntos sem concordarem.', suggestedCategory: 'integration', explanation: 'Mantém as diferenças dentro do conjunto.' },
  { id: 'center-entry-05', text: 'A ação recebe atenção primeiro apenas até a próxima revisão.', suggestedCategory: 'centrality', explanation: 'A prioridade é limitada no tempo.' },
  { id: 'center-entry-06', text: 'Se o impulso estiver no centro, ele deve comandar o restante.', suggestedCategory: 'superiority', explanation: 'Confunde foco com poder sobre as demais partes.' },
  { id: 'center-entry-07', text: 'Para haver ordem, uma das partes precisa desaparecer.', suggestedCategory: 'exclusion', explanation: 'Exige apagamento em vez de organização.' },
  { id: 'center-entry-08', text: 'Nenhuma dimensão precisa ocupar o centro agora para continuar presente.', suggestedCategory: 'integration', explanation: 'Reconhece o conjunto sem obrigar centralidade.' }
];

export const spiritCenterScenarios: SpiritCenterScenario[] = [
  { id: 'center-scenario-01', title: 'A mensagem ainda não enviada', description: 'Uma personagem fictícia preparou uma mensagem e percebe partes apontando para ritmos diferentes.', competingParts: ['palavra pede clareza', 'emoção pede acolhimento', 'ação pede espera'] },
  { id: 'center-scenario-02', title: 'A porta entreaberta', description: 'Um personagem fictício precisa escolher apenas o próximo gesto dentro de uma sala segura.', competingParts: ['corpo percebe tensão', 'impulso quer avançar', 'palavra ainda não existe'] },
  { id: 'center-scenario-03', title: 'A mesa com cinco mapas', description: 'Um grupo fictício compara cinco mapas incompletos antes de escolher qual observar primeiro.', competingParts: ['cada mapa mostra algo', 'nenhum mapa é completo', 'a ordem pode mudar'] },
  { id: 'center-scenario-04', title: 'O instrumento em pausa', description: 'Uma musicista fictícia interrompe o ensaio e decide se algum elemento precisa de atenção inicial.', competingParts: ['ritmo está incerto', 'corpo pede pausa', 'ação pode permanecer vazia'] }
];

export const spiritCenterDimensionLabels: Record<SpiritDimension, string> = {
  word: 'Palavra',
  emotion: 'Emoção',
  impulse: 'Impulso',
  body: 'Corpo percebido',
  action: 'Ação'
};

export const spiritCenterDurationOptions: { id: SpiritCenterDuration; label: string; description: string }[] = [
  { id: 'one_step', label: 'Por um passo', description: 'O centro vale somente para a próxima unidade fictícia.' },
  { id: 'one_scene', label: 'Durante a cena', description: 'A atenção dura até o cenário ser encerrado.' },
  { id: 'until_review', label: 'Até a revisão', description: 'O centro permanece provisório até uma revisão explícita.' },
  { id: 'none', label: 'Nenhuma duração', description: 'Não estabelecer centralidade agora.' }
];

export const spiritCenterReviewOptions: { id: SpiritCenterReview; label: string; description: string }[] = [
  { id: 'switch_allowed', label: 'Permitir alternância', description: 'Outra dimensão pode receber atenção sem apagar o histórico.' },
  { id: 'return_to_none', label: 'Voltar a nenhum centro', description: 'A revisão devolve o conjunto a um estado sem centralidade.' },
  { id: 'keep_provisional', label: 'Manter provisoriamente', description: 'O mesmo centro pode continuar, ainda sujeito a nova revisão.' },
  { id: 'unknown', label: 'Não sei como revisar', description: 'Registrar incerteza sem bloquear a missão.' }
];

export const spiritCenterDecisionOptions: { id: SpiritCenterDecision; label: string; description: string }[] = [
  { id: 'observe', label: 'Somente observar', description: 'Registrar o centro ou a ausência dele sem executar ação.' },
  { id: 'switch_center', label: 'Experimentar alternância', description: 'Passar por duas dimensões e preservar ambas no histórico.' },
  { id: 'pause', label: 'Pausar', description: 'Interromper o exercício sem perder o que foi registrado.' },
  { id: 'decline', label: 'Recusar a centralidade', description: 'Concluir sem escolher cenário ou centro.' },
  { id: 'no_action', label: 'Nenhuma ação agora', description: 'Finalizar sem transformar atenção em obrigação.' }
];

export const spiritCenterNodes: SymbolicNode[] = [
  {
    id: 'spirit_provisional_center_v1',
    name: 'Centro Provisório',
    category: 'principle',
    description: 'Princípio autoral que permite orientar a atenção sem criar superioridade ou exclusão.',
    provenance: { id: 'spirit_provisional_center_ath', label: 'Síntese Athanor', class: 'ATH', explanation: 'Estrutura didática criada pela Tehkné Solutions.' }
  },
  {
    id: 'spirit_tiferet_center_v1',
    name: 'Tiferet',
    category: 'sefirah',
    description: 'Comparação opcional com relação e equilíbrio entre partes, sem medir harmonia espiritual.',
    layer: 'kabbalah',
    fallbackNodeId: 'spirit_provisional_hearth_v1',
    provenance: { id: 'spirit_tiferet_center_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Tiferet é usada como arquitetura comparativa, não como conteúdo bíblico ou estágio espiritual.' }
  },
  {
    id: 'spirit_provisional_hearth_v1',
    name: 'Lareira Provisória',
    category: 'athanor',
    description: 'Fallback autoral para um ponto de atenção temporário no conjunto.',
    provenance: { id: 'spirit_provisional_hearth_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Cabala está desativada.' }
  },
  {
    id: 'spirit_ruach_shift_v1',
    name: 'Ruach · Movimento do Sopro',
    category: 'element',
    description: 'Comparação opcional com movimento entre focos, sem atribuir identidade espiritual.',
    layer: 'sefer',
    fallbackNodeId: 'spirit_focus_motion_v1',
    provenance: { id: 'spirit_ruach_shift_cmp', label: 'Comparação textual', class: 'CMP', explanation: 'Uso comparativo para alternância, não apresentado como conteúdo de Salmos.' }
  },
  {
    id: 'spirit_focus_motion_v1',
    name: 'Movimento da Atenção',
    category: 'athanor',
    description: 'Fallback autoral para deslocar o centro sem apagar estados anteriores.',
    provenance: { id: 'spirit_focus_motion_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Sefer está desativado.' }
  },
  {
    id: 'spirit_gen_center_v1',
    name: 'Gen · Montanha',
    category: 'trigram',
    description: 'Comparação opcional com pausa e ponto de parada, sem consulta oracular.',
    layer: 'iching',
    fallbackNodeId: 'spirit_resting_point_v1',
    provenance: { id: 'spirit_gen_center_cmp', label: 'Comparação temática', class: 'CMP', explanation: 'Gen representa pausa provisória no gameplay, sem previsão.' }
  },
  {
    id: 'spirit_resting_point_v1',
    name: 'Ponto de Repouso',
    category: 'athanor',
    description: 'Fallback autoral para interromper a alternância sem definir um centro permanente.',
    provenance: { id: 'spirit_resting_point_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando I Ching está desativado.' }
  },
  {
    id: 'spirit_justice_center_v1',
    name: 'A Justiça',
    category: 'archetype',
    description: 'Arquétipo opcional de medida entre partes, sem julgamento moral ou leitura de destino.',
    layer: 'tarot',
    fallbackNodeId: 'spirit_keeper_proportion_v1',
    provenance: { id: 'spirit_justice_center_cmp', label: 'Comparação arquetípica', class: 'CMP', explanation: 'Postura narrativa de proporção, sem função divinatória.' }
  },
  {
    id: 'spirit_keeper_proportion_v1',
    name: 'Guardiã da Proporção',
    category: 'athanor',
    description: 'Fallback autoral para manter a centralidade limitada e revisável.',
    provenance: { id: 'spirit_keeper_proportion_ath', label: 'Fallback Athanor', class: 'ATH', explanation: 'Usado quando Tarot está desativado.' }
  },
  {
    id: 'spirit_provisional_center_knot_v1',
    name: 'Nó do Centro Provisório',
    category: 'athanor',
    description: 'Componente de gameplay que registra uma centralidade temporária, alternada, vazia ou recusada.',
    provenance: { id: 'spirit_provisional_center_knot_ath', label: 'Componente Athanor', class: 'ATH', explanation: 'Item autoral sem função clínica, oracular ou espiritual.' }
  }
];
