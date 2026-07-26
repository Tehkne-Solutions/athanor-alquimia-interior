import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { spiritThreadEntries } from '../content/spiritThread';
import {
  classifySpiritThreadEntry,
  completeSpiritThread,
  createSpiritThreadProgress,
  declineSpiritSynthesis,
  selectSpiritScenario,
  setSpiritDimensionState,
  setSpiritRelation,
  setSpiritThreadDecision,
  skipSpiritThreadClassification,
  type SpiritDimension,
  type SpiritDimensionState,
  type SpiritRelation,
  type SpiritThreadCategory,
  type SpiritThreadDecision,
  type SpiritThreadProgress
} from '../domain/spiritThread';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface SpiritThreadStoreState {
  schemaVersion: number;
  progress?: SpiritThreadProgress;
  start: (sourceEarthCycleId: string) => void;
  classify: (entryId: string, category: SpiritThreadCategory) => void;
  skipClassification: () => void;
  selectScenario: (scenarioId: string) => void;
  setDimensionState: (dimension: SpiritDimension, state: SpiritDimensionState) => void;
  setRelation: (relation: SpiritRelation) => void;
  setDecision: (decision: SpiritThreadDecision) => void;
  declineSynthesis: () => void;
  complete: () => void;
  reset: () => void;
}

export const useSpiritThreadStore = create<SpiritThreadStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceEarthCycleId) => {
        const current = get().progress;
        if (current?.sourceEarthCycleId === sourceEarthCycleId) return;
        set({ progress: createSpiritThreadProgress(sourceEarthCycleId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifySpiritThreadEntry(state.progress, entryId, category, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: skipSpiritThreadClassification(state.progress, now()) }
        : state),
      selectScenario: (scenarioId) => set((state) => state.progress
        ? { progress: selectSpiritScenario(state.progress, scenarioId, now()) }
        : state),
      setDimensionState: (dimension, dimensionState) => set((state) => state.progress
        ? { progress: setSpiritDimensionState(state.progress, dimension, dimensionState, now()) }
        : state),
      setRelation: (relation) => set((state) => state.progress
        ? { progress: setSpiritRelation(state.progress, relation, now()) }
        : state),
      setDecision: (decision) => set((state) => state.progress
        ? { progress: setSpiritThreadDecision(state.progress, decision, now()) }
        : state),
      declineSynthesis: () => set((state) => state.progress
        ? { progress: declineSpiritSynthesis(state.progress, now()) }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeSpiritThread(state.progress, spiritThreadEntries.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-spirit-thread-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
