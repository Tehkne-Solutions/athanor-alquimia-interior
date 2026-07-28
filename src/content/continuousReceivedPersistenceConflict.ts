import type { ProvenanceEntry } from '../domain/types';

export const continuousReceivedPersistenceConflictBiblicalUnit = {
  id: 'proverbios_continuous_received_persistence_conflict_v1',
  reference: 'Provérbios 27:12',
  title: 'A memória local não apaga uma mudança que chegou antes',
  principle: 'Antes de substituir a biblioteca persistida, o Athanor confere se ela ainda é a mesma memória examinada por esta sessão.',
  context: 'Duas abas podem hidratar o mesmo snapshot e produzir alterações diferentes. Confirmar duas transações sem comparar a origem permite que a última escrita apague silenciosamente a primeira.',
  themes: ['prudência', 'concorrência', 'memória', 'conflito', 'preservação'],
  application: 'Comparar e gravar na mesma transação IndexedDB, interrompendo a ação quando outra sessão tiver alterado o valor persistido.',
  provenance: [{
    id: 'bib-continuous-received-persistence-conflict',
    label: 'Perceber o risco antes de avançar',
    class: 'BIB',
    explanation: 'Provérbios 27:12 inicia a reflexão sobre perceber um risco antes de seguir; compare-and-set, referência transitória e bloqueio de conflito são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 27:12'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedPersistenceConflictPolicy = {
  id: 'continuous-received-persistence-conflict-policy',
  version: '1.0.0',
  policy: 'atomic-compare-before-indexeddb-replace-v1',
  storageKey: 'athanor-continuous-received-state',
  compareAndWriteInOneTransaction: true,
  compareExactHydratedValue: true,
  persistExpectedValue: false,
  blockAfterConflict: true,
  mergeAutomatically: false,
  retryAutomatically: false,
  overwriteExternalChange: false,
  maxReportedIssues: 5
} as const;

export const continuousReceivedPersistenceConflictRestrictions = [
  'O valor bruto lido durante a hidratação é mantido somente como referência transitória desta sessão.',
  'Leitura de conferência e escrita do próximo envelope ocorrem na mesma transação readwrite.',
  'A gravação só acontece quando o valor persistido ainda coincide exatamente com a referência esperada.',
  'Valor alterado, removido ou substituído por outra aba produz conflito e não é sobrescrito.',
  'Conflito preserva a biblioteca ativa anterior e também preserva a memória externa mais recente.',
  'Depois de um conflito, novas mutações permanecem bloqueadas até uma nova hidratação explícita.',
  'O Athanor não mescla, escolhe vencedor, repete ou reaplica automaticamente a ação recusada.',
  'A referência esperada não cria campo, versão, chave IndexedDB, histórico ou registro persistido.',
  'Comparação textual exata detecta também mudanças externas de campos, ordem ou envelope desconhecido.',
  'Compare-and-set local não comprova identidade da outra sessão, autoria, intenção ou sincronização.'
] as const;
