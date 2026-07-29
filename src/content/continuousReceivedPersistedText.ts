import type { BiblicalUnit } from '../domain/types';
import { defaultContinuousResourceLimits } from '../domain/continuousResource';

export const continuousReceivedPersistedTextBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_received_persisted_text_v1',
  reference: 'Provérbios 22:21',
  title: 'O texto precisa permanecer fiel antes de ser respondido',
  principle: 'Uma memória local não deve perder silenciosamente o primeiro valor de uma chave nem mudar a medida escrita antes que suas demais barreiras sejam aplicadas.',
  context: 'O provérbio fala de palavras verdadeiras e confiáveis. O Athanor usa essa referência somente como princípio editorial para inspecionar o texto bruto guardado antes do JSON.parse, sem declarar verdade espiritual, autoria ou autenticidade dos dados.',
  themes: ['texto', 'fidelidade', 'memória', 'medida', 'prudência'],
  application: 'Inspecionar tamanho, chaves decodificadas únicas e lexemas numéricos do envelope persistido antes de qualquer interpretação JSON.',
  provenance: [{
    id: 'prov-continuous-received-persisted-text-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; o scanner de texto bruto, a ordem das barreiras e as mensagens de recusa são estruturas autorais da Tehkné Solutions.',
    sourceLabel: 'Provérbios 22:21'
  }]
};

export const continuousReceivedPersistedTextPolicy = {
  id: 'continuous-received-persisted-text-policy',
  version: '1.0.0',
  policy: 'inspect-persisted-json-text-before-parse-v1',
  order: [
    'utf8-bytes',
    'text-characters',
    'unique-decoded-object-keys',
    'exact-numeric-lexemes',
    'json-parse',
    'inert-json',
    'structural-budget',
    'visible-unicode-text',
    'persist-envelope',
    'received-hydration'
  ],
  maxUtf8Bytes: defaultContinuousResourceLimits.maxFileBytes,
  maxTextCharacters: defaultContinuousResourceLimits.maxTextCharacters,
  recordsRefusal: false,
  repairsAutomatically: false,
  rewritesText: false,
  choosesDuplicateValue: false,
  roundsNumbers: false
} as const;

export const continuousReceivedPersistedTextRestrictions = [
  'A inspeção ocorre antes do JSON.parse tanto na hidratação inicial quanto na releitura explícita',
  'Chaves repetidas são comparadas depois da decodificação dos escapes JSON',
  'Nenhum primeiro ou último valor repetido é escolhido',
  'Inteiros inseguros, overflow, underflow, zero negativo e arredondamento silencioso são recusados',
  'O texto persistido não é normalizado, reordenado, reparado ou reserializado para ser aceito',
  'Uma recusa preserva exatamente os bytes existentes na IndexedDB',
  'A biblioteca inicial da sessão permanece separada da memória recusada',
  'A inspeção não comprova identidade, autoria, origem, verdade ou autenticidade criptográfica',
  'Nenhuma recusa, diagnóstico ou cópia corrigida é persistida',
  'Nenhuma ação interrompida é repetida automaticamente depois da recusa'
] as const;
