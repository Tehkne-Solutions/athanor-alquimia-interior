import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { continuousReceiveCatalog } from '../content/continuousReceive';
import {
  createContinuousReceivedRegistry,
  type ContinuousReceivedKeepStatus,
  type ContinuousReceivedMutationStatus,
  type ContinuousReceivedRegistry
} from '../domain/continuousReceive';
import type { ContinuousCollectionShareExport } from '../domain/continuousShare';
import {
  hydrateContinuousReceivedPersistedState
} from './continuousReceivedHydration';
import {
  inspectContinuousReceivedHydrationGate,
  type ContinuousReceivedHydrationBlockStatus
} from './continuousReceivedHydrationGate';
import {
  executeContinuousReceivedConfirmedPersistence,
  type ContinuousReceivedPersistenceBlockStatus
} from './continuousReceivedPersistenceCommit';
import {
  continuousReceivedHydrationOnlyStorage,
  CONTINUOUS_RECEIVED_STORAGE_KEY,
  writeContinuousReceivedPersistedRegistry
} from './continuousReceivedPersistenceStorage';
import {
  archiveContinuousReceivedRecordFromStore,
  keepContinuousReceivedPackageFromStore,
  reactivateContinuousReceivedRecordFromStore,
  removeContinuousReceivedRecordFromStore
} from './continuousReceivedStoreAdapter';
import { useContinuousReceivedHydrationRuntimeStore } from './useContinuousReceivedHydrationRuntimeStore';
import { useContinuousReceivedPersistenceRuntimeStore } from './useContinuousReceivedPersistenceRuntimeStore';

const now = () => new Date().toISOString();

export type KeepReceivedResultStatus =
  | ContinuousReceivedKeepStatus
  | ContinuousReceivedHydrationBlockStatus
  | ContinuousReceivedPersistenceBlockStatus;
export type MutateReceivedResultStatus =
  | ContinuousReceivedMutationStatus
  | ContinuousReceivedHydrationBlockStatus
  | ContinuousReceivedPersistenceBlockStatus;

export interface KeepReceivedResult {
  id?: string;
  duplicate: boolean;
  status: KeepReceivedResultStatus;
  changed: boolean;
  message: string;
}

export interface MutateReceivedResult {
  status: MutateReceivedResultStatus;
  matchedRecords: number;
  changed: boolean;
  message: string;
}

interface ContinuousReceivedStoreState {
  schemaVersion: number;
  registry: ContinuousReceivedRegistry;
  keepPackage: (value: ContinuousCollectionShareExport) => Promise<KeepReceivedResult>;
  archiveRecord: (recordId: string) => Promise<MutateReceivedResult>;
  reactivateRecord: (recordId: string) => Promise<MutateReceivedResult>;
  removeRecord: (recordId: string) => Promise<MutateReceivedResult>;
  reset: () => Promise<MutateReceivedResult>;
}

const initialRegistry = () => createContinuousReceivedRegistry(continuousReceiveCatalog.version, now());

function blockedKeep(
  status: ContinuousReceivedHydrationBlockStatus | ContinuousReceivedPersistenceBlockStatus,
  message: string
): KeepReceivedResult {
  return { duplicate: false, status, changed: false, message };
}

function blockedMutation(
  status: ContinuousReceivedHydrationBlockStatus | ContinuousReceivedPersistenceBlockStatus,
  message: string
): MutateReceivedResult {
  return { status, matchedRecords: 0, changed: false, message };
}

function persistenceLifecycle() {
  const runtime = useContinuousReceivedPersistenceRuntimeStore.getState();
  return {
    begin: runtime.begin,
    confirm: runtime.confirm,
    fail: runtime.fail,
    clear: runtime.clear
  };
}

function confirmedMessage(message: string, confirmed: boolean): string {
  return confirmed ? `${message} Gravação local confirmada.` : message;
}

export const useContinuousReceivedStore = create<ContinuousReceivedStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      registry: initialRegistry(),
      keepPackage: async (value) => {
        const hydrationGate = inspectContinuousReceivedHydrationGate(
          useContinuousReceivedHydrationRuntimeStore.getState().status
        );
        if (!hydrationGate.ready) return blockedKeep(hydrationGate.status, hydrationGate.message);

        const execution = await executeContinuousReceivedConfirmedPersistence(
          useContinuousReceivedPersistenceRuntimeStore.getState().status,
          'guardar cópia recebida',
          () => keepContinuousReceivedPackageFromStore(
            get().registry,
            value,
            crypto.randomUUID(),
            now()
          ),
          writeContinuousReceivedPersistedRegistry,
          (registry) => set({ registry }),
          persistenceLifecycle()
        );
        if (!execution.executed) return blockedKeep(execution.status, execution.message);

        const result = execution.value;
        return {
          id: result.id,
          duplicate: result.duplicate,
          status: result.status,
          changed: result.changed,
          message: confirmedMessage(result.message, execution.persistence === 'confirmed')
        };
      },
      archiveRecord: async (recordId) => {
        const hydrationGate = inspectContinuousReceivedHydrationGate(
          useContinuousReceivedHydrationRuntimeStore.getState().status
        );
        if (!hydrationGate.ready) return blockedMutation(hydrationGate.status, hydrationGate.message);

        const execution = await executeContinuousReceivedConfirmedPersistence(
          useContinuousReceivedPersistenceRuntimeStore.getState().status,
          'arquivar cópia recebida',
          () => archiveContinuousReceivedRecordFromStore(get().registry, recordId, now()),
          writeContinuousReceivedPersistedRegistry,
          (registry) => set({ registry }),
          persistenceLifecycle()
        );
        if (!execution.executed) return blockedMutation(execution.status, execution.message);

        const result = execution.value;
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: confirmedMessage(result.message, execution.persistence === 'confirmed')
        };
      },
      reactivateRecord: async (recordId) => {
        const hydrationGate = inspectContinuousReceivedHydrationGate(
          useContinuousReceivedHydrationRuntimeStore.getState().status
        );
        if (!hydrationGate.ready) return blockedMutation(hydrationGate.status, hydrationGate.message);

        const execution = await executeContinuousReceivedConfirmedPersistence(
          useContinuousReceivedPersistenceRuntimeStore.getState().status,
          'reativar cópia recebida',
          () => reactivateContinuousReceivedRecordFromStore(get().registry, recordId, now()),
          writeContinuousReceivedPersistedRegistry,
          (registry) => set({ registry }),
          persistenceLifecycle()
        );
        if (!execution.executed) return blockedMutation(execution.status, execution.message);

        const result = execution.value;
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: confirmedMessage(result.message, execution.persistence === 'confirmed')
        };
      },
      removeRecord: async (recordId) => {
        const hydrationGate = inspectContinuousReceivedHydrationGate(
          useContinuousReceivedHydrationRuntimeStore.getState().status
        );
        if (!hydrationGate.ready) return blockedMutation(hydrationGate.status, hydrationGate.message);

        const execution = await executeContinuousReceivedConfirmedPersistence(
          useContinuousReceivedPersistenceRuntimeStore.getState().status,
          'remover cópia recebida',
          () => removeContinuousReceivedRecordFromStore(get().registry, recordId, now()),
          writeContinuousReceivedPersistedRegistry,
          (registry) => set({ registry }),
          persistenceLifecycle()
        );
        if (!execution.executed) return blockedMutation(execution.status, execution.message);

        const result = execution.value;
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: confirmedMessage(result.message, execution.persistence === 'confirmed')
        };
      },
      reset: async () => {
        const hydrationRuntime = useContinuousReceivedHydrationRuntimeStore.getState();
        const hydrationGate = inspectContinuousReceivedHydrationGate(hydrationRuntime.status);
        if (!hydrationGate.ready) return blockedMutation(hydrationGate.status, hydrationGate.message);

        const current = get().registry;
        const execution = await executeContinuousReceivedConfirmedPersistence(
          useContinuousReceivedPersistenceRuntimeStore.getState().status,
          'reiniciar biblioteca recebida',
          () => ({
            changed: true,
            registry: initialRegistry(),
            message: 'A biblioteca recebida foi reiniciada localmente por uma ação explícita.'
          }),
          writeContinuousReceivedPersistedRegistry,
          (registry) => set({ registry }),
          persistenceLifecycle()
        );
        if (!execution.executed) return blockedMutation(execution.status, execution.message);

        hydrationRuntime.markEmpty('A biblioteca recebida foi reiniciada localmente por uma ação explícita.');
        return {
          status: 'updated',
          matchedRecords: current.records.length,
          changed: true,
          message: confirmedMessage(execution.value.message, execution.persistence === 'confirmed')
        };
      }
    }),
    {
      name: CONTINUOUS_RECEIVED_STORAGE_KEY,
      storage: createJSONStorage(() => continuousReceivedHydrationOnlyStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, registry: state.registry }),
      merge: (persistedState, currentState) => {
        const hydration = hydrateContinuousReceivedPersistedState(
          persistedState,
          currentState.registry
        );
        useContinuousReceivedHydrationRuntimeStore.getState().accept(hydration);
        return {
          ...currentState,
          schemaVersion: hydration.schemaVersion,
          registry: hydration.registry
        };
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) useContinuousReceivedHydrationRuntimeStore.getState().fail(error);
      }
    }
  )
);
