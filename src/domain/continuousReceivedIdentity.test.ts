import { describe, expect, it } from 'vitest';
import type { ContinuousCollection } from './continuousCollection';
import {
  allocateContinuousReceivedRecordId,
  archiveReceivedCollection,
  archiveReceivedCollectionWithIdentity,
  createContinuousReceivedRegistry,
  findReceivedAllById,
  findReceivedCollection,
  keepReceivedCollection,
  keepReceivedCollectionWithIdentity,
  reactivateReceivedCollectionWithIdentity,
  removeReceivedCollection,
  removeReceivedCollectionWithIdentity,
  type ContinuousReceivedCollection,
  type ContinuousReceivedRegistry
} from './continuousReceive';
import {
  createContinuousCollectionShareExport,
  type ContinuousCollectionShareExport,
  type ContinuousShareConsent
} from './continuousShare';

const createdAt = '2026-07-28T15:00:00.000Z';
const receivedAt = '2026-07-28T15:10:00.000Z';
const updatedAt = '2026-07-28T15:20:00.000Z';

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
    items: [],
    createdAt,
    updatedAt: createdAt
  };
}

function packageValue(label: string, generatedAt = createdAt): ContinuousCollectionShareExport {
  const result = createContinuousCollectionShareExport(
    collection(label),
    consent,
    { includeDates: false },
    '1.0.0',
    generatedAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function registry(): ContinuousReceivedRegistry {
  return createContinuousReceivedRegistry('1.0.0', createdAt);
}

function legacyRecord(id: string, label: string): ContinuousReceivedCollection {
  const kept = keepReceivedCollectionWithIdentity(
    registry(),
    { id, package: packageValue(label) },
    receivedAt
  );
  if (!kept.record) throw new Error(kept.message);
  return kept.record;
}

function legacyRegistry(records: ContinuousReceivedCollection[]): ContinuousReceivedRegistry {
  return { ...registry(), records, updatedAt: receivedAt };
}

describe('identidade local da biblioteca recebida', () => {
  it('preserva exatamente um identificador livre', () => {
    expect(allocateContinuousReceivedRecordId(registry(), 'received-local')).toBe('received-local');
  });

  it('aloca o primeiro sufixo disponível', () => {
    const first = keepReceivedCollection(registry(), { id: 'received-local', package: packageValue('Primeira') }, receivedAt);
    expect(allocateContinuousReceivedRecordId(first, 'received-local')).toBe('received-local--2');
    const second = keepReceivedCollection(first, { id: 'received-local', package: packageValue('Segunda') }, receivedAt);
    expect(allocateContinuousReceivedRecordId(second, 'received-local')).toBe('received-local--3');
  });

  it('reconhece cópia equivalente antes de alocar outro identificador', () => {
    const first = keepReceivedCollectionWithIdentity(
      registry(),
      { id: 'received-a', package: packageValue('Equivalente') },
      receivedAt
    );
    const second = keepReceivedCollectionWithIdentity(
      first.registry,
      { id: 'received-b', package: packageValue('Equivalente', updatedAt) },
      updatedAt
    );
    expect(second.status).toBe('equivalent');
    expect(second.storedId).toBe('received-a');
    expect(second.registry.records).toHaveLength(1);
  });

  it('preserva pacote distinto e informa a desambiguação', () => {
    const first = keepReceivedCollectionWithIdentity(
      registry(),
      { id: 'received-local', package: packageValue('Primeira') },
      receivedAt
    );
    const second = keepReceivedCollectionWithIdentity(
      first.registry,
      { id: 'received-local', package: packageValue('Segunda') },
      updatedAt
    );
    expect(second.status).toBe('disambiguated');
    expect(second.requestedId).toBe('received-local');
    expect(second.storedId).toBe('received-local--2');
    expect(second.registry.records.map((record) => record.id)).toEqual(['received-local', 'received-local--2']);
    expect(second.registry.records.map((record) => record.package.collection.label)).toEqual(['Primeira', 'Segunda']);
  });

  it('mantém o wrapper legado seguro e preserva as duas cópias', () => {
    const first = keepReceivedCollection(registry(), { id: 'received-local', package: packageValue('Primeira') }, receivedAt);
    const second = keepReceivedCollection(first, { id: 'received-local', package: packageValue('Segunda') }, updatedAt);
    expect(second.records).toHaveLength(2);
    expect(findReceivedCollection(second, 'received-local')?.package.collection.label).toBe('Primeira');
    expect(findReceivedCollection(second, 'received-local--2')?.package.collection.label).toBe('Segunda');
  });

  it('diferencia ausência de ambiguidade legada', () => {
    const first = legacyRecord('legacy-shared', 'Primeira');
    const second = { ...legacyRecord('legacy-other', 'Segunda'), id: 'legacy-shared' };
    const legacy = legacyRegistry([first, second]);
    expect(findReceivedAllById(legacy, 'legacy-shared')).toHaveLength(2);
    expect(findReceivedCollection(legacy, 'legacy-shared')).toBeUndefined();
    expect(archiveReceivedCollectionWithIdentity(legacy, 'missing', updatedAt).status).toBe('missing');
    expect(archiveReceivedCollectionWithIdentity(legacy, 'legacy-shared', updatedAt).status).toBe('ambiguous');
  });

  it('não arquiva nenhuma cópia quando o ID legado é ambíguo', () => {
    const first = legacyRecord('legacy-shared', 'Primeira');
    const second = { ...legacyRecord('legacy-other', 'Segunda'), id: 'legacy-shared' };
    const legacy = legacyRegistry([first, second]);
    const result = archiveReceivedCollectionWithIdentity(legacy, 'legacy-shared', updatedAt);
    expect(result.status).toBe('ambiguous');
    expect(result.matchedRecords).toBe(2);
    expect(result.registry).toBe(legacy);
    expect(archiveReceivedCollection(legacy, 'legacy-shared', updatedAt)).toBe(legacy);
    expect(legacy.records.every((record) => record.status === 'active')).toBe(true);
  });

  it('não remove nenhuma cópia quando o ID legado é ambíguo', () => {
    const first = legacyRecord('legacy-shared', 'Primeira');
    const second = { ...legacyRecord('legacy-other', 'Segunda'), id: 'legacy-shared' };
    const legacy = legacyRegistry([first, second]);
    const result = removeReceivedCollectionWithIdentity(legacy, 'legacy-shared', updatedAt);
    expect(result.status).toBe('ambiguous');
    expect(result.registry.records).toHaveLength(2);
    expect(removeReceivedCollection(legacy, 'legacy-shared', updatedAt)).toBe(legacy);
  });

  it('arquiva, reativa e remove somente a ocorrência única', () => {
    const kept = keepReceivedCollectionWithIdentity(
      registry(),
      { id: 'received-local', package: packageValue('Única') },
      receivedAt
    );
    const archived = archiveReceivedCollectionWithIdentity(kept.registry, 'received-local', updatedAt);
    expect(archived.status).toBe('updated');
    expect(archived.registry.records[0].status).toBe('archived');

    const unchanged = archiveReceivedCollectionWithIdentity(archived.registry, 'received-local', updatedAt);
    expect(unchanged.status).toBe('unchanged');

    const reactivated = reactivateReceivedCollectionWithIdentity(archived.registry, 'received-local', updatedAt);
    expect(reactivated.status).toBe('updated');
    expect(reactivated.registry.records[0].status).toBe('active');

    const removed = removeReceivedCollectionWithIdentity(reactivated.registry, 'received-local', updatedAt);
    expect(removed.status).toBe('updated');
    expect(removed.registry.records).toEqual([]);
  });

  it('recusa entradas sem identificador ou instante sem alterar o registro', () => {
    const missingId = keepReceivedCollectionWithIdentity(registry(), { id: '', package: packageValue('Inválida') }, receivedAt);
    expect(missingId.status).toBe('invalid');
    expect(missingId.registry.records).toEqual([]);

    const missingTime = keepReceivedCollectionWithIdentity(registry(), { id: 'received-local', package: packageValue('Inválida') }, '');
    expect(missingTime.status).toBe('invalid');
    expect(missingTime.registry.records).toEqual([]);
  });
});
