import { describe, expect, it, vi } from 'vitest';
import type { StateStorage } from 'zustand/middleware';
import { createContinuousReceivedRegistry } from '../domain/continuousReceive';
import {
  CONTINUOUS_RECEIVED_PERSIST_VERSION,
  CONTINUOUS_RECEIVED_SCHEMA_VERSION,
  CONTINUOUS_RECEIVED_STORAGE_KEY,
  continuousReceivedHydrationOnlyStorage,
  serializeContinuousReceivedPersistedState,
  writeContinuousReceivedPersistedRegistry
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
    const setItem = vi.fn(async () => undefined);
    const storage: StateStorage = {
      getItem: async () => null,
      setItem,
      removeItem: async () => undefined
    };
    const registry = createContinuousReceivedRegistry('1.0.0', t0);
    await writeContinuousReceivedPersistedRegistry(registry, storage);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem.mock.calls[0][0]).toBe(CONTINUOUS_RECEIVED_STORAGE_KEY);
    expect(JSON.parse(setItem.mock.calls[0][1])).toEqual({
      state: { schemaVersion: 1, registry },
      version: 0
    });
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
