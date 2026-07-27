import type { BiblicalUnit } from '../domain/types';

export type ContinuousResponseGestureId = 'gratitude' | 'received' | 'time' | 'boundary' | 'silence';

export interface ContinuousResponseGesture {
  id: ContinuousResponseGestureId;
  label: string;
  description: string;
  statement: string;
  createsFile: boolean;
}

export interface ContinuousResponseConsentStep {
  id: 'source' | 'preview' | 'local-file' | 'no-reply';
  label: string;
  description: string;
}

export const continuousResponseBiblicalUnit: BiblicalUnit = {
  id: 'ecclesiastes_continuous_response_v1',
  reference: 'Eclesiastes 3:7',
  title: 'Há tempo de falar e tempo de preservar silêncio',
  principle: 'Uma resposta pode ser oferecida sem cobrança, e o silêncio também pode permanecer uma conclusão completa.',
  context: 'Eclesiastes reconhece tempos distintos para falar e calar. O Athanor usa essa referência para sustentar autonomia: receber uma partilha não cria dívida, prazo, obrigação de agradecimento ou expectativa de continuidade.',
  themes: ['tempo', 'silêncio', 'resposta', 'autonomia', 'limite'],
  application: 'Escolher um gesto curado ou preservar o silêncio sem enviar automaticamente, registrar destinatário ou exigir novo retorno.',
  provenance: [{
    id: 'eccl-continuous-response-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; gestos, consentimentos e schema de resposta são estruturas autorais do Athanor.',
    sourceLabel: 'Eclesiastes 3:7'
  }]
};

export const continuousResponseCatalog = {
  id: 'continuous-response-catalog',
  version: '1.0.0',
  schema: 'athanor-continuous-response-v1',
  policy: 'optional-curated-no-tracking-v1',
  mode: 'manual-local-file-or-silence',
  automaticSending: false,
  freeText: false,
  identityStorage: false,
  responseHistory: false
} as const;

export const continuousResponseGestures: ContinuousResponseGesture[] = [
  {
    id: 'gratitude',
    label: 'Agradecimento simples',
    description: 'Reconhecer a partilha sem avaliar seu conteúdo e sem pedir continuidade.',
    statement: 'Agradeço a partilha. Nenhuma resposta adicional é necessária.',
    createsFile: true
  },
  {
    id: 'received',
    label: 'Recebimento sem comentário',
    description: 'Reconhecer apenas o recebimento, sem interpretação, opinião ou promessa.',
    statement: 'O arquivo foi recebido. Nenhuma resposta adicional é necessária.',
    createsFile: true
  },
  {
    id: 'time',
    label: 'Tempo sem prazo',
    description: 'Indicar que não existe disponibilidade de resposta agora, sem estabelecer data futura.',
    statement: 'Recebi a partilha e preciso de tempo, sem prazo ou obrigação de retorno.',
    createsFile: true
  },
  {
    id: 'boundary',
    label: 'Limite respeitoso',
    description: 'Registrar um limite sem justificar, diagnosticar ou responsabilizar a outra pessoa.',
    statement: 'Recebi a partilha e escolho não continuar esta troca. Nenhuma resposta adicional é necessária.',
    createsFile: true
  },
  {
    id: 'silence',
    label: 'Silêncio preservado',
    description: 'Concluir sem gerar arquivo, histórico ou indicação de recusa.',
    statement: 'Nenhum arquivo de resposta será criado.',
    createsFile: false
  }
];

export const continuousResponseConsentSteps: ContinuousResponseConsentStep[] = [
  { id: 'source', label: 'Escolhi esta cópia recebida', description: 'A resposta referencia somente a impressão descritiva do pacote selecionado.' },
  { id: 'preview', label: 'Revisei o gesto e a prévia', description: 'O texto é curado e não pode conter mensagem livre ou interpretação do conteúdo.' },
  { id: 'local-file', label: 'Entendo que será criado apenas um arquivo local', description: 'O Athanor não envia, publica, compartilha ou registra destinatário.' },
  { id: 'no-reply', label: 'Confirmo que não estou cobrando novo retorno', description: 'O pacote declara explicitamente que nenhuma resposta adicional é necessária.' }
];

export const continuousResponseRestrictions = [
  'Responder é opcional e o silêncio é uma conclusão completa',
  'Nenhum arquivo é enviado automaticamente',
  'Nenhum nome, contato, destinatário ou identidade é solicitado',
  'Nenhuma mensagem livre é permitida',
  'A resposta não inclui itens, datas ou conteúdo da coleção recebida',
  'Somente a impressão descritiva, o rótulo e a quantidade são referenciados',
  'Nenhuma confirmação de entrega, leitura ou recebimento é criada',
  'Nenhuma resposta adicional é exigida',
  'Nenhum prazo, lembrete, streak ou cobrança é produzido',
  'Nenhum histórico de respostas é persistido no Athanor',
  'Gerar ou não gerar arquivo não altera a cópia recebida',
  'Depois do download, qualquer envio acontece fora do Athanor por decisão do usuário'
];
