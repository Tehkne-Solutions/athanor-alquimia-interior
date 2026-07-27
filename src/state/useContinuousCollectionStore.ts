import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { continuousCollectionCatalog, type ContinuousCollectionTemplate } from '../content/continuousCollection';
import type { ContinuousMapItem } from '../domain/continuousMap';
import {
  addContinuousCollectionItem,
  addManyContinuousCollectionItems,
  archiveContinuousCollection,
  createContinuousCollection,
  createContinuousCollectionRegistry,
  moveContinuousCollectionItem,
  reactivateContinuousCollection,
  removeContinuousCollectionItem,
  type ContinuousCollectionRegistry
} from '../domain/continuousCollection';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface ContinuousCollectionStoreState {
  schemaVersion: number;
  registry: ContinuousCollectionRegistry;
  createCollection: (template: ContinuousCollectionTemplate) => string;
  addLocalItem: (collectionId: string, item: ContinuousMapItem) => void;
  addImportedItems: (collectionId: string, items: ContinuousMapItem[]) => void;
  removeItem: (collectionId: string, itemKey: string) => void;
  moveItem: (collectionId: string, itemKey: string, direction: -1 | 1) => void;
  archiveCollection: (collectionId: string) => void;
  reactivateCollection: (collectionId: string) => void;
  reset: () => void;
}

const initialRegistry = () => createContinuousCollectionRegistry(continuousCollectionCatalog.version, now());

export const useContinuousCollectionStore = create<ContinuousCollectionStoreState>()(
  persist(
    (set) => ({
      schemaVersion: 1,
      registry: initialRegistry(),
      createCollection: (template) => {
        const id = crypto.randomUUID();
        set((state) => ({
          registry: createContinuousCollection(
            state.registry,
            { id, templateId: template.id, label: template.label },
            now()
          )
        }));
        return id;
      },
      addLocalItem: (collectionId, item) => set((state) => ({
        registry: addContinuousCollectionItem(state.registry, collectionId, item, 'local-map', now())
      })),
      addImportedItems: (collectionId, items) => set((state) => ({
        registry: addManyContinuousCollectionItems(state.registry, collectionId, items, 'imported-map', now())
      })),
      removeItem: (collectionId, itemKey) => set((state) => ({
        registry: removeContinuousCollectionItem(state.registry, collectionId, itemKey, now())
      })),
      moveItem: (collectionId, itemKey, direction) => set((state) => ({
        registry: moveContinuousCollectionItem(state.registry, collectionId, itemKey, direction, now())
      })),
      archiveCollection: (collectionId) => set((state) => ({
        registry: archiveContinuousCollection(state.registry, collectionId, now())
      })),
      reactivateCollection: (collectionId) => set((state) => ({
        registry: reactivateContinuousCollection(state.registry, collectionId, now())
      })),
      reset: () => set({ registry: initialRegistry() })
    }),
    {
      name: 'athanor-continuous-collection-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, registry: state.registry })
    }
  )
);
