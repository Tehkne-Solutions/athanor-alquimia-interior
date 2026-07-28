import { describe, expect, it, vi } from 'vitest';
import { canonicalShareNotices } from '../domain/continuousCanonicalNotice.testFixtures';
import { attachContinuousConsistency } from '../domain/continuousConsistency';
import {
  createContinuousReceivedRegistry,
  fingerprintContinuousSharePackage,
  keepReceivedCollectionWithIdentity,
  type ContinuousReceivedRegistry
} from '../domain/continuousReceive';
import type { ContinuousCollectionShareExport } from '../domain/continuousShare';
import { hydrateContinuousReceivedPersistedState } from './continuousReceivedHydration';

const createdAt = '2026-07-28T18:00:00.000Z';
const receivedAt = '2026-07-28T19:00:00.000Z';

function packageValue(): ContinuousCollectionShareExport {
  return attachContinuousConsistency({
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion: '1.0.0',
    generatedAt: '2026-07-28T17:00:00.000Z',
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
    notices: canonicalShareNotices(false, 0)
  });
}

function emptyRegistry(): ContinuousReceivedRegistry {
  return createContinuousReceivedRegistry('1.0.0', createdAt);
}

function registryWithOne(): ContinuousReceivedRegistry {
  const result = keepReceivedCollectionWithIdentity(
    emptyRegistry(),
    { id: 'received-local', package: packageValue() },
    receivedAt
  );
  if (result.status !== 'kept') throw new Error(result.message);
  return result.registry;
}

function envelope(registry = registryWithOne()) {
  return { schemaVersion: 1, registry };
}

describe('hidratação da biblioteca recebida', () => {
  it('mantém a biblioteca inicial quando não existe memória persistida', () => {
    const fallback = emptyRegistry();
    const result = hydrateContinuousReceivedPersistedState(undefined, fallback);
    expect(result.status).toBe('empty');
    expect(result.registry).toBe(fallback);
    expect(result.issues).toEqual([]);
  });

  it('aceita envelope atual e cria snapshot defensivo', () => {
    const persisted = envelope();
    const fallback = emptyRegistry();
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('accepted');
    expect(result.registry).not.toBe(persisted.registry);
    expect(result.registry.records[0]).not.toBe(persisted.registry.records[0]);
    expect(result.registry.records[0].package).not.toBe(persisted.registry.records[0].package);
    persisted.registry.records[0].package.collection.label = 'Alterado depois';
    expect(result.registry.records[0].package.collection.label).toBe('Coleção aberta');
  });

  it('recusa schemaVersion futuro sem migrar', () => {
    const fallback = emptyRegistry();
    const result = hydrateContinuousReceivedPersistedState({
      ...envelope(),
      schemaVersion: 2
    }, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.message).toMatch(/schemaVersion|literal/i);
  });

  it('recusa campo adicional no envelope', () => {
    const fallback = emptyRegistry();
    const result = hydrateContinuousReceivedPersistedState({
      ...envelope(),
      diagnostic: true
    }, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.join(' ')).toMatch(/unrecognized|diagnostic/i);
  });

  it('recusa getter sem executá-lo', () => {
    const fallback = emptyRegistry();
    const getter = vi.fn(() => registryWithOne());
    const persisted: Record<string, unknown> = { schemaVersion: 1 };
    Object.defineProperty(persisted, 'registry', { enumerable: true, get: getter });
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('rejected');
    expect(getter).not.toHaveBeenCalled();
    expect(result.message).toMatch(/getter|setter/i);
  });

  it('recusa campo adicional dentro do pacote', () => {
    const fallback = emptyRegistry();
    const persisted = envelope() as unknown as {
      schemaVersion: number;
      registry: ContinuousReceivedRegistry & { records: Array<ContinuousReceivedRegistry['records'][number] & { package: ContinuousCollectionShareExport & { extra?: boolean } }> };
    };
    persisted.registry.records[0].package.extra = true;
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.join(' ')).toMatch(/unrecognized|extra/i);
  });

  it('recusa pacote editorialmente alterado mesmo com selo e impressão recalculados', () => {
    const fallback = emptyRegistry();
    const persisted = envelope();
    const current = persisted.registry.records[0].package;
    const altered = attachContinuousConsistency({
      ...current,
      notices: [...current.notices.slice(0, -1), 'Aviso inventado.'],
      consistency: undefined
    });
    persisted.registry.records[0].package = altered;
    persisted.registry.records[0].fingerprint = fingerprintContinuousSharePackage(altered);
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.join(' ')).toMatch(/aviso|catálogo/i);
  });

  it('recusa impressão persistida divergente', () => {
    const fallback = emptyRegistry();
    const persisted = envelope();
    persisted.registry.records[0].fingerprint = 'received-00000000';
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.join(' ')).toMatch(/impressão/i);
  });

  it('recusa biblioteca de outro catálogo', () => {
    const fallback = emptyRegistry();
    const persisted = envelope();
    persisted.registry.catalogVersion = '2.0.0';
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.join(' ')).toMatch(/catálogo|versão|reconhece/i);
  });

  it('recusa cronologia regressiva', () => {
    const fallback = emptyRegistry();
    const persisted = envelope();
    persisted.registry.updatedAt = createdAt;
    const result = hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.join(' ')).toMatch(/updatedAt|cronologia|anterior/i);
  });

  it('recusa envelope sem os dados mínimos da biblioteca', () => {
    const fallback = emptyRegistry();
    const result = hydrateContinuousReceivedPersistedState({
      schemaVersion: 1,
      registry: { id: 'continuous_received_registry_v1' }
    }, fallback);
    expect(result.status).toBe('rejected');
    expect(result.registry).toBe(fallback);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('não altera a memória persistida durante uma recusa', () => {
    const fallback = emptyRegistry();
    const persisted = envelope();
    persisted.registry.records[0].fingerprint = 'received-00000000';
    const before = JSON.stringify(persisted);
    hydrateContinuousReceivedPersistedState(persisted, fallback);
    expect(JSON.stringify(persisted)).toBe(before);
  });
});
