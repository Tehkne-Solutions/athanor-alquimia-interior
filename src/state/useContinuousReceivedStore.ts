import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { continuousReceiveCatalog } from '../content/continuousReceive';
import {
  archiveReceivedCollection,
  createContinuousReceivedRegistry,
  findReceivedByFingerprint,
  fingerprintContinuousSharePackage,
  keepReceivedCollection,
  reactivateReceivedCollection,
  removeReceivedCollection,
  type ContinuousReceivedRegistry
} from '../domain/continuousReceive';
import type { ContinuousCollectionShareExport } from '../domain/continuousShare';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

export interface KeepReceivedResult {
  id: string;
  duplicate: boolean;
}

interface ContinuousReceivedStoreState {
  schemaVersion: number;
  registry: ContinuousReceivedRegistry;
  keepPackage: (value: ContinuousCollectionShareExport) => KeepReceivedResult;
  archiveRecord: (recordId: string) => void;
  reactivateRecord: (recordId: string) => void;
  removeRecord: (recordId: string) => void;
  reset: () => void;
}

const initialRegistry = () => createContinuousReceivedRegistry(continuousReceiveCatalog.version, now());

export const useContinuousReceivedStore = create<ContinuousReceivedStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      registry: initialRegistry(),
      keepPackage: (value) => {
        const fingerprint = fingerprintContinuousSharePackage(value);
        const existing = findReceivedByFingerprint(get().registry, fingerprint);
        if (existing) return { id: existing.id, duplicate: true };
        const id = crypto.randomUUID();
        set((state) => ({
          registry: keepReceivedCollection(state.registry, { id, package: value }, now())
        }));
        return { id, duplicate: false };
      },
      archiveRecord: (recordId) => set((state) => ({
        registry: archiveReceivedCollection(state.registry, recordId, now())
      })),
      reactivateRecord: (recordId) => set((state) => ({
        registry: reactivateReceivedCollection(state.registry, recordId, now())
      })),
      removeRecord: (recordId) => set((state) => ({
        registry: removeReceivedCollection(state.registry, recordId, now())
      })),
      reset: () => set({ registry: initialRegistry() })
    }),
    {
      name: 'athanor-continuous-received-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, registry: state.registry })
    }
  )
);
