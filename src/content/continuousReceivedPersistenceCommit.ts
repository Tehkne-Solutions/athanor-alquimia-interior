import type { ProvenanceEntry } from '../domain/types';

export const continuousReceivedPersistenceCommitBiblicalUnit = {
  id: 'lucas_continuous_received_persistence_commit_v1',
  reference: 'Lucas 14:28',
  title: 'A obra local só é declarada concluída depois da confirmação da memória',
  principle: 'Antes de anunciar que uma mudança foi guardada, o Athanor espera a conclusão real da escrita local.',
  context: 'Uma alteração no estado do Zustand pode ocorrer antes de a IndexedDB concluir sua transação. Se a interface anunciar sucesso nesse intervalo, uma falha de storage deixa o runtime e a memória persistida em estados diferentes.',
  themes: ['confirmação', 'persistência', 'escrita', 'ordem', 'responsabilidade'],
  application: 'Persistir o próximo snapshot primeiro, atualizar o runtime somente depois da confirmação e bloquear ações concorrentes sem criar fila.',
  provenance: [{
    id: 'bib-continuous-received-persistence-commit',
    label: 'Calcular antes de concluir',
    class: 'BIB',
    explanation: 'Lucas 14:28 inicia a reflexão sobre concluir com consciência; confirmação transacional, rollback por não aplicação e bloqueio concorrente são estruturas autorais do Athanor.',
    sourceLabel: 'Lucas 14:28'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedPersistenceCommitPolicy = {
  id: 'continuous-received-persistence-commit-policy',
  version: '1.0.0',
  policy: 'confirm-indexeddb-write-before-runtime-commit-v1',
  storageKey: 'athanor-continuous-received-state',
  schemaVersion: 1,
  persistBeforeRuntime: true,
  automaticMiddlewareWrites: false,
  blockConcurrentWrites: true,
  queueBlockedWrites: false,
  retryAutomatically: false,
  preserveRuntimeOnFailure: true,
  persistDiagnostics: false,
  maxReportedIssues: 5
} as const;

export const continuousReceivedPersistenceCommitRestrictions = [
  'Uma mudança só é anunciada como guardada depois de a transação IndexedDB concluir com sucesso.',
  'O próximo snapshot é persistido antes de substituir a biblioteca ativa no Zustand.',
  'Falha de escrita preserva exatamente a biblioteca anterior no runtime.',
  'Ações iniciadas durante outra escrita são bloqueadas e não entram em fila.',
  'Uma ação bloqueada por escrita concorrente não é repetida automaticamente.',
  'Resultados sem mudança de domínio não iniciam transação de escrita.',
  'A store persist middleware continua responsável pela hidratação, mas não escreve automaticamente após set.',
  'Status, mensagens e problemas da escrita vivem em store transitória sem persistência.',
  'Nenhum retry, rollback por nova escrita, migração, analytics, telemetria ou sincronização é criado.',
  'Confirmação da IndexedDB não comprova durabilidade física, identidade, autoria ou autenticidade.'
] as const;
