import type { BiblicalUnit } from '../domain/types';

export const continuousStrictContractBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_strict_contract_v1',
  reference: 'Provérbios 25:11',
  title: 'Cada palavra em seu lugar, sem sobras escondidas',
  principle: 'Um contrato compreensível não precisa aceitar campos que não sabe interpretar nem descartá-los em silêncio.',
  context: 'Provérbios descreve a palavra dita de modo apropriado. O Athanor aplica essa imagem à forma dos pacotes: cada campo precisa pertencer ao contrato conhecido; propriedades extras interrompem a leitura antes de qualquer sanitização.',
  themes: ['clareza', 'contrato', 'limite', 'forma', 'responsabilidade'],
  application: 'Validar recursivamente os nomes permitidos em partilhas e respostas, recusando sobras sem escolher, apagar ou reinterpretar seu conteúdo.',
  provenance: [{
    id: 'prov-continuous-strict-contract-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; os manifestos de campos e a validação estrita são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 25:11'
  }]
};

export const continuousStrictContractCatalog = {
  id: 'continuous-strict-contract-catalog',
  version: '1.0.0',
  policy: 'reject-unknown-fields-before-sanitization-v1',
  mode: 'recursive-schema-manifest',
  unknownFieldsAccepted: false,
  silentStripping: false,
  automaticMigration: false,
  maxReportedUnknownFields: 20
} as const;

export const continuousStrictContractRestrictions = [
  'Campos desconhecidos são recusados antes da sanitização',
  'Nenhuma propriedade extra é apagada silenciosamente',
  'A validação cobre objetos aninhados e itens de listas',
  'Campos opcionais conhecidos continuam permitidos quando ausentes',
  'A ordem dos campos não altera o resultado',
  'O conteúdo do campo desconhecido não é interpretado',
  'No máximo vinte caminhos desconhecidos são exibidos por diagnóstico',
  'Nomes são exibidos com representação ASCII segura',
  'O arquivo original não é alterado ou reescrito',
  'Uma versão nova precisa declarar seu próprio contrato e migração',
  'A recusa não cria histórico, analytics ou telemetria',
  'Contrato estrito não comprova identidade, autoria, intenção ou veracidade'
];
