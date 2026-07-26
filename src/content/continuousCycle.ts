import type { BiblicalUnit } from '../domain/types';
import type { ContinuousCycleComparison, ContinuousCycleStatus } from '../domain/continuousCycle';

export const continuousCycleBiblicalUnit: BiblicalUnit = {
  id: 'psalm_continuous_return_v1',
  reference: 'Salmos 119:59',
  title: 'Retornar ao caminho não apaga o percurso',
  principle: 'Considerar o caminho e escolher um retorno pode preservar a memória do que já foi vivido, sem transformar repetição em obrigação.',
  context: 'O salmo apresenta reflexão sobre os próprios caminhos. O Athanor aplica esse princípio editorialmente à abertura de jornadas contínuas locais, sem afirmar correção divina específica, culpa, previsão ou superioridade de um ciclo sobre outro.',
  themes: ['retorno', 'caminho', 'memória', 'revisão', 'continuidade'],
  application: 'Ativar, pausar, retomar, encerrar ou arquivar uma jornada separada, mantendo intactos os registros anteriores.',
  provenance: [{
    id: 'prov-continuous-return-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão sobre retorno; estados, comparações e instâncias contínuas são estruturas autorais do Athanor.',
    sourceLabel: 'Salmos 119:59'
  }]
};

export const continuousCycleStatusOptions: Array<{ id: ContinuousCycleStatus; label: string; description: string }> = [
  { id: 'active', label: 'Ativa', description: 'A jornada está disponível para observação ou revisita, sem reiniciar missões.' },
  { id: 'paused', label: 'Pausada', description: 'A jornada permanece registrada sem exigir retomada ou prazo.' },
  { id: 'closed', label: 'Encerrada', description: 'O ciclo local foi concluído sem apagar seu registro de origem.' },
  { id: 'archived', label: 'Arquivada', description: 'A jornada saiu do fluxo atual e continua disponível no histórico.' }
];

export const continuousCycleComparisonOptions: Array<{ id: ContinuousCycleComparison; label: string; description: string }> = [
  { id: 'not_compared', label: 'Não comparar', description: 'Manter os ciclos lado a lado sem estabelecer relação.' },
  { id: 'similar_context', label: 'Contexto semelhante', description: 'Registrar semelhança sem declarar progresso ou repetição correta.' },
  { id: 'changed_context', label: 'Contexto mudou', description: 'Reconhecer mudança de situação sem atribuir culpa.' },
  { id: 'changed_resources', label: 'Recursos mudaram', description: 'Registrar mudança de disponibilidade sem medir capacidade pessoal.' },
  { id: 'changed_focus', label: 'Foco mudou', description: 'Reconhecer outro ponto de atenção sem hierarquia entre elementos.' },
  { id: 'unknown', label: 'Relação desconhecida', description: 'Preservar a ausência de informação sem preencher por interpretação.' }
];

export const continuousCycleProceduralPolicy = {
  id: 'continuous_curated_policy_v1',
  source: 'curated_registry' as const,
  copiesPreviousCycle: false,
  allowedStages: ['orientation', 'observation', 'review'] as const,
  description: 'A semente identifica origem, elemento e modalidade para conteúdo futuro curado. Ela não copia respostas, notas, destinos ou estados pessoais de ciclos anteriores.'
};

export const continuousCycleRestrictions = [
  'A ativação cria uma instância separada e não reinicia a missão original',
  'Nenhuma comparação produz nota, ranking, progresso ou recompensa maior',
  'Pausar, encerrar e arquivar são resultados completos',
  'Repouso não pode ser convertido automaticamente em ação',
  'Nenhuma instância envia mensagens, inicia cronômetros ou cria notificações',
  'A semente procedural futura usa somente metadados curados e nunca copia conteúdo pessoal',
  'Os registros permanecem locais e podem ser recusados ou arquivados'
];
