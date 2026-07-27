import type { BiblicalUnit } from '../domain/types';

export const continuousUniqueKeysBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_unique_keys_v1',
  reference: 'Provérbios 20:10',
  title: 'Um mesmo nome não deve carregar duas medidas escondidas',
  principle: 'Quando um objeto declara a mesma chave mais de uma vez, nenhum valor deve substituir outro em silêncio.',
  context: 'O provérbio denuncia medidas divergentes. O Athanor usa essa imagem editorialmente para impedir que nomes repetidos no texto JSON sejam resolvidos pela regra silenciosa de último valor do parser.',
  themes: ['clareza', 'medida', 'chave', 'sobrescrita', 'transparência'],
  application: 'Inspecionar nomes de membros diretamente no texto JSON antes do JSON.parse, recusando duplicatas sem escolher um vencedor.',
  provenance: [{
    id: 'prov-continuous-unique-keys-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; análise lexical, comparação de chaves decodificadas e recusa de duplicatas são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 20:10'
  }]
};

export const continuousUniqueKeysCatalog = {
  id: 'continuous-unique-keys-catalog',
  version: '1.0.0',
  policy: 'unique-decoded-object-keys-before-json-parse-v1',
  scope: 'raw-json-text',
  comparison: 'decoded-json-string-exact',
  automaticResolution: false,
  lastWriteWins: false,
  maxScannerDepth: 128,
  maxScannerTokens: 300_000
} as const;

export const continuousUniqueKeysRestrictions = [
  'Cada objeto JSON precisa declarar cada nome de campo uma única vez',
  'A comparação ocorre depois de decodificar escapes JSON da chave',
  'Chaves literais e escapes equivalentes são consideradas iguais',
  'A comparação é exata e diferencia letras maiúsculas de minúsculas',
  'Objetos diferentes podem reutilizar o mesmo nome de campo',
  'Nenhum valor duplicado é escolhido como vencedor',
  'O Athanor não aplica a regra silenciosa de último valor',
  'O arquivo recebido não é corrigido ou reescrito',
  'A inspeção ocorre antes do JSON.parse',
  'Depois do JSON.parse já não é possível recuperar membros sobrescritos',
  'O scanner possui fusíveis próprios de profundidade e quantidade de tokens',
  'Erros não reproduzem controles invisíveis ou texto perigoso da chave',
  'A recusa não cria histórico, contador, analytics ou diagnóstico pessoal',
  'Chaves únicas não comprovam autenticidade, autoria, intenção ou veracidade'
];
