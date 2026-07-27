import type { BiblicalUnit } from '../domain/types';

export interface ContinuousReturnConsentStep {
  id: 'file' | 'preview' | 'no-reopen';
  label: string;
  description: string;
}

export const continuousReturnBiblicalUnit: BiblicalUnit = {
  id: 'ecclesiastes_continuous_return_v1',
  reference: 'Eclesiastes 3:6',
  title: 'Há tempo de guardar e tempo de soltar',
  principle: 'Receber um retorno não obriga a preservar, responder, interpretar ou reabrir o que já foi concluído.',
  context: 'A referência inicia uma reflexão sobre guardar e deixar ir. O Athanor aplica essa imagem a uma leitura transitória de respostas locais, sem criar acompanhamento, confirmação, identidade ou vínculo persistente.',
  themes: ['retorno', 'encerramento', 'desapego', 'limite', 'silêncio'],
  application: 'Validar um arquivo de resposta, revisar seu gesto e encerrar a leitura sem histórico ou nova obrigação.',
  provenance: [{
    id: 'eccl-continuous-return-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; parser, prévia transitória e descarte são estruturas autorais do Athanor.',
    sourceLabel: 'Eclesiastes 3:6'
  }]
};

export const continuousReturnCatalog = {
  id: 'continuous-return-catalog',
  version: '1.0.0',
  acceptedSchema: 'athanor-continuous-response-v1',
  acceptedPolicy: 'optional-curated-no-tracking-v1',
  mode: 'transient-local-preview',
  persistentHistory: false,
  sourceReopened: false,
  followUpCreated: false
} as const;

export const continuousReturnConsentSteps: ContinuousReturnConsentStep[] = [
  { id: 'file', label: 'Escolhi este arquivo de retorno', description: 'A leitura ocorre somente no dispositivo e pode ser interrompida a qualquer momento.' },
  { id: 'preview', label: 'Revisei a prévia sanitizada', description: 'A prévia mostra exatamente o gesto curado recebido e seus limites.' },
  { id: 'no-reopen', label: 'Entendo que nada será reaberto', description: 'A conclusão não cria resposta, lembrete, histórico, vínculo ou nova etapa.' }
];

export const continuousReturnRestrictions = [
  'Somente o schema oficial de resposta é aceito',
  'O arquivo é lido localmente e nunca enviado pelo Athanor',
  'A prévia existe apenas enquanto a tela estiver aberta',
  'Nenhum histórico de retornos é persistido',
  'Nenhuma coleção, partilha ou jornada é reaberta',
  'Nenhuma resposta adicional é sugerida ou exigida',
  'Nenhuma confirmação de leitura é criada',
  'Nenhuma identidade, contato ou destinatário é solicitado',
  'Nenhum prazo, lembrete ou acompanhamento é criado',
  'Descartar o arquivo não registra recusa',
  'Concluir a leitura não altera progresso, coleção ou inventário',
  'O gesto recebido não é interpretado além do texto curado do pacote',
  'Arquivos inválidos são recusados sem tentativa de reparo automático',
  'A ausência de retorno permanece um encerramento válido'
];
