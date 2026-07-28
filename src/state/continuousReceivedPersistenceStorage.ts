import type { StateStorage } from 'zustand/middleware';
import type { ContinuousReceivedRegistry } from '../domain/continuousReceive';
import { idbStateStorage } from '../storage/idbStorage';

export const CONTINUOUS_RECEIVED_STORAGE_KEY = 'athanor-continuous-received-state';
export const CONTINUOUS_RECEIVED_SCHEMA_VERSION = 1 as const;
export const CONTINUOUS_RECEIVED_PERSIST_VERSION = 0 as const;

export interface ContinuousReceivedPersistedSlice {
  schemaVersion: typeof CONTINUOUS_RECEIVED_SCHEMA_VERSION;
  registry: ContinuousReceivedRegistry;
}

export const continuousReceivedHydrationOnlyStorage: StateStorage = {
  getItem: (name) => idbStateStorage.getItem(name),
  setItem: async () => {
    // Escritas automáticas do middleware ficam desativadas. As ações persistem explicitamente antes do commit no runtime.
  },
  removeItem: (name) => idbStateStorage.removeItem(name)
};

export function serializeContinuousReceivedPersistedState(
  registry: ContinuousReceivedRegistry
): string {
  return JSON.stringify({
    state: {
      schemaVersion: CONTINUOUS_RECEIVED_SCHEMA_VERSION,
      registry
    } satisfies ContinuousReceivedPersistedSlice,
    version: CONTINUOUS_RECEIVED_PERSIST_VERSION
  });
}

export async function writeContinuousReceivedPersistedRegistry(
  registry: ContinuousReceivedRegistry,
  storage: StateStorage = idbStateStorage
): Promise<void> {
  await storage.setItem(
    CONTINUOUS_RECEIVED_STORAGE_KEY,
    serializeContinuousReceivedPersistedState(registry)
  );
}
