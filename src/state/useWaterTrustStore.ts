import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { waterTrustStatements } from '../content/water';
import {
  classifyWaterTrustStatement,
  completeWaterTrust,
  createWaterTrustProgress,
  selectWaterCareAction,
  skipWaterTrustClassification,
  toggleWaterSupportResource,
  type WaterCareActionId,
  type WaterSupportResourceId,
  type WaterTrustProgress,
  type WaterTrustStatementCategory
} from '../domain/waterTrust';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface WaterTrustStoreState {
  schemaVersion: number;
  progress?: WaterTrustProgress;
  start: (journeyStartedAt: string) => void;
  classify: (statementId: string, category: WaterTrustStatementCategory) => void;
  toggleResource: (resourceId: WaterSupportResourceId) => void;
  selectCareAction: (actionId: WaterCareActionId) => void;
  skipClassification: () => void;
  complete: () => void;
  reset: () => void;
}

export const useWaterTrustStore = create<WaterTrustStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (journeyStartedAt) => {
        const current = get().progress;
        if (current?.journeyStartedAt === journeyStartedAt) return;
        set({ progress: createWaterTrustProgress(journeyStartedAt, now()) });
      },
      classify: (statementId, category) => set((state) => state.progress
        ? { progress: classifyWaterTrustStatement(state.progress, statementId, category, now()) }
        : state),
      toggleResource: (resourceId) => set((state) => state.progress
        ? { progress: toggleWaterSupportResource(state.progress, resourceId, now()) }
        : state),
      selectCareAction: (actionId) => set((state) => state.progress
        ? { progress: selectWaterCareAction(state.progress, actionId, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: skipWaterTrustClassification(state.progress, now()) }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeWaterTrust(state.progress, waterTrustStatements, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-water-trust-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
