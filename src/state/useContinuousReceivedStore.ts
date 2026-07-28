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
  archiveContinuousReceivedRecordFromStore,
  keepContinuousReceivedPackageFromStore,
  reactivateContinuousReceivedRecordFromStore,
  removeContinuousReceivedRecordFromStore
} from './continuousReceivedStoreAdapter';

const now = () => new Date().toISOString();

export interface KeepReceivedResult {
  id?: string;
  duplicate: boolean;
  status: ContinuousReceivedKeepStatus;
  changed: boolean;
  message: string;
}

export interface MutateReceivedResult {
  status: ContinuousReceivedMutationStatus;
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

export const useContinuousReceivedStore = create<ContinuousReceivedStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      registry: initialRegistry(),
      keepPackage: (value) => {
        const current = get().registry;
        const result = keepContinuousReceivedPackageFromStore(
          current,
          value,
          crypto.randomUUID(),
          now()
        );
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
        const current = get().registry;
        const result = archiveContinuousReceivedRecordFromStore(current, recordId, now());
        if (result.changed) set({ registry: result.registry });
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: result.message
        };
      },
      reactivateRecord: (recordId) => {
        const current = get().registry;
        const result = reactivateContinuousReceivedRecordFromStore(current, recordId, now());
        if (result.changed) set({ registry: result.registry });
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: result.message
        };
      },
      removeRecord: (recordId) => {
        const current = get().registry;
        const result = removeContinuousReceivedRecordFromStore(current, recordId, now());
        if (result.changed) set({ registry: result.registry });
        return {
          status: result.status,
          matchedRecords: result.matchedRecords,
          changed: result.changed,
          message: result.message
        };
      },
      reset: () => set({ registry: initialRegistry() })
    }),
    {
      name: 'athanor-continuous-received-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, registry: state.registry })
    }
  )
);
