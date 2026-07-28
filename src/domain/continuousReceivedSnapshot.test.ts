import { describe, expect, it } from 'vitest';
import type { ContinuousCollection } from './continuousCollection';
import {
  archiveReceivedCollectionWithIdentity,
  createContinuousReceivedRegistry,
  findEquivalentReceivedCollection,
  findReceivedAllByFingerprint,
  findReceivedCollection,
  keepReceivedCollectionWithIdentity,
  removeReceivedCollectionWithIdentity
} from './continuousReceive';
import {
  cloneContinuousReceivedPackage,
  cloneContinuousReceivedRecord,
  cloneContinuousReceivedRegistry
} from './continuousReceivedSnapshot';
import {
  createContinuousCollectionShareExport,
  type ContinuousCollectionShareExport,
  type ContinuousShareConsent
} from './continuousShare';

const createdAt = '2026-07-28T17:00:00.000Z';
const firstReceivedAt = '2026-07-28T17:10:00.000Z';
const secondReceivedAt = '2026-07-28T17:20:00.000Z';
const archivedAt = '2026-07-28T17:30:00.000Z';
const removedAt = '2026-07-28T17:40:00.000Z';

const consent: ContinuousShareConsent = {
  collection: true,
  preview: true,
  localFile: true,
  recipient: true,
  noPersonalNotes: true
};

function collection(label: string): ContinuousCollection {
  return {
    id: `private-${label}`,
    templateId: 'collection-open',
    label,
    status: 'active',
    items: [{
      key: `trail:${label}`,
      source: 'local-map',
      addedAt: createdAt,
      item: {
        id: `trail-${label}`,
        kind: 'trail',
        sourceTrailId: `source-${label}`,
        sourceCycleInstanceId: `cycle-${label}`,
        startPoint: 'word',
        noTheme: true,
        variantId: 'word-trail-v1',
        catalogVersion: '1.0.0',
        status: 'active',
        rawStatus: 'active',
        endedEarly: false,
        passageSummary: { completed: 0, passed: 0, pending: 1 },
        occurredAt: createdAt,
        linked: true
      }
    }],
    createdAt,
    updatedAt: createdAt
  };
}

function packageValue(label: string): ContinuousCollectionShareExport {
  const result = createContinuousCollectionShareExport(
    collection(label),
    consent,
    { includeDates: false },
    '1.0.0',
    createdAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function registry() {
  return createContinuousReceivedRegistry('1.0.0', createdAt);
}

function kept(label = 'Primeira', id = 'received-local', at = firstReceivedAt) {
  const result = keepReceivedCollectionWithIdentity(
    registry(),
    { id, package: packageValue(label) },
    at
  );
  if (!result.record) throw new Error(result.message);
  return result;
}

describe('snapshots defensivos da biblioteca recebida', () => {
  it('clona todas as estruturas aninhadas, incluindo o selo', () => {
    const source = packageValue('Completa');
    const clone = cloneContinuousReceivedPackage(source);

    expect(clone).toEqual(source);
    expect(clone).not.toBe(source);
    expect(clone.provenance).not.toBe(source.provenance);
    expect(clone.collection).not.toBe(source.collection);
    expect(clone.options).not.toBe(source.options);
    expect(clone.items).not.toBe(source.items);
    expect(clone.items[0]).not.toBe(source.items[0]);
    expect(clone.items[0].passageSummary).not.toBe(source.items[0].passageSummary);
    expect(clone.notices).not.toBe(source.notices);
    expect(clone.consistency).not.toBe(source.consistency);
  });

  it('desvincula o pacote guardado da entrada original', () => {
    const source = packageValue('Entrada');
    const checksum = source.consistency?.checksum;
    const result = keepReceivedCollectionWithIdentity(
      registry(),
      { id: 'received-source', package: source },
      firstReceivedAt
    );

    source.collection.label = 'Alterada fora da biblioteca';
    source.items[0].passageSummary.pending = 99;
    source.notices[0] = 'Aviso externo alterado.';
    if (source.consistency) source.consistency.checksum = 'fnv1a32-ffffffff';

    const stored = result.registry.records[0];
    expect(stored.package.collection.label).toBe('Entrada');
    expect(stored.package.items[0].passageSummary.pending).toBe(1);
    expect(stored.package.notices[0]).not.toBe('Aviso externo alterado.');
    expect(stored.package.consistency?.checksum).toBe(checksum);
  });

  it('não devolve no resultado a mesma referência guardada', () => {
    const result = kept();
    const stored = result.registry.records[0];
    expect(result.record).not.toBe(stored);
    expect(result.record?.package).not.toBe(stored.package);

    if (!result.record) throw new Error('Registro retornado ausente.');
    result.record.package.collection.label = 'Alteração no retorno';
    result.record.package.items[0].passageSummary.pending = 7;
    expect(stored.package.collection.label).toBe('Primeira');
    expect(stored.package.items[0].passageSummary.pending).toBe(1);
  });

  it('devolve consulta singular como snapshot defensivo', () => {
    const result = kept();
    const found = findReceivedCollection(result.registry, 'received-local');
    if (!found) throw new Error('Consulta singular ausente.');
    found.package.collection.label = 'Alteração na consulta';
    found.package.items[0].passageSummary.pending = 5;

    expect(result.registry.records[0].package.collection.label).toBe('Primeira');
    expect(result.registry.records[0].package.items[0].passageSummary.pending).toBe(1);
  });

  it('devolve consultas plurais como snapshots independentes', () => {
    const result = kept();
    const fingerprint = result.registry.records[0].fingerprint;
    const found = findReceivedAllByFingerprint(result.registry, fingerprint);
    found[0].package.notices[0] = 'Alteração na lista consultada.';

    expect(result.registry.records[0].package.notices[0]).not.toBe('Alteração na lista consultada.');
  });

  it('devolve cópia equivalente sem expor o registro interno', () => {
    const first = kept('Equivalente', 'received-a');
    const equivalent = findEquivalentReceivedCollection(first.registry, packageValue('Equivalente'));
    if (!equivalent) throw new Error('Equivalência ausente.');
    equivalent.package.collection.label = 'Alteração equivalente';

    const second = keepReceivedCollectionWithIdentity(
      first.registry,
      { id: 'received-b', package: packageValue('Equivalente') },
      secondReceivedAt
    );
    expect(second.status).toBe('equivalent');
    expect(second.record).not.toBe(first.registry.records[0]);
    expect(first.registry.records[0].package.collection.label).toBe('Equivalente');
  });

  it('desvincula uma nova versão dos registros da versão anterior', () => {
    const first = kept('Primeira', 'received-one');
    const second = keepReceivedCollectionWithIdentity(
      first.registry,
      { id: 'received-two', package: packageValue('Segunda') },
      secondReceivedAt
    );

    first.registry.records[0].package.collection.label = 'Mutação na versão antiga';
    first.registry.records[0].package.items[0].passageSummary.pending = 12;

    expect(second.registry.records[0].package.collection.label).toBe('Primeira');
    expect(second.registry.records[0].package.items[0].passageSummary.pending).toBe(1);
  });

  it('desvincula todos os registros após arquivamento bem-sucedido', () => {
    const first = kept('Primeira', 'received-one');
    const second = keepReceivedCollectionWithIdentity(
      first.registry,
      { id: 'received-two', package: packageValue('Segunda') },
      secondReceivedAt
    );
    const archived = archiveReceivedCollectionWithIdentity(second.registry, 'received-one', archivedAt);
    expect(archived.status).toBe('updated');

    second.registry.records[0].package.collection.label = 'Alvo antigo alterado';
    second.registry.records[1].package.collection.label = 'Vizinho antigo alterado';

    expect(archived.registry.records[0].package.collection.label).toBe('Primeira');
    expect(archived.registry.records[1].package.collection.label).toBe('Segunda');
  });

  it('desvincula as cópias restantes após remoção', () => {
    const first = kept('Primeira', 'received-one');
    const second = keepReceivedCollectionWithIdentity(
      first.registry,
      { id: 'received-two', package: packageValue('Segunda') },
      secondReceivedAt
    );
    const removed = removeReceivedCollectionWithIdentity(second.registry, 'received-one', removedAt);
    expect(removed.status).toBe('updated');

    second.registry.records[1].package.collection.label = 'Restante antigo alterado';
    expect(removed.registry.records).toHaveLength(1);
    expect(removed.registry.records[0].package.collection.label).toBe('Segunda');
  });

  it('preserva exatamente a biblioteca original em recusa e ausência de mudança', () => {
    const first = kept();
    const stale = archiveReceivedCollectionWithIdentity(first.registry, 'received-local', createdAt);
    expect(stale.status).toBe('stale');
    expect(stale.registry).toBe(first.registry);

    const archived = archiveReceivedCollectionWithIdentity(first.registry, 'received-local', archivedAt);
    const unchanged = archiveReceivedCollectionWithIdentity(archived.registry, 'received-local', archivedAt);
    expect(unchanged.status).toBe('unchanged');
    expect(unchanged.registry).toBe(archived.registry);
  });

  it('clona registros e bibliotecas sem mudar conteúdo, impressão ou checksum', () => {
    const result = kept();
    const record = result.registry.records[0];
    const recordClone = cloneContinuousReceivedRecord(record);
    const registryClone = cloneContinuousReceivedRegistry(result.registry);

    expect(recordClone).toEqual(record);
    expect(recordClone).not.toBe(record);
    expect(registryClone).toEqual(result.registry);
    expect(registryClone).not.toBe(result.registry);
    expect(registryClone.records[0]).not.toBe(result.registry.records[0]);
    expect(recordClone.fingerprint).toBe(record.fingerprint);
    expect(recordClone.package.consistency?.checksum).toBe(record.package.consistency?.checksum);
  });
});
