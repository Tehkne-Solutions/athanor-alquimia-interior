import type { BiblicalUnit } from '../domain/types';

export const continuousExactTextBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_exact_text_v1',
  reference: 'Provérbios 22:28',
  title: 'Preservar um limite também é não apagá-lo sem aviso',
  principle: 'Uma margem textual não deve ser removida automaticamente quando essa mudança altera o conteúdo efetivamente recebido.',
  context: 'Provérbios usa a imagem de limites antigos para orientar prudência. O Athanor aplica essa imagem editorialmente à fronteira de cada string: espaços e quebras nas extremidades são recusados, não corrigidos em silêncio.',
  themes: ['limite', 'texto', 'margem', 'exatidão', 'preservação'],
  application: 'Interromper textos cujas extremidades seriam alteradas por trim, preservando o arquivo original e exigindo correção deliberada fora do aplicativo.',
  provenance: [{
    id: 'prov-continuous-exact-text-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; comparação por trim, diagnóstico de margens e ordem da barreira são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 22:28'
  }]
};

export const continuousExactTextCatalog = {
  id: 'continuous-exact-text-catalog',
  version: '1.0.0',
  policy: 'reject-boundary-whitespace-before-sanitization-v1',
  mode: 'exact-string-boundaries',
  comparison: 'ecmascript-trim-equality',
  maxReportedIssues: 20,
  modifiesInput: false,
  internalWhitespacePreserved: true,
  emptyStringHandledByDomain: true
} as const;

export const continuousExactTextRestrictions = [
  'Todo valor textual conhecido precisa ser idêntico ao resultado de trim',
  'Espaços ou quebras no início são recusados sem remoção automática',
  'Espaços ou quebras no fim são recusados sem remoção automática',
  'Espaços, tabulações e quebras internas permanecem preservados',
  'Textos vazios não são julgados por esta barreira e seguem para o domínio',
  'O diagnóstico não reproduz o conteúdo textual recebido',
  'No máximo vinte caminhos são exibidos por tentativa',
  'A inspeção usa descritores e não executa getters',
  'O arquivo externo nunca é reescrito ou substituído',
  'Os parsers não usam trim para construir a cópia sanitizada',
  'A validação não corrige, resume, traduz ou normaliza o texto',
  'A margem textual não autentica identidade, autoria, intenção ou veracidade',
  'Nenhum histórico de recusas, analytics ou telemetria é criado',
  'A barreira não mede qualidade, educação, valor pessoal ou espiritual'
];
