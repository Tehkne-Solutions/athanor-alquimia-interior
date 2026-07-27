import type { BiblicalUnit } from '../domain/types';

export interface ContinuousShareConsentStep {
  id: 'collection' | 'preview' | 'local-file' | 'recipient' | 'no-personal-notes';
  label: string;
  description: string;
}

export const continuousShareBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_share_v1',
  reference: 'Provérbios 11:13',
  title: 'Guardar confiança também é uma forma de cuidado',
  principle: 'Partilhar exige discernimento, consentimento explícito e limite sobre o que sai do próprio dispositivo.',
  context: 'O provérbio inicia uma reflexão sobre confiança e discrição. O Athanor aplica essa referência a uma exportação local e deliberada, sem envio automático, vigilância, interpretação ou promessa de segurança absoluta.',
  themes: ['confiança', 'discrição', 'consentimento', 'limite', 'partilha'],
  application: 'Revisar uma coleção, minimizar seus dados e gerar um arquivo local somente após confirmações explícitas.',
  provenance: [{
    id: 'prov-continuous-share-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; consentimentos, prévia e formato de exportação são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 11:13'
  }]
};

export const continuousShareCatalog = {
  id: 'continuous-share-catalog',
  version: '1.0.0',
  schema: 'athanor-continuous-collection-share-v1',
  policy: 'explicit-consent-minimized-local-export-v1',
  mode: 'manual-local-file',
  automaticSending: false,
  recipientStorage: false,
  personalNotes: false
} as const;

export const continuousShareConsentSteps: ContinuousShareConsentStep[] = [
  { id: 'collection', label: 'Escolhi esta coleção', description: 'A seleção é deliberada e pode ser cancelada antes do download.' },
  { id: 'preview', label: 'Revisei a prévia', description: 'A prévia mostra exatamente os campos descritivos que serão incluídos.' },
  { id: 'local-file', label: 'Entendo que será criado um arquivo local', description: 'O Athanor não envia, publica ou sincroniza o arquivo.' },
  { id: 'recipient', label: 'Escolhi por conta própria quem poderá receber', description: 'Nenhum nome, contato ou relação é armazenado no aplicativo.' },
  { id: 'no-personal-notes', label: 'Confirmei que não há notas pessoais no pacote', description: 'O formato aceita somente metadados curados e snapshots minimizados.' }
];

export const continuousShareRestrictions = [
  'Nenhum arquivo é enviado automaticamente',
  'Nenhuma conta, contato ou destinatário é registrado',
  'O download exige cinco confirmações explícitas',
  'A prévia exibe todos os campos antes da exportação',
  'Identificadores internos de jornadas e Rastros são omitidos',
  'Datas são omitidas por padrão e dependem de escolha separada',
  'Notas pessoais, emoções, diagnósticos e textos livres não entram no schema',
  'A ordem dos itens não representa prioridade, importância ou valor',
  'Coleções vazias podem ser exportadas',
  'O arquivo não restaura jornadas nem concede progresso',
  'Cancelar ou sair da tela não registra tentativa de partilha',
  'Depois do download, a guarda e o envio do arquivo pertencem à decisão do usuário'
];
