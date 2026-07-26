import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { earthResourceEntries } from '../content/earthResources';
import {
  classifyEarthResourceEntry,
  completeEarthResources,
  createEarthResourcesProgress,
  setEarthResourceAvailability,
  setEarthResourceDecision,
  setEarthResourceScope,
  setEarthResourceSubstitution,
  skipEarthResourceClassification,
  type EarthResourceAvailability,
  type EarthResourceCategory,
  type EarthResourceDecisionId,
  type EarthResourceKind,
  type EarthResourcesProgress,
  type EarthResourceScopeId,
  type EarthResourceSubstitutionId
} from '../domain/earthResources';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthResourcesStoreState {
  schemaVersion: number;
  progress?: EarthResourcesProgress;
  start: (sourceFirstStepSeedId: string) => void;
  classify: (entryId: string, category: EarthResourceCategory) => void;
  skipClassification: () => void;
  setAvailability: (kind: EarthResourceKind, availability: EarthResourceAvailability) => void;
  setSubstitution: (substitution: EarthResourceSubstitutionId) => void;
  setScope: (scope: EarthResourceScopeId) => void;
  setDecision: (decision: EarthResourceDecisionId) => void;
  complete: () => void;
  reset: () => void;
}

export const useEarthResourcesStore = create<EarthResourcesStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceFirstStepSeedId) => {
        const current = get().progress;
        if (current?.sourceFirstStepSeedId === sourceFirstStepSeedId) return;
        set({ progress: createEarthResourcesProgress(sourceFirstStepSeedId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress ? { progress: classifyEarthResourceEntry(state.progress, entryId, category, now()) } : state),
      skipClassification: () => set((state) => state.progress ? { progress: skipEarthResourceClassification(state.progress, now()) } : state),
      setAvailability: (kind, availability) => set((state) => state.progress ? { progress: setEarthResourceAvailability(state.progress, kind, availability, now()) } : state),
      setSubstitution: (substitution) => set((state) => state.progress ? { progress: setEarthResourceSubstitution(state.progress, substitution, now()) } : state),
      setScope: (scope) => set((state) => state.progress ? { progress: setEarthResourceScope(state.progress, scope, now()) } : state),
      setDecision: (decision) => set((state) => state.progress ? { progress: setEarthResourceDecision(state.progress, decision, now()) } : state),
      complete: () => set((state) => state.progress ? { progress: completeEarthResources(state.progress, earthResourceEntries.length, now()) } : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-resources-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
