export type HomologationStatus = 'not-tested' | 'passed' | 'friction' | 'blocked';

export interface HomologationTask {
  id: string;
  title: string;
  expectedOutcome: string;
  path: string;
  category: 'onboarding' | 'journey' | 'accessibility' | 'privacy';
}

export interface HomologationTaskResult {
  status: HomologationStatus;
  notes: string;
}

export interface HomologationMetadata {
  participantCode: string;
  deviceProfile: string;
  assistiveTechnology: string;
  moderator: string;
}

export interface HomologationRatings {
  comprehension: number;
  navigation: number;
  visualComfort: number;
  trust: number;
}

export interface HomologationReportInput {
  metadata: HomologationMetadata;
  results: Record<string, HomologationTaskResult>;
  ratings: HomologationRatings;
  finalNotes: string;
  generatedAt?: string;
}

export const homologationTasks: HomologationTask[] = [
  { id: 'create-character', title: 'Criar personagem e compreender as classes', expectedOutcome: 'A pessoa conclui a identidade sem interpretar classe ou origem como diagnóstico.', path: '/character/create', category: 'onboarding' },
  { id: 'found-temple', title: 'Fundar o Templo e escolher um tema', expectedOutcome: 'A pessoa entende que o tema é visual e reversível.', path: '/temple/foundation', category: 'onboarding' },
  { id: 'configure-sources', title: 'Configurar Bíblia e camadas simbólicas', expectedOutcome: 'A Bíblia é reconhecida como núcleo e as demais camadas como opcionais.', path: '/setup/bible', category: 'onboarding' },
  { id: 'locate-mission', title: 'Localizar a missão principal no Átrio', expectedOutcome: 'A pessoa encontra a ação principal sem ajuda do moderador.', path: '/temple', category: 'journey' },
  { id: 'classify-statements', title: 'Classificar fato, interpretação, previsão e intenção', expectedOutcome: 'A pessoa entende as quatro categorias e consegue corrigir uma escolha.', path: '/mission/word-before-response/classification', category: 'journey' },
  { id: 'inspect-provenance', title: 'Abrir e explicar a proveniência da cadeia', expectedOutcome: 'A pessoa diferencia fonte bíblica, tradição, comparação e criação Athanor.', path: '/mission/word-before-response/chain', category: 'journey' },
  { id: 'craft-lamp', title: 'Forjar e posicionar a Lâmpada', expectedOutcome: 'A pessoa entende a função do item e seus limites simbólicos.', path: '/crafting/clear-word-lamp', category: 'journey' },
  { id: 'review-cycle', title: 'Retornar e revisar o ciclo', expectedOutcome: 'A pessoa consegue integrar, ajustar ou repousar sem punição.', path: '/review/clear-word-lamp', category: 'journey' },
  { id: 'keyboard-navigation', title: 'Navegar sem mouse', expectedOutcome: 'Foco, ordem, skip link e ações permanecem visíveis e utilizáveis.', path: '/temple', category: 'accessibility' },
  { id: 'accessibility-settings', title: 'Ativar contraste alto e movimento reduzido', expectedOutcome: 'As preferências alteram a interface imediatamente e persistem.', path: '/settings/accessibility', category: 'accessibility' },
  { id: 'privacy-boundaries', title: 'Explicar onde os dados são armazenados', expectedOutcome: 'A pessoa entende que o estado permanece local e pode ser apagado.', path: '/temple', category: 'privacy' }
];

const emptyResult: HomologationTaskResult = { status: 'not-tested', notes: '' };

export function buildHomologationReport(input: HomologationReportInput) {
  const tasks = homologationTasks.map((task) => ({
    id: task.id,
    title: task.title,
    category: task.category,
    result: input.results[task.id] ?? emptyResult
  }));

  const summary = tasks.reduce(
    (totals, task) => ({ ...totals, [task.result.status]: totals[task.result.status] + 1 }),
    { 'not-tested': 0, passed: 0, friction: 0, blocked: 0 } as Record<HomologationStatus, number>
  );

  return {
    schemaVersion: 1,
    product: 'Athanor — Alquimia Interior',
    phase: '4.3 — Homologação Visual e Pesquisa Moderada',
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    privacy: 'Este relatório contém somente observações da sessão de teste e não inclui Diário, emoções ou progresso privado do aplicativo.',
    metadata: input.metadata,
    summary,
    ratings: input.ratings,
    tasks,
    finalNotes: input.finalNotes,
    signature: 'Tehkné Solutions'
  };
}
