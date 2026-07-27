import type { BiblicalUnit } from '../domain/types';

export interface ContinuousReceiveConsentStep {
  id: 'file' | 'preview' | 'separate-library' | 'keep-copy';
  label: string;
  description: string;
}

export const continuousReceiveBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_receive_v1',
  reference: 'Provérbios 18:13',
  title: 'Receber antes de interpretar preserva a alteridade',
  principle: 'Acolher um registro de outra pessoa não autoriza reconstruir sua história, responder por ela ou incorporar sua experiência como progresso próprio.',
  context: 'O provérbio adverte contra responder antes de ouvir. O Athanor aplica essa referência a uma recepção local, separada e descritiva, sem inferir identidade, intenção, diagnóstico ou direção espiritual.',
  themes: ['escuta', 'alteridade', 'recepção', 'limite', 'cuidado'],
  application: 'Validar um pacote compartilhado, revisar sua prévia e guardá-lo em uma biblioteca recebida separada das próprias jornadas.',
  provenance: [{
    id: 'prov-continuous-receive-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; validação, biblioteca separada e deduplicação são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 18:13'
  }]
};

export const continuousReceiveCatalog = {
  id: 'continuous-receive-catalog',
  version: '1.0.0',
  acceptedSchema: 'athanor-continuous-collection-share-v1',
  acceptedPolicy: 'explicit-consent-minimized-local-export-v1',
  mode: 'separate-received-library',
  mergeIntoJourneys: false,
  mergeIntoCollections: false,
  senderIdentity: false,
  automaticResponse: false
} as const;

export const continuousReceiveConsentSteps: ContinuousReceiveConsentStep[] = [
  { id: 'file', label: 'Escolhi este arquivo local', description: 'A seleção pode ser descartada sem criar registro.' },
  { id: 'preview', label: 'Revisei a prévia recebida', description: 'A prévia mostra o conteúdo sanitizado que poderá ser guardado.' },
  { id: 'separate-library', label: 'Entendo que ficará em biblioteca separada', description: 'O pacote não será mesclado às minhas jornadas, mapas ou coleções.' },
  { id: 'keep-copy', label: 'Escolho guardar uma cópia local', description: 'Remover a cópia depois não altera o arquivo de origem.' }
];

export const continuousReceiveRestrictions = [
  'Somente o schema oficial de partilha do Athanor é aceito',
  'A política de minimização e consentimento precisa ser compatível',
  'Campos desconhecidos são descartados durante a validação',
  'Identidade, nome, contato e relação com quem enviou não são solicitados',
  'Nenhuma resposta, confirmação de leitura ou notificação é enviada',
  'O pacote recebido não cria jornadas, Rastros, ciclos ou progresso',
  'O pacote recebido não é mesclado às coleções próprias',
  'A biblioteca recebida possui store local separado',
  'Arquivos duplicados são reconhecidos por impressão descritiva local',
  'Coleções vazias permanecem válidas',
  'Ordem, quantidade e datas não representam valor, prioridade ou maturidade',
  'Registros desconhecidos permanecem desconhecidos e sem interpretação',
  'Descartar a prévia não registra recusa ou tentativa',
  'Remover uma cópia recebida não altera o arquivo externo nem a origem'
];
