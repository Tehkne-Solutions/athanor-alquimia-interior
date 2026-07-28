import { describe, expect, it } from 'vitest';
import {
  continuousShareConditionalNotices,
  continuousShareMandatoryNotices
} from '../content/continuousCanonicalNotice';
import {
  createContinuousReceivedRegistry,
  type ContinuousReceivedRegistry
} from '../domain/continuousReceive';
import type { ContinuousCollectionShareExport } from '../domain/continuousShare';
import {
  archiveContinuousReceivedRecordFromStore,
  keepContinuousReceivedPackageFromStore,
  reactivateContinuousReceivedRecordFromStore,
  removeContinuousReceivedRecordFromStore
} from './continuousReceivedStoreAdapter';

const t0 = '2026-07-28T18:00:00.000Z';
const t1 = '2026-07-28T18:01:00.000Z';
const t2 = '2026-07-28T18:02:00.000Z';
const t3 = '2026-07-28T18:03:00.000Z';
const t4 = '2026-07-28T18:04:00.000Z';

function notices(includeUnlinked = false): string[] {
  const value = [
    ...continuousShareMandatoryNotices,
    continuousShareConditionalNotices.datesOmitted,
    continuousShareConditionalNotices.emptyCollection
  ];
  if (includeUnlinked) value.push(continuousShareConditionalNotices.unlinkedRecords);
  return value;
}

function packageValue(
  generatedAt = t0,
  includeUnlinked = false,
  catalogVersion = '1.0.0'
): ContinuousCollectionShareExport {
  return {
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion,
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    collection: {
      templateId: 'collection-open',
      label: 'Coleção aberta',
      status: 'active',
      itemCount: 0
    },
    options: { includeDates: false },
    items: [],
    notices: notices(includeUnlinked)
  };
}

function registry(): ContinuousReceivedRegistry {
  return createContinuousReceivedRegistry('1.0.0', t0);
}

function keptRegistry() {
  const result = keepContinuousReceivedPackageFromStore(registry(), packageValue(), 'copy-local', t1);
  if (result.status !== 'kept') throw new Error(result.message);
  return result.registry;
}

describe('fachada da biblioteca recebida', () => {
  it('delega a primeira inserção e propaga o storedId', () => {
    const initial = registry();
    const result = keepContinuousReceivedPackageFromStore(initial, packageValue(), 'copy-local', t1);
    expect(result.status).toBe('kept');
    expect(result.id).toBe('copy-local');
    expect(result.changed).toBe(true);
    expect(result.registry).not.toBe(initial);
    expect(result.registry.records).toHaveLength(1);
  });

  it('reconhece equivalência canônica sem usar horário ou selo', () => {
    const first = keptRegistry();
    const result = keepContinuousReceivedPackageFromStore(first, packageValue(t2), 'outro-id', t2);
    expect(result.status).toBe('equivalent');
    expect(result.id).toBe('copy-local');
    expect(result.duplicate).toBe(true);
    expect(result.changed).toBe(false);
    expect(result.registry).toBe(first);
  });

  it('preserva duas cópias com a mesma impressão e avisos diferentes', () => {
    const first = keptRegistry();
    const result = keepContinuousReceivedPackageFromStore(
      first,
      packageValue(t2, true),
      'copy-local',
      t2
    );
    expect(result.status).toBe('disambiguated');
    expect(result.id).toBe('copy-local--2');
    expect(result.duplicate).toBe(false);
    expect(result.changed).toBe(true);
    expect(result.registry.records.map((record) => record.id)).toEqual(['copy-local', 'copy-local--2']);
    expect(result.registry.records[0].fingerprint).toBe(result.registry.records[1].fingerprint);
    expect(result.registry.records[0].package.notices).not.toEqual(result.registry.records[1].package.notices);
  });

  it('propaga pacote incompatível como invalid sem gravar', () => {
    const initial = registry();
    const result = keepContinuousReceivedPackageFromStore(initial, packageValue(t1, false, '2.0.0'), 'copy', t1);
    expect(result.status).toBe('invalid');
    expect(result.id).toBeUndefined();
    expect(result.changed).toBe(false);
    expect(result.registry).toBe(initial);
  });

  it('propaga recebimento regressivo como stale sem gravar', () => {
    const first = keptRegistry();
    const result = keepContinuousReceivedPackageFromStore(first, packageValue(t2, true), 'copy-2', t0);
    expect(result.status).toBe('stale');
    expect(result.changed).toBe(false);
    expect(result.registry).toBe(first);
  });

  it('arquiva somente quando o domínio retorna updated', () => {
    const first = keptRegistry();
    const result = archiveContinuousReceivedRecordFromStore(first, 'copy-local', t2);
    expect(result.status).toBe('updated');
    expect(result.changed).toBe(true);
    expect(result.registry.records[0].status).toBe('archived');
  });

  it('não grava novamente quando o estado já foi solicitado', () => {
    const archived = archiveContinuousReceivedRecordFromStore(keptRegistry(), 'copy-local', t2).registry;
    const result = archiveContinuousReceivedRecordFromStore(archived, 'copy-local', t3);
    expect(result.status).toBe('unchanged');
    expect(result.changed).toBe(false);
    expect(result.registry).toBe(archived);
  });

  it('propaga missing sem anunciar alteração', () => {
    const first = keptRegistry();
    const result = removeContinuousReceivedRecordFromStore(first, 'ausente', t2);
    expect(result.status).toBe('missing');
    expect(result.matchedRecords).toBe(0);
    expect(result.changed).toBe(false);
    expect(result.registry).toBe(first);
  });

  it('propaga ambiguous e preserva a biblioteca legada', () => {
    const first = keptRegistry();
    const duplicate = {
      ...first,
      records: [first.records[0], { ...first.records[0] }]
    };
    const result = archiveContinuousReceivedRecordFromStore(duplicate, 'copy-local', t2);
    expect(result.status).toBe('ambiguous');
    expect(result.matchedRecords).toBe(2);
    expect(result.changed).toBe(false);
    expect(result.registry).toBe(duplicate);
  });

  it('reativa e remove por meio das APIs explícitas', () => {
    const archived = archiveContinuousReceivedRecordFromStore(keptRegistry(), 'copy-local', t2).registry;
    const reactivated = reactivateContinuousReceivedRecordFromStore(archived, 'copy-local', t3);
    expect(reactivated.status).toBe('updated');
    expect(reactivated.registry.records[0].status).toBe('active');

    const removed = removeContinuousReceivedRecordFromStore(reactivated.registry, 'copy-local', t4);
    expect(removed.status).toBe('updated');
    expect(removed.registry.records).toHaveLength(0);
  });

  it('mantém a mensagem do domínio em recusas de integridade', () => {
    const first = keptRegistry();
    const invalid = { ...first, catalogVersion: '2.0.0' };
    const result = removeContinuousReceivedRecordFromStore(invalid, 'copy-local', t2);
    expect(result.status).toBe('invalid');
    expect(result.message).toMatch(/catálogo|versão/i);
    expect(result.registry).toBe(invalid);
  });
});
