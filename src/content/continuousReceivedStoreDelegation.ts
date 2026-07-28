import type { ProvenanceEntry } from '../domain/types';

export const continuousReceivedStoreDelegationBiblicalUnit = {
  id: 'proverb_continuous_received_store_delegation_v1',
  reference: 'Provérbios 18:17',
  title: 'A primeira impressão não encerra a comparação',
  principle: 'Uma fachada não deve transformar um indício inicial em decisão final quando o domínio ainda precisa comparar o conteúdo completo.',
  context: 'A store da biblioteca recebida existia antes das barreiras de colisão, identidade, cronologia e versão. Manter uma decisão antecipada por impressão curta faria a interface contradizer o domínio sem aviso.',
  themes: ['comparação', 'delegação', 'fachada', 'domínio', 'coerência'],
  application: 'Delegar inserção e mutações às APIs explícitas do domínio, propagar o identificador realmente armazenado e nunca descartar uma cópia apenas porque sua impressão coincide.',
  provenance: [{
    id: 'bib-continuous-received-store-delegation',
    label: 'Ouvir antes de concluir',
    class: 'BIB',
    explanation: 'Provérbios 18:17 inicia a reflexão sobre conclusões prematuras; adapter de store, estados explícitos e fonte única de decisão são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 18:17'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedStoreDelegationPolicy = {
  id: 'continuous-received-store-delegation-policy',
  version: '1.0.0',
  policy: 'store-delegates-received-decisions-to-domain-v1',
  delegateKeepToDomain: true,
  delegateMutationsToDomain: true,
  fingerprintPrecheckAllowed: false,
  equivalencePreviewUsesCanonicalComparison: true,
  propagateStoredId: true,
  propagateDomainStatus: true,
  preserveRejectedRegistryIdentity: true,
  persistAdditionalFields: false
} as const;

export const continuousReceivedStoreDelegationRestrictions = [
  'A store não decide duplicação usando somente a impressão curta.',
  'A inserção precisa chamar keepReceivedCollectionWithIdentity.',
  'Arquivamento, reativação e remoção precisam usar as APIs explícitas de identidade.',
  'O identificador devolvido à interface precisa ser o storedId realmente escolhido pelo domínio.',
  'Os estados kept, equivalent, disambiguated, stale e invalid precisam permanecer distinguíveis.',
  'Os estados updated, unchanged, missing, ambiguous, stale e invalid precisam permanecer distinguíveis.',
  'Uma colisão de impressão com conteúdo diferente precisa preservar a nova cópia.',
  'A prévia de duplicação precisa usar equivalência canônica e não a primeira impressão encontrada.',
  'Uma operação recusada não grava novamente a mesma biblioteca como se tivesse mudado.',
  'A fachada não corrige versão, impressão, relógio ou identificador por conta própria.',
  'Nenhuma nova chave persistida é criada para mensagens ou diagnósticos.',
  'Delegação ao domínio não comprova identidade, autoria, origem ou autenticidade.'
] as const;
