import type { BiblicalUnit } from '../domain/types';

export const continuousTextVisibilityBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_text_visibility_v1',
  reference: 'Provérbios 12:17',
  title: 'Uma palavra legível não precisa ocultar sua direção',
  principle: 'Clareza técnica pode preservar o texto como foi recebido sem aceitar sinais invisíveis que alterem sua leitura ou direção.',
  context: 'A referência bíblica inicia uma reflexão sobre expressão fiel. O Athanor aplica essa imagem somente à representação textual dos arquivos: normalização, controles invisíveis e direção bidirecional são conferidos sem corrigir, traduzir ou julgar o conteúdo.',
  themes: ['palavra', 'clareza', 'visibilidade', 'direção', 'limite'],
  application: 'Recusar texto Unicode ambíguo ou invisivelmente direcionado antes do checksum, preservando o arquivo original sem reescrita silenciosa.',
  provenance: [{
    id: 'prov-continuous-text-visibility-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; normalização NFC, inspeção de controles e política de não reescrita são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 12:17'
  }]
};

export const continuousTextVisibilityCatalog = {
  id: 'continuous-text-visibility-catalog',
  version: '1.0.0',
  policy: 'nfc-visible-text-no-directional-controls-v1',
  mode: 'reject-without-rewrite',
  normalization: 'NFC',
  maxInspectionNodes: 20_000,
  inspectValues: true,
  inspectObjectKeys: true,
  allowTab: true,
  allowLineFeed: true,
  allowCarriageReturn: true,
  rejectUnpairedSurrogates: true,
  rejectNonCharacters: true,
  rejectReplacementCharacter: true,
  rejectBidirectionalControls: true,
  rejectZeroWidthControls: true,
  rewriteText: false
} as const;

export const continuousTextVisibilityRestrictions = [
  'Textos e nomes de campos precisam estar normalizados em Unicode NFC',
  'Texto não normalizado é recusado, nunca corrigido silenciosamente',
  'Tabulação, quebra de linha e retorno de carro permanecem permitidos',
  'Outros controles C0, DEL e controles C1 são recusados',
  'Marcas e isoladores de direção bidirecional são recusados',
  'Espaço de largura zero, juntores invisíveis e BOM interno são recusados',
  'Soft hyphen, anotações interlineares e caracteres de tag são recusados',
  'Pares substitutos Unicode inválidos são recusados',
  'Não caracteres Unicode são recusados',
  'O caractere de substituição U+FFFD é recusado para evitar perda silenciosa de decodificação',
  'A validação examina valores textuais e nomes de campos',
  'Nenhum texto é traduzido, transliterado, resumido ou corrigido',
  'A política não tenta detectar palavras ofensivas, mentiras ou intenção',
  'A política não promete detectar todos os caracteres visualmente semelhantes',
  'Recusar um texto técnico não julga a pessoa ou o conteúdo associado',
  'Nenhum resultado da inspeção é persistido ou enviado'
];
