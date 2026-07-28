import type { ProvenanceEntry } from '../domain/types';

export const continuousReceivedExplicitRehydrationBiblicalUnit = {
  id: 'proverbios_continuous_received_explicit_rehydration_v1',
  reference: 'Provérbios 18:13',
  title: 'A memória é ouvida novamente antes de outra resposta',
  principle: 'Depois de um conflito local, o Athanor examina novamente a memória atual somente por uma escolha explícita.',
  context: 'Detectar que outra aba alterou a IndexedDB protege contra sobrescrita, mas apenas bloquear a sessão deixa a pessoa sem um caminho interno para conhecer a versão atual. A releitura precisa usar as mesmas barreiras da hidratação e não pode repetir a ação que perdeu a corrida.',
  themes: ['releitura', 'conflito', 'memória', 'escolha', 'prudência'],
  application: 'Oferecer uma releitura explícita após conflito, adotar somente memória aceita ou ausência confirmada e manter o bloqueio quando a memória for recusada ou indisponível.',
  provenance: [{
    id: 'bib-continuous-received-explicit-rehydration',
    label: 'Ouvir antes de responder',
    class: 'BIB',
    explanation: 'Provérbios 18:13 inicia a reflexão sobre ouvir antes de responder; releitura explícita, revalidação local e não repetição da ação são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 18:13'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedExplicitRehydrationPolicy = {
  id: 'continuous-received-explicit-rehydration-policy',
  version: '1.0.0',
  policy: 'explicit-reread-after-conflict-without-merge-or-replay-v1',
  allowedSourceStatus: 'conflict',
  validatePersistVersion: 0,
  adoptAccepted: true,
  adoptConfirmedEmpty: true,
  adoptRejected: false,
  clearConflictOnAdoption: true,
  preserveConflictOnRejection: true,
  replayInterruptedAction: false,
  mergeSnapshots: false,
  writeDuringReread: false,
  persistDiagnostics: false,
  maxReportedIssues: 5
} as const;

export const continuousReceivedExplicitRehydrationRestrictions = [
  'A releitura só é iniciada por uma ação explícita depois de um conflito de persistência.',
  'Nenhuma ação interrompida pelo conflito é repetida, enfileirada ou reconstruída automaticamente.',
  'A releitura não grava, remove, corrige, migra ou mescla a memória persistida.',
  'A versão atual é adotada somente quando passa novamente pelas barreiras completas da hidratação.',
  'Ausência confirmada da chave cria uma biblioteca local nova sem restaurar o snapshot obsoleto.',
  'Memória recusada preserva o snapshot ativo anterior e mantém o conflito bloqueando novas mutações.',
  'Falha de leitura preserva o snapshot ativo e mantém a memória externa sem alteração.',
  'A referência esperada do compare-and-set só muda quando uma memória aceita ou vazia é adotada.',
  'Prévia de arquivo, consentimentos e decisões locais não são enviados, mesclados ou reaplicados pela releitura.',
  'Nenhum reload automático, BroadcastChannel, sincronização, histórico, analytics ou telemetria é criado.'
] as const;
