import type { BiblicalUnit } from '../domain/types';

export const continuousReceivedSnapshotBiblicalUnit: BiblicalUnit = {
  id: 'proverb_continuous_received_snapshot_v1',
  reference: 'Provérbios 22:28',
  title: 'A cópia local preserva seu próprio limite',
  principle: 'O que foi guardado localmente não continua preso ao objeto que o originou nem entrega sua própria referência para alteração indireta.',
  context: 'A imagem do limite antigo orienta somente a separação técnica entre entrada, snapshot armazenado e leitura devolvida.',
  themes: ['limite', 'cópia', 'separação', 'memória local', 'integridade'],
  application: 'Criar snapshots defensivos completos na entrada, nas consultas, nos resultados e nas novas versões da biblioteca recebida.',
  provenance: [{
    id: 'prov-received-snapshot-bib-v1',
    label: 'Fonte bíblica',
    class: 'BIB',
    explanation: 'A referência inicia a reflexão; clonagem defensiva, snapshots e regras de referência são estruturas autorais do Athanor.',
    sourceLabel: 'Provérbios 22:28'
  }]
};

export const continuousReceivedSnapshotPolicy = {
  id: 'continuous-received-snapshot-policy',
  version: '1.0.0',
  policy: 'detached-defensive-received-snapshots-v1',
  cloneInputPackage: true,
  cloneConsistencySeal: true,
  cloneQueryResults: true,
  cloneReturnedRecord: true,
  clonePreviousRecordsOnSuccess: true,
  preserveOriginalOnFailure: true,
  deepFreeze: false,
  serializeRoundTrip: false
} as const;

export const continuousReceivedSnapshotRestrictions = [
  'O pacote guardado não compartilha proveniência, coleção, opções, itens, resumos, avisos ou selo com a entrada',
  'O registro devolvido pela inserção não é a mesma referência guardada na biblioteca',
  'Consultas públicas devolvem snapshots e não referências internas da biblioteca',
  'Uma cópia equivalente devolvida também é um snapshot defensivo',
  'Uma nova versão bem-sucedida da biblioteca não compartilha registros mutáveis com a versão anterior',
  'Arquivamento e reativação preservam pacotes desvinculados',
  'Remoção cria uma nova lista com snapshots das cópias restantes',
  'Falhas, ambiguidades, ausência, estado obsoleto e operação sem mudança preservam exatamente a biblioteca original',
  'Nenhum snapshot é produzido por serialização JSON que poderia apagar campos opcionais silenciosamente',
  'Nenhum objeto é congelado em runtime e nenhuma exceção de mutação é usada como regra de domínio',
  'A desvinculação não modifica checksum, impressão, conteúdo ou equivalência canônica',
  'Nenhum histórico de mutações, analytics, telemetria ou sincronização é criado',
  'Snapshot defensivo não comprova autoria, identidade, origem ou autenticidade'
];
