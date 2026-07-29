import type { StateStorage } from 'zustand/middleware';
import type { ContinuousReceivedRegistry } from '../domain/continuousReceive';
import {
  compareAndSetIdbState,
  idbStateStorage,
  type IdbCompareAndSetResult
} from '../storage/idbStorage';
import { inspectContinuousReceivedPersistedText } from './continuousReceivedPersistedText';
import { useContinuousReceivedHydrationRuntimeStore } from './useContinuousReceivedHydrationRuntimeStore';
import { useContinuousReceivedPersistenceRuntimeStore } from './useContinuousReceivedPersistenceRuntimeStore';

export const CONTINUOUS_RECEIVED_STORAGE_KEY = 'athanor-continuous-received-state';
export const CONTINUOUS_RECEIVED_SCHEMA_VERSION = 1 as const;
export const CONTINUOUS_RECEIVED_PERSIST_VERSION = 0 as const;

export interface ContinuousReceivedPersistedSlice {
  schemaVersion: typeof CONTINUOUS_RECEIVED_SCHEMA_VERSION;
  registry: ContinuousReceivedRegistry;
}

export type ContinuousReceivedCompareAndSet = (
  name: string,
  expectedValue: string | null,
  nextValue: string
) => Promise<IdbCompareAndSetResult>;

export type ContinuousReceivedConditionalWriteResult =
  | { status: 'confirmed'; persistedValue: string }
  | { status: 'conflict' };

export const continuousReceivedHydrationOnlyStorage: StateStorage = {
  getItem: async (name) => {
    const value = await idbStateStorage.getItem(name);
    useContinuousReceivedPersistenceRuntimeStore.getState().hydrate(value);
    if (value === null) return null;

    const inspected = inspectContinuousReceivedPersistedText(value);
    if (!inspected.ok) {
      useContinuousReceivedHydrationRuntimeStore.getState().rejectPersistedText(inspected.errors);
      return null;
    }
    return value;
  },
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

export async function writeContinuousReceivedPersistedRegistryIfUnchanged(
  registry: ContinuousReceivedRegistry,
  expectedPersistedValue: string | null,
  compareAndSet: ContinuousReceivedCompareAndSet = compareAndSetIdbState
): Promise<ContinuousReceivedConditionalWriteResult> {
  const persistedValue = serializeContinuousReceivedPersistedState(registry);
  const result = await compareAndSet(
    CONTINUOUS_RECEIVED_STORAGE_KEY,
    expectedPersistedValue,
    persistedValue
  );
  if (result.status === 'conflict') return { status: 'conflict' };
  return { status: 'confirmed', persistedValue };
}
