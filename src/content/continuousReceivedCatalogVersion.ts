import type { ProvenanceEntry } from '../domain/types';
import { continuousVersionCatalog } from './continuousVersion';

export const continuousReceivedCatalogVersionBiblicalUnit = {
  id: 'amos_continuous_received_catalog_version_v1',
  reference: 'Amós 3:3',
  title: 'Uma biblioteca e seus registros precisam caminhar no mesmo catálogo',
  principle: 'Uma versão declarada só orienta decisões quando todas as cópias guardadas pertencem ao mesmo contrato conhecido.',
  context: 'A biblioteca recebida possui identidade e versão próprias. Misturar pacotes de outro catálogo sob o mesmo registro tornaria deduplicação e mutações dependentes de contratos diferentes sem aviso.',
  themes: ['acordo', 'versão', 'biblioteca', 'coerência', 'limite'],
  application: 'Conferir a identidade fixa da biblioteca, sua versão atual e a correspondência exata da versão de cada pacote antes de qualquer inserção ou mutação.',
  provenance: [{
    id: 'bib-continuous-received-catalog-version',
    label: 'Caminhar de acordo',
    class: 'BIB',
    explanation: 'Amós 3:3 inicia a reflexão sobre acordo; SemVer, identidade local e bloqueio de catálogos mistos são estruturas autorais do Athanor.',
    sourceLabel: 'Amós 3:3'
  }] satisfies ProvenanceEntry[]
} as const;

export const continuousReceivedCatalogVersionPolicy = {
  id: 'continuous-received-catalog-version-policy',
  version: '1.0.0',
  policy: 'registry-catalog-version-matches-all-packages-v1',
  expectedRegistryId: 'continuous_received_registry_v1',
  currentCatalogVersion: continuousVersionCatalog.shareCurrentVersion,
  strictSemver: true,
  allowMixedCatalogs: false,
  allowSilentMigration: false,
  validateBeforeDeduplication: true,
  validateBeforeMutation: true,
  maxReportedIssues: 20
} as const;

export const continuousReceivedCatalogVersionRestrictions = [
  'A biblioteca precisa usar a identidade fixa continuous_received_registry_v1.',
  'A versão da biblioteca precisa usar SemVer estrito X.Y.Z.',
  'A versão da biblioteca precisa coincidir com o catálogo atual reconhecido.',
  'Cada pacote guardado precisa declarar a mesma versão da biblioteca.',
  'Um pacote de outra versão não pode ser inserido na biblioteca atual.',
  'Catálogos atuais e legados não são misturados na mesma biblioteca.',
  'Uma versão futura não é rebaixada para a versão atual.',
  'Uma versão antiga não é promovida sem migração explícita e testada.',
  'A identidade da biblioteca não é corrigida automaticamente.',
  'A versão da biblioteca ou do pacote não é substituída automaticamente.',
  'Uma divergência bloqueia deduplicação, arquivamento, reativação e remoção.',
  'Uma falha preserva exatamente a instância original da biblioteca.',
  'Coerência de versão não comprova identidade, autoria, origem ou autenticidade.'
] as const;
