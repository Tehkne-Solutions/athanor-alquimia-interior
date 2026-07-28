import type { BiblicalUnit } from '../domain/types';

export const continuousCatalogReferenceBiblicalUnit: BiblicalUnit = {
  id: 'corinthians_continuous_catalog_reference_v1',
  reference: '1 Coríntios 14:40',
  title: 'Nomear uma referência não permite trocar sua ordem ou origem',
  principle: 'Uma estrutura pode manter referências reconhecíveis e ordenadas sem transformar catálogo em autoridade sobre a pessoa ou sobre o significado da experiência.',
  context: 'A passagem conclui uma orientação comunitária sobre ordem. O Athanor usa essa imagem editorialmente para impedir que identificadores desconhecidos ou incompatíveis sejam aceitos como se pertencessem ao catálogo atual.',
  themes: ['ordem', 'referência', 'catálogo', 'limite', 'compatibilidade'],
  application: 'Conferir modelos, temas, variantes e pacotes antes do domínio, sem inventar, corrigir ou substituir referências.',
  provenance: [{
    id: 'bible-corinthians-14-40-catalog-reference',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; manifestos de IDs, compatibilidade e interrupção são estruturas autorais do Athanor.',
    sourceLabel: '1 Coríntios 14:40'
  }]
};

export const continuousCatalogReferenceCatalog = {
  id: 'continuous-catalog-reference-catalog',
  version: '1.0.0',
  policy: 'reject-unknown-or-mismatched-catalog-references-before-domain-v1',
  source: 'bundled-curated-catalogs',
  unknownExplicitThemeStateAllowed: true,
  unknownProvidedIdsAllowed: false,
  automaticReplacement: false,
  maxReportedIssues: 20
} as const;

export const continuousCatalogReferenceRestrictions = [
  'Modelo de coleção precisa existir no catálogo local atual',
  'Tema informado precisa existir e aceitar o elemento declarado',
  'Ausência de themeId com noTheme false continua sendo tema desconhecido válido',
  'Variante precisa existir e pertencer ao elemento declarado',
  'Pacote de ciclo precisa existir com ID e rótulo oficiais',
  'Pacote de ciclo precisa aceitar o elemento declarado',
  'Pacote temático precisa corresponder ao tema informado',
  'Pacote sem tema só pode representar ausência ou desconhecimento explícito de tema',
  'Rastros não recebem referências de pacote de ciclo',
  'Nenhum ID desconhecido é substituído por opção aproximada',
  'Nenhum rótulo divergente é corrigido automaticamente',
  'A recusa não cria histórico, contador, analytics ou telemetria',
  'Referência conhecida não comprova identidade, autoria, evento ou veracidade',
  'Novos IDs exigem versão e catálogo atualizados explicitamente',
  'Todos os catálogos usados permanecem locais e assinados pela Tehkné Solutions'
];
