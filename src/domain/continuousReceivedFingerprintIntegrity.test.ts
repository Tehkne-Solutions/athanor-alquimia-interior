import { describe, expect, it } from 'vitest';
import { canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import { attachContinuousConsistency } from './continuousConsistency';
import {
  archiveReceivedCollectionWithIdentity,
  createContinuousReceivedRegistry,
  keepReceivedCollectionWithIdentity,
  reactivateReceivedCollectionWithIdentity,
  removeReceivedCollectionWithIdentity,
  type ContinuousReceivedRegistry
} from './continuousReceive';
import { validateContinuousReceivedFingerprintIntegrity } from './continuousReceivedFingerprintIntegrity';
import type { ContinuousCollectionShareExport } from './continuousShare';

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

function registryWithOne(): ContinuousReceivedRegistry {
  const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
  const result = keepReceivedCollectionWithIdentity(
    registry,
    { id: 'received-local', package: packageValue() },
    receivedAt
  );
  if (result.status !== 'kept') throw new Error(`Fixture inesperado: ${result.status}`);
  return result.registry;
}

describe('integridade da impressão armazenada', () => {
  it('aceita biblioteca vazia', () => {
    const result = validateContinuousReceivedFingerprintIntegrity(
      createContinuousReceivedRegistry('1.0.0', createdAt)
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.checkedRecords).toBe(0);
  });

  it('aceita impressão produzida pela própria inserção', () => {
    const result = validateContinuousReceivedFingerprintIntegrity(registryWithOne());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.checkedRecords).toBe(1);
  });

  it('recusa impressão fora do formato canônico', () => {
    const registry = registryWithOne();
    registry.records[0].fingerprint = 'RECEIVED-INVALID';
    const result = validateContinuousReceivedFingerprintIntegrity(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/formato received-xxxxxxxx/i);
  });

  it('recusa impressão persistida diferente da medida recalculada', () => {
    const registry = registryWithOne();
    registry.records[0].fingerprint = 'received-00000000';
    const result = validateContinuousReceivedFingerprintIntegrity(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não corresponde ao pacote/i);
  });

  it('detecta mudança direta no conteúdo coberto pela impressão', () => {
    const registry = registryWithOne();
    registry.records[0].package.collection.label = 'Coleção alterada diretamente';
    expect(validateContinuousReceivedFingerprintIntegrity(registry).ok).toBe(false);
  });

  it('recusa pacote que não pode ser medido deterministicamente', () => {
    const registry = registryWithOne();
    const cyclic = registry.records[0].package as ContinuousCollectionShareExport & { cycle?: unknown };
    cyclic.cycle = cyclic;
    const result = validateContinuousReceivedFingerprintIntegrity(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não pôde ser medido/i);
  });

  it('não amplia silenciosamente o escopo histórico da impressão', () => {
    const registry = registryWithOne();
    registry.records[0].package.generatedAt = '2026-07-28T16:00:00.000Z';
    registry.records[0].package.notices = [...registry.records[0].package.notices, 'Aviso fora do escopo histórico.'];
    if (registry.records[0].package.consistency) {
      registry.records[0].package.consistency.checksum = 'fnv1a32-ffffffff';
    }
    expect(validateContinuousReceivedFingerprintIntegrity(registry).ok).toBe(true);
  });

  it('bloqueia nova deduplicação quando a biblioteca está divergente', () => {
    const registry = registryWithOne();
    registry.records[0].package.collection.label = 'Alterada';
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-second', package: packageValue() },
      '2026-07-28T20:00:00.000Z'
    );
    expect(result.status).toBe('invalid');
    expect(result.registry).toBe(registry);
  });

  it('bloqueia arquivamento, reativação e remoção sem reparar a impressão', () => {
    const registry = registryWithOne();
    registry.records[0].fingerprint = 'received-00000000';

    const archived = archiveReceivedCollectionWithIdentity(
      registry,
      'received-local',
      '2026-07-28T20:00:00.000Z'
    );
    const reactivated = reactivateReceivedCollectionWithIdentity(
      registry,
      'received-local',
      '2026-07-28T20:00:00.000Z'
    );
    const removed = removeReceivedCollectionWithIdentity(
      registry,
      'received-local',
      '2026-07-28T20:00:00.000Z'
    );

    expect(archived.status).toBe('invalid');
    expect(reactivated.status).toBe('invalid');
    expect(removed.status).toBe('invalid');
    expect(archived.registry).toBe(registry);
    expect(reactivated.registry).toBe(registry);
    expect(removed.registry).toBe(registry);
    expect(registry.records[0].fingerprint).toBe('received-00000000');
  });

  it('mantém deduplicação válida quando impressão e pacote correspondem', () => {
    const registry = registryWithOne();
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-second', package: packageValue() },
      '2026-07-28T20:00:00.000Z'
    );
    expect(result.status).toBe('equivalent');
    expect(result.registry).toBe(registry);
  });
});
