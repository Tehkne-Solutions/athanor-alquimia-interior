import type { BiblicalUnit } from '../domain/types';

export const continuousVersionBiblicalUnit: BiblicalUnit = {
  id: 'ecclesiastes_continuous_version_v1',
  reference: 'Eclesiastes 3:1',
  title: 'Cada versão tem seu tempo sem apagar a anterior',
  principle: 'Reconhecer o tempo de um formato não autoriza reinterpretá-lo silenciosamente como se fosse outro.',
  context: 'Eclesiastes reconhece tempos distintos. O Athanor aplica essa imagem ao versionamento: arquivos atuais são aceitos, versões desconhecidas são interrompidas e nenhuma migração é presumida sem regra explícita e testada.',
  themes: ['tempo', 'versão', 'memória', 'limite', 'compatibilidade'],
  application: 'Comparar a versão declarada de cada pacote com uma matriz explícita antes de validar, sanitizar ou guardar seu conteúdo.',
  provenance: [{
    id: 'eccl-continuous-version-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; semver estrito, matriz de compatibilidade e recusa de migração silenciosa são estruturas autorais do Athanor.',
    sourceLabel: 'Eclesiastes 3:1'
  }]
};

export const continuousVersionCatalog = {
  id: 'continuous-version-catalog',
  version: '1.0.0',
  policy: 'explicit-compatibility-no-silent-migration-v1',
  mode: 'strict-semver-explicit-matrix',
  shareCurrentVersion: '1.0.0',
  shareSupportedLegacyVersions: [] as string[],
  responseCurrentVersion: '1.0.0',
  responseSupportedLegacyVersions: [] as string[],
  futureVersionsAccepted: false,
  unknownOlderVersionsAccepted: false,
  silentMigration: false
} as const;

export const continuousVersionRestrictions = [
  'Versões precisam usar SemVer estrito no formato X.Y.Z',
  'A versão atual é aceita somente quando coincide com a matriz oficial',
  'Versões futuras são recusadas sem tentativa de downgrade',
  'Versões antigas desconhecidas são recusadas sem interpretação aproximada',
  'Uma versão legada só pode ser aceita quando estiver listada explicitamente',
  'Aceitar uma versão legada não altera o arquivo original',
  'Nenhuma migração silenciosa é executada',
  'Nenhum campo desconhecido é inventado para completar versões incompatíveis',
  'A compatibilidade é verificada antes da sanitização e da persistência',
  'O selo de consistência não substitui a verificação de versão',
  'Compatibilidade técnica não comprova identidade, autoria ou veracidade',
  'Recusar uma versão não cria histórico, falha pessoal ou perda de progresso'
];
