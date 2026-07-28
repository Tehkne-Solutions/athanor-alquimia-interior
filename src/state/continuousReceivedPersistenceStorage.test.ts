import { describe, expect, it, vi } from 'vitest';
import type { StateStorage } from 'zustand/middleware';
import { createContinuousReceivedRegistry } from '../domain/continuousReceive';
import {
  CONTINUOUS_RECEIVED_PERSIST_VERSION,
  CONTINUOUS_RECEIVED_SCHEMA_VERSION,
  CONTINUOUS_RECEIVED_STORAGE_KEY,
  continuousReceivedHydrationOnlyStorage,
  serializeContinuousReceivedPersistedState,
  writeContinuousReceivedPersistedRegistry,
  writeContinuousReceivedPersistedRegistryIfUnchanged
} from './continuousReceivedPersistenceStorage';

const t0 = '2026-07-28T20:00:00.000Z';

describe('storage explícito da biblioteca recebida', () => {
  it('serializa o mesmo envelope conhecido pelo persist middleware', () => {
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    expect(JSON.parse(serializeContinuousReceivedPersistedState(registry))).toEqual({
      state: {
        schemaVersion: CONTINUOUS_RECEIVED_SCHEMA_VERSION,
        registry
      },
      version: CONTINUOUS_RECEIVED_PERSIST_VERSION
    });
  });

  it('grava somente na chave oficial', async () => {
    const setItem = vi.fn(async (_name: string, _value: string): Promise<void> => undefined);
    const storage: StateStorage = {
      getItem: async () => null,
      setItem,
      removeItem: async () => undefined
    };
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    await writeContinuousReceivedPersistedRegistry(registry, storage);
    expect(setItem).toHaveBeenCalledTimes(1);
    const [name, serialized] = setItem.mock.calls[0];
    expect(name).toBe(CONTINUOUS_RECEIVED_STORAGE_KEY);
    expect(JSON.parse(serialized)).toEqual({
      state: { schemaVersion: 1, registry },
      version: 0
    });
  });

  it('envia referência esperada e próximo envelope ao compare-and-set', async () => {
    const compareAndSet = vi.fn(async () => ({ status: 'written' as const }));
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    const result = await writeContinuousReceivedPersistedRegistryIfUnchanged(
      registry,
      'envelope-anterior',
      compareAndSet
    );
    expect(result.status).toBe('confirmed');
    expect(compareAndSet).toHaveBeenCalledTimes(1);
    const [name, expectedValue, nextValue] = compareAndSet.mock.calls[0];
    expect(name).toBe(CONTINUOUS_RECEIVED_STORAGE_KEY);
    expect(expectedValue).toBe('envelope-anterior');
    expect(JSON.parse(nextValue)).toEqual({
      state: { schemaVersion: 1, registry },
      version: 0
    });
    if (result.status === 'confirmed') expect(result.persistedValue).toBe(nextValue);
  });

  it('aceita referência nula para a primeira escrita após memória vazia', async () => {
    const compareAndSet = vi.fn(async () => ({ status: 'written' as const }));
    await writeContinuousReceivedPersistedRegistryIfUnchanged(
      createContinuousReceivedRegistry('1.0.0', t0),
      null,
      compareAndSet
    );
    expect(compareAndSet.mock.calls[0][1]).toBeNull();
  });

  it('propaga conflito sem produzir envelope confirmado', async () => {
    const compareAndSet = vi.fn(async () => ({ status: 'conflict' as const }));
    const result = await writeContinuousReceivedPersistedRegistryIfUnchanged(
      createContinuousReceivedRegistry('1.0.0', t0),
      'estado-antigo',
      compareAndSet
    );
    expect(result).toEqual({ status: 'conflict' });
  });

  it('propaga falha de escrita ao chamador', async () => {
    const storage: StateStorage = {
      getItem: async () => null,
      setItem: async () => { throw new Error('Falha de quota'); },
      removeItem: async () => undefined
    };
    await expect(writeContinuousReceivedPersistedRegistry(
      createContinuousReceivedRegistry('1.0.0', t0),
      storage
    )).rejects.toThrow(/quota/i);
  });

  it('mantém a escrita automática do middleware como no-op', async () => {
    await expect(continuousReceivedHydrationOnlyStorage.setItem('qualquer', 'valor')).resolves.toBeUndefined();
  });
});
