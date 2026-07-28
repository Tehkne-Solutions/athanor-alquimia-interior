import type { ProvenanceEntry } from '../domain/types';

export const continuousReceivedHydrationBiblicalUnit = {
  id: 'tessalonicenses_continuous_received_hydration_v1',
  reference: '1 Tessalonicenses 5:21',
  title: 'A memória persistida precisa ser examinada antes de voltar ao presente',
  principle: 'Aquilo que foi guardado localmente só volta a orientar a experiência depois de passar novamente pelos limites conhecidos.',
  context: 'A IndexedDB pode conservar uma biblioteca antiga, incompleta ou alterada fora do fluxo atual. Hidratar esse estado diretamente faria a persistência contornar as barreiras do domínio.',
  themes: ['exame', 'memória', 'persistência', 'hidratação', 'limite'],
  application: 'Validar forma, envelope, versão da store, pacotes e invariantes da biblioteca antes de adotar qualquer estado persistido no runtime.',
  provenance: [{
    id: 'bib-continuous-received-hydration',
    label: 'Examinar antes de reter',
    class: 'BIB',
    explanation: '1 Tessalonicenses 5:21 inicia a reflexão sobre exame; envelope da store, hidratação defensiva e recusa sem migração são estruturas autorais do Athanor.',
    sourceLabel: '1 Tessalonicenses 5:21'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedHydrationPolicy = {
  id: 'continuous-received-hydration-policy',
  version: '1.0.0',
  policy: 'validate-persisted-received-state-before-hydration-v1',
  storageKey: 'athanor-continuous-received-state',
  expectedSchemaVersion: 1,
  requireInertJson: true,
  requireStrictEnvelope: true,
  revalidatePackages: true,
  revalidateRegistry: true,
  preserveRejectedStorage: true,
  allowSilentMigration: false,
  persistDiagnostics: false,
  maxReportedIssues: 20
} as const;

export const continuousReceivedHydrationRestrictions = [
  'A hidratação aceita somente o envelope conhecido com schemaVersion e registry.',
  'A versão persistida da store precisa ser exatamente 1.',
  'Campos adicionais no envelope, na biblioteca, nos registros ou nos pacotes são recusados.',
  'A memória persistida precisa permanecer JSON inerte e sem comportamento oculto.',
  'Cada pacote recebido é validado novamente antes de entrar no runtime.',
  'Cronologia, impressão, identidade e catálogo da biblioteca são conferidos novamente.',
  'Um estado recusado não substitui a biblioteca inicial do runtime.',
  'Os bytes recusados permanecem na IndexedDB e não são apagados automaticamente.',
  'Nenhum campo persistido é corrigido, completado ou migrado silenciosamente.',
  'O diagnóstico de hidratação é transitório e não volta para a IndexedDB.',
  'Ausência de estado persistido mantém uma biblioteca local nova e válida.',
  'Hidratação válida cria snapshot defensivo sem compartilhar referências com a entrada.',
  'Validação de hidratação não comprova identidade, autoria, origem ou autenticidade.'
] as const;
