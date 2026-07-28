import type { BiblicalUnit } from '../domain/types';

export const continuousCanonicalNoticeBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_canonical_notice_v1',
  reference: 'Provérbios 30:6',
  title: 'O aviso não recebe acréscimos em silêncio',
  principle: 'Uma formulação de limite precisa permanecer reconhecível, sem receber promessas, cobranças ou sentidos adicionais durante a transmissão.',
  context: 'O provérbio adverte contra acrescentar palavras. O Athanor aplica essa imagem editorialmente aos avisos técnicos e de consentimento dos arquivos locais, sem afirmar autoridade espiritual sobre o conteúdo compartilhado.',
  themes: ['palavra', 'limite', 'aviso', 'fidelidade', 'transmissão'],
  application: 'Manter avisos curados, únicos e ordenados, recusando textos desconhecidos em vez de corrigi-los ou substituí-los.',
  provenance: [{
    id: 'prov-canonical-notice-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; catálogo, ordem e condições dos avisos são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 30:6'
  }]
};

export const continuousShareMandatoryNotices = [
  'A ordem é preservada somente como organização manual, sem prioridade implícita.',
  'O pacote não contém IDs internos de jornadas, Rastros, ciclos ou coleções.',
  'O arquivo final recebe um selo local de consistência que não autentica identidade ou autoria.',
  'O arquivo final precisa permanecer dentro do orçamento local de tamanho e complexidade.',
  'O arquivo final contém somente JSON inerte, sem comportamento oculto.',
  'Textos e nomes de campos permanecem Unicode NFC e sem controles invisíveis, sem reescrita automática.',
  'Nenhuma margem textual externa é removida durante a geração ou a leitura.',
  'Instantes temporais usam UTC canônico com milissegundos e nunca são convertidos silenciosamente.',
  'Quantidade, posições, política de datas e cronologia precisam concordar antes do download.',
  'Tema, pacote, tipo, estado e encerramento precisam permanecer compatíveis entre si.',
  'Modelo, tema, variante e pacote precisam existir nos catálogos locais compatíveis.'
] as const;

export const continuousShareConditionalNotices = {
  datesOmitted: 'Datas foram omitidas.',
  emptyCollection: 'Esta coleção está vazia e continua válida para exportação.',
  unlinkedRecords: 'Registros não vinculados permanecem descritivos e não são interpretados.'
} as const;

export const continuousResponseMandatoryNotices = [
  'A resposta não inclui os itens nem as datas da coleção recebida.',
  'A impressão descritiva permite reconhecer manualmente o pacote sem identificar pessoas.',
  'Nenhuma resposta adicional é necessária.',
  'O arquivo final recebe um selo local de consistência que não autentica identidade ou autoria.',
  'O arquivo final precisa permanecer dentro do orçamento local de tamanho e complexidade.',
  'O arquivo final contém somente JSON inerte, sem comportamento oculto.',
  'Textos e nomes de campos permanecem Unicode NFC e sem controles invisíveis, sem reescrita automática.',
  'Nenhuma margem textual externa é removida durante a geração ou a leitura.',
  'O instante de geração usa UTC canônico com milissegundos e nunca é convertido silenciosamente.',
  'A resposta não acrescenta relações temporais além do instante de geração canônico.',
  'O pacote de resposta atual não possui discriminantes opcionais adicionais a reconciliar.',
  'O gesto, o rótulo e a declaração precisam corresponder exatamente ao catálogo local exportável.'
] as const;

export const continuousResponseConditionalNotices = {
  emptySource: 'A origem é uma coleção vazia e permanece válida.',
  silencePreserved: 'Silêncio preservado: nenhum arquivo ou histórico será criado.'
} as const;

export const continuousCanonicalNoticeCatalog = {
  id: 'continuous-canonical-notice-catalog',
  version: '1.0.0',
  policy: 'require-canonical-unique-ordered-notices-v1',
  unknownNoticesAllowed: false,
  duplicateNoticesAllowed: false,
  canonicalOrderRequired: true,
  derivableConditionsRequired: true,
  minimizedOriginNoticeOptional: true,
  maxReportedIssues: 20,
  share: {
    mandatory: continuousShareMandatoryNotices,
    conditional: continuousShareConditionalNotices,
    order: [
      ...continuousShareMandatoryNotices,
      continuousShareConditionalNotices.datesOmitted,
      continuousShareConditionalNotices.emptyCollection,
      continuousShareConditionalNotices.unlinkedRecords
    ]
  },
  response: {
    mandatory: continuousResponseMandatoryNotices,
    conditional: continuousResponseConditionalNotices,
    order: [
      ...continuousResponseMandatoryNotices,
      continuousResponseConditionalNotices.emptySource,
      continuousResponseConditionalNotices.silencePreserved
    ]
  }
} as const;

export const continuousCanonicalNoticeRestrictions = [
  'Avisos desconhecidos são recusados e nunca são preservados como texto livre',
  'Avisos obrigatórios ausentes interrompem o pacote inteiro',
  'Avisos duplicados são recusados mesmo quando o texto é canônico',
  'A ordem do catálogo é preservada para impedir reorganização silenciosa de ênfase',
  'O aviso de datas omitidas é obrigatório somente quando includeDates é false',
  'O aviso de coleção vazia é obrigatório somente quando itemCount é zero',
  'O aviso de origem vazia é obrigatório somente quando a resposta referencia zero itens',
  'O aviso de silêncio não pode existir em um arquivo de resposta exportável',
  'O aviso de registros não vinculados é opcional porque linked não atravessa a minimização',
  'Nenhum aviso desconhecido é aproximado, traduzido, corrigido ou substituído',
  'A recusa não altera o arquivo original e não cria cópia corrigida',
  'A validação não executa getters nem consulta fontes externas',
  'Avisos canônicos não comprovam identidade, autoria, intenção ou veracidade',
  'Avisos canônicos não transformam checksum em assinatura digital',
  'Nenhum histórico de avisos recusados, analytics ou telemetria é criado'
];
