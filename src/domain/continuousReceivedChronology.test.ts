import { describe, expect, it } from 'vitest';
import type { ContinuousCollection } from './continuousCollection';
import {
  archiveReceivedCollectionWithIdentity,
  createContinuousReceivedRegistry,
  keepReceivedCollectionWithIdentity,
  reactivateReceivedCollectionWithIdentity,
  removeReceivedCollectionWithIdentity,
  validateContinuousReceivedRegistryChronology,
  type ContinuousReceivedRegistry
} from './continuousReceive';
import { createContinuousCollectionShareExport } from './continuousShare';

const t0 = '2026-07-28T10:00:00.000Z';
const t1 = '2026-07-28T11:00:00.000Z';
const t2 = '2026-07-28T12:00:00.000Z';
const t3 = '2026-07-28T13:00:00.000Z';

const consent = {
  collection: true,
  preview: true,
  localFile: true,
  recipient: true,
  noPersonalNotes: true
};

function collection(label = 'Coleção aberta'): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label,
    status: 'active',
    items: [],
    createdAt: t0,
    updatedAt: t0
  };
}

function packageAt(generatedAt = t0, label = 'Coleção aberta') {
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

function keptRegistry(receivedAt = t1): ContinuousReceivedRegistry {
  const registry = createContinuousReceivedRegistry('1.0.0', t0);
  const result = keepReceivedCollectionWithIdentity(
    registry,
    { id: 'received-local', package: packageAt() },
    receivedAt
  );
  if (result.status !== 'kept') throw new Error(result.message);
  return result.registry;
}

describe('cronologia da biblioteca recebida', () => {
  it('cria biblioteca com instante UTC canônico', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    expect(registry.createdAt).toBe(t0);
    expect(registry.updatedAt).toBe(t0);
    expect(validateContinuousReceivedRegistryChronology(registry).ok).toBe(true);
  });

  it('recusa criação com instante não canônico', () => {
    expect(() => createContinuousReceivedRegistry('1.0.0', '2026-07-28 10:00')).toThrow(/UTC canônico/i);
  });

  it('aceita inserção no mesmo instante da criação', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-local', package: packageAt() },
      t0
    );
    expect(result.status).toBe('kept');
    expect(result.registry.updatedAt).toBe(t0);
  });

  it('recusa inserção com instante não canônico', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-local', package: packageAt() },
      '28/07/2026 11:00'
    );
    expect(result.status).toBe('invalid');
    expect(result.registry).toBe(registry);
  });

  it('recusa inserção anterior ao último estado local', () => {
    const registry = keptRegistry(t1);
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-second', package: packageAt(t0, 'Segunda coleção') },
      t0
    );
    expect(result.status).toBe('stale');
    expect(result.registry.records).toHaveLength(1);
  });

  it('não compara o relógio externo do pacote com o recebimento local', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    const result = keepReceivedCollectionWithIdentity(
      registry,
      { id: 'received-future-package', package: packageAt(t3) },
      t1
    );
    expect(result.status).toBe('kept');
    expect(result.record?.package.generatedAt).toBe(t3);
    expect(result.record?.receivedAt).toBe(t1);
  });

  it('arquiva em instante posterior e mantém archivedAt igual a updatedAt', () => {
    const result = archiveReceivedCollectionWithIdentity(keptRegistry(), 'received-local', t2);
    expect(result.status).toBe('updated');
    expect(result.registry.records[0]).toMatchObject({
      status: 'archived',
      archivedAt: t2,
      updatedAt: t2
    });
    expect(validateContinuousReceivedRegistryChronology(result.registry).ok).toBe(true);
  });

  it('recusa arquivamento anterior ao último estado', () => {
    const result = archiveReceivedCollectionWithIdentity(keptRegistry(), 'received-local', t0);
    expect(result.status).toBe('stale');
    expect(result.registry.records[0].status).toBe('active');
  });

  it('reativa em instante posterior e remove archivedAt', () => {
    const archived = archiveReceivedCollectionWithIdentity(keptRegistry(), 'received-local', t2);
    const result = reactivateReceivedCollectionWithIdentity(archived.registry, 'received-local', t3);
    expect(result.status).toBe('updated');
    expect(result.registry.records[0].status).toBe('active');
    expect(result.registry.records[0].archivedAt).toBeUndefined();
    expect(result.registry.records[0].updatedAt).toBe(t3);
  });

  it('recusa remoção anterior ao estado da biblioteca', () => {
    const archived = archiveReceivedCollectionWithIdentity(keptRegistry(), 'received-local', t2);
    const reactivated = reactivateReceivedCollectionWithIdentity(archived.registry, 'received-local', t3);
    const result = removeReceivedCollectionWithIdentity(reactivated.registry, 'received-local', t2);
    expect(result.status).toBe('stale');
    expect(result.registry.records).toHaveLength(1);
  });

  it('permite remoção no mesmo instante do último estado', () => {
    const registry = keptRegistry(t1);
    const result = removeReceivedCollectionWithIdentity(registry, 'received-local', t1);
    expect(result.status).toBe('updated');
    expect(result.registry.records).toEqual([]);
    expect(result.registry.updatedAt).toBe(t1);
  });

  it('detecta updatedAt da biblioteca anterior à criação', () => {
    const registry: ContinuousReceivedRegistry = {
      ...createContinuousReceivedRegistry('1.0.0', t1),
      updatedAt: t0
    };
    const result = validateContinuousReceivedRegistryChronology(registry);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/anterior à própria criação/i);
  });

  it('detecta atualização de cópia anterior ao recebimento', () => {
    const registry = keptRegistry(t1);
    const broken: ContinuousReceivedRegistry = {
      ...registry,
      records: registry.records.map((record) => ({ ...record, updatedAt: t0 }))
    };
    const result = validateContinuousReceivedRegistryChronology(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/atualização anterior ao recebimento/i);
  });

  it('detecta cópia ativa que mantém archivedAt', () => {
    const registry = keptRegistry();
    const broken: ContinuousReceivedRegistry = {
      ...registry,
      records: registry.records.map((record) => ({ ...record, archivedAt: t1 }))
    };
    const result = validateContinuousReceivedRegistryChronology(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/cópia ativa não pode manter/i);
  });

  it('detecta cópia arquivada sem archivedAt', () => {
    const registry = keptRegistry();
    const broken: ContinuousReceivedRegistry = {
      ...registry,
      records: registry.records.map((record) => ({ ...record, status: 'archived' as const }))
    };
    const result = validateContinuousReceivedRegistryChronology(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/cópia arquivada exige/i);
  });

  it('bloqueia mutação sobre biblioteca legada cronologicamente incoerente', () => {
    const registry = keptRegistry();
    const broken: ContinuousReceivedRegistry = {
      ...registry,
      records: registry.records.map((record) => ({ ...record, updatedAt: t0 }))
    };
    const result = archiveReceivedCollectionWithIdentity(broken, 'received-local', t2);
    expect(result.status).toBe('invalid');
    expect(result.registry).toBe(broken);
  });
});
