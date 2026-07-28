import { describe, expect, it } from 'vitest';
import { canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import { attachContinuousConsistency } from './continuousConsistency';
import {
  archiveReceivedCollectionWithIdentity,
  createContinuousReceivedRegistry,
  fingerprintContinuousSharePackage,
  keepReceivedCollectionWithIdentity,
  reactivateReceivedCollectionWithIdentity,
  removeReceivedCollectionWithIdentity,
  type ContinuousReceivedRegistry
} from './continuousReceive';
import {
  validateContinuousIncomingReceivedCatalogVersion,
  validateContinuousReceivedCatalogVersion
} from './continuousReceivedCatalogVersion';
import type { ContinuousCollectionShareExport } from './continuousShare';

const createdAt = '2026-07-28T18:00:00.000Z';
const receivedAt = '2026-07-28T19:00:00.000Z';

function packageValue(catalogVersion = '1.0.0'): ContinuousCollectionShareExport {
  return attachContinuousConsistency({
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion,
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

function mixedRegistry(): ContinuousReceivedRegistry {
  const registry = registryWithOne();
  registry.records[0].package.catalogVersion = '2.0.0';
  registry.records[0].fingerprint = fingerprintContinuousSharePackage(registry.records[0].package);
  return registry;
}

describe('coerência do catálogo da biblioteca recebida', () => {
  it('aceita biblioteca vazia na identidade e versão oficiais', () => {
    const result = validateContinuousReceivedCatalogVersion(
      createContinuousReceivedRegistry('1.0.0', createdAt)
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.checkedRecords).toBe(0);
  });

  it('recusa identidade de biblioteca alterada', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
    (registry as unknown as { id: string }).id = 'continuous_received_registry_v2';
    const result = validateContinuousReceivedCatalogVersion(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/identidade da biblioteca incompatível/i);
  });

  it('recusa versão malformada da biblioteca', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
    registry.catalogVersion = 'latest';
    const result = validateContinuousReceivedCatalogVersion(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/SemVer estrito/i);
  });

  it('recusa versão futura da biblioteca', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
    registry.catalogVersion = '2.0.0';
    const result = validateContinuousReceivedCatalogVersion(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/reconhece 1\.0\.0/i);
  });

  it('recusa pacote com versão malformada dentro da biblioteca', () => {
    const registry = registryWithOne();
    registry.records[0].package.catalogVersion = '1';
    const result = validateContinuousReceivedCatalogVersion(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/versão do pacote não usa SemVer/i);
  });

  it('recusa biblioteca mista mesmo com impressão recalculada', () => {
    const registry = mixedRegistry();
    const result = validateContinuousReceivedCatalogVersion(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/2\.0\.0 não corresponde à versão 1\.0\.0/i);
  });

  it('recusa criar biblioteca em versão malformada ou desconhecida', () => {
    expect(() => createContinuousReceivedRegistry('latest', createdAt)).toThrow(RangeError);
    expect(() => createContinuousReceivedRegistry('2.0.0', createdAt)).toThrow(RangeError);
  });

  it('recusa pacote de outro catálogo antes da inserção', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-future', package: packageValue('2.0.0') },
      receivedAt
    );
    expect(result.status).toBe('invalid');
    expect(result.registry).toBe(registry);
    expect(result.message).toMatch(/não corresponde à versão 1\.0\.0/i);
  });

  it('valida explicitamente um pacote do mesmo catálogo', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
    const result = validateContinuousIncomingReceivedCatalogVersion(registry, packageValue());
    expect(result.ok).toBe(true);
  });

  it('bloqueia inserção, arquivamento, reativação e remoção em biblioteca mista', () => {
    const registry = mixedRegistry();
    const kept = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-second', package: packageValue() },
      '2026-07-28T20:00:00.000Z'
    );
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

    expect(kept.status).toBe('invalid');
    expect(archived.status).toBe('invalid');
    expect(reactivated.status).toBe('invalid');
    expect(removed.status).toBe('invalid');
    expect(kept.registry).toBe(registry);
    expect(archived.registry).toBe(registry);
    expect(reactivated.registry).toBe(registry);
    expect(removed.registry).toBe(registry);
    expect(registry.catalogVersion).toBe('1.0.0');
    expect(registry.records[0].package.catalogVersion).toBe('2.0.0');
  });

  it('mantém inserção e mutação válidas no catálogo atual', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', createdAt);
    const kept = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-local', package: packageValue() },
      receivedAt
    );
    expect(kept.status).toBe('kept');
    const archived = archiveReceivedCollectionWithIdentity(
      kept.registry,
      'received-local',
      '2026-07-28T20:00:00.000Z'
    );
    expect(archived.status).toBe('updated');
    expect(archived.registry.records[0].status).toBe('archived');
  });
});
