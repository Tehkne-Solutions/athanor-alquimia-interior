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
import { idbStateStorage } from '../storage/idbStorage';
import {
  hydrateContinuousReceivedPersistedState
} from './continuousReceivedHydration';
import {
  executeContinuousReceivedHydrationGatedAction,
  type ContinuousReceivedHydrationBlockStatus
} from './continuousReceivedHydrationGate';
import {
  archiveContinuousReceivedRecordFromStore,
  keepContinuousReceivedPackageFromStore,
  reactivateContinuousReceivedRecordFromStore,
  removeContinuousReceivedRecordFromStore
} from './continuousReceivedStoreAdapter';
import { useContinuousReceivedHydrationRuntimeStore } from './useContinuousReceivedHydrationRuntimeStore';

const now = () => new Date().toISOString();

export type KeepReceivedResultStatus = ContinuousReceivedKeepStatus | ContinuousReceivedHydrationBlockStatus;
export type MutateReceivedResultStatus = ContinuousReceivedMutationStatus | ContinuousReceivedHydrationBlockStatus;

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
  keepPackage: (value: ContinuousCollectionShareExport) => KeepReceivedResult;
  archiveRecord: (recordId: string) => MutateReceivedResult;
  reactivateRecord: (recordId: string) => MutateReceivedResult;
  removeRecord: (recordId: string) => MutateReceivedResult;
  reset: () => void;
}

const initialRegistry = () => createContinuousReceivedRegistry(continuousReceiveCatalog.version, now());

function blockedKeep(status: ContinuousReceivedHydrationBlockStatus, message: string): KeepReceivedResult {
  return { duplicate: false, status, changed: false, message };
}

function blockedMutation(status: ContinuousReceivedHydrationBlockStatus, message: string): MutateReceivedResult {
  return { status, matchedRecords: 0, changed: false, message };
}

export const useContinuousReceivedStore = create<ContinuousReceivedStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      registry: initialRegistry(),
      keepPackage: (value) => {
        const runtimeStatus = useContinuousReceivedHydrationRuntimeStore.getState().status;
        const execution = executeContinuousReceivedHydrationGatedAction(runtimeStatus, () => {
          const current = get().registry;
          return keepContinuousReceivedPackageFromStore(
            current,
            value,
            crypto.randomUUID(),
            now()
          );
        });
        if (!execution.executed) return blockedKeep(execution.gate.status, execution.gate.message);
        const result = execution.value;
        if (result.changed) set({ registry: result.registry });
        return {
          id: result.id,
          duplicate: result.duplicate,
          status: result.status,
          changed: result.changed,
          message: result.message
        };
      },
      archiveRecord: (recordId) => {
        const runtimeStatus = useContinuousReceivedHydrationRuntimeStore.getState().status;
        const execution = executeContinuousReceivedHydrationGatedAction(runtimeStatus, () =>
          archiveContinuousReceivedRecordFromStore(get().registry, recordId, now())
        );
        if (!execution.executed) return blockedMutation(execution.gate.status, execution.gate.message);
        const result = execution.value;
        if (result.changed) set({ registry: result.registry });
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: result.message
        };
      },
      reactivateRecord: (recordId) => {
        const runtimeStatus = useContinuousReceivedHydrationRuntimeStore.getState().status;
        const execution = executeContinuousReceivedHydrationGatedAction(runtimeStatus, () =>
          reactivateContinuousReceivedRecordFromStore(get().registry, recordId, now())
        );
        if (!execution.executed) return blockedMutation(execution.gate.status, execution.gate.message);
        const result = execution.value;
        if (result.changed) set({ registry: result.registry });
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: result.message
        };
      },
      removeRecord: (recordId) => {
        const runtimeStatus = useContinuousReceivedHydrationRuntimeStore.getState().status;
        const execution = executeContinuousReceivedHydrationGatedAction(runtimeStatus, () =>
          removeContinuousReceivedRecordFromStore(get().registry, recordId, now())
        );
        if (!execution.executed) return blockedMutation(execution.gate.status, execution.gate.message);
        const result = execution.value;
        if (result.changed) set({ registry: result.registry });
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: result.message
        };
      },
      reset: () => {
        const runtime = useContinuousReceivedHydrationRuntimeStore.getState();
        const execution = executeContinuousReceivedHydrationGatedAction(runtime.status, () => initialRegistry());
        if (!execution.executed) return;
        set({ registry: execution.value });
        runtime.markEmpty('A biblioteca recebida foi reiniciada localmente por uma ação explícita.');
      }
    }),
    {
      name: 'athanor-continuous-received-state',
      storage: createJSONStorage(() => idbStateStorage),
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
