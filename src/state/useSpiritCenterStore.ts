import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { spiritCenterEntries } from '../content/spiritCenter';
import {
  chooseNoSpiritCenter,
  classifySpiritCenterEntry,
  completeSpiritCenter,
  createSpiritCenterProgress,
  declineSpiritCenter,
  selectSpiritCenterScenario,
  setSpiritCenterDecision,
  setSpiritCenterDimension,
  setSpiritCenterDuration,
  setSpiritCenterReview,
  skipSpiritCenterClassification,
  type SpiritCenterCategory,
  type SpiritCenterDecision,
  type SpiritCenterDuration,
  type SpiritCenterProgress,
  type SpiritCenterReview
} from '../domain/spiritCenter';
import type { SpiritDimension } from '../domain/spiritThread';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface SpiritCenterStoreState {
  schemaVersion: number;
  progress?: SpiritCenterProgress;
  start: (sourceThreadId: string) => void;
  classify: (entryId: string, category: SpiritCenterCategory) => void;
  skipClassification: () => void;
  selectScenario: (scenarioId: string) => void;
  setCenter: (dimension: SpiritDimension) => void;
  chooseNoCenter: () => void;
  setDuration: (duration: SpiritCenterDuration) => void;
  setReview: (review: SpiritCenterReview) => void;
  setDecision: (decision: SpiritCenterDecision) => void;
  declineCenter: () => void;
  complete: () => void;
  reset: () => void;
}

export const useSpiritCenterStore = create<SpiritCenterStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceThreadId) => {
        const current = get().progress;
        if (current?.sourceThreadId === sourceThreadId) return;
        set({ progress: createSpiritCenterProgress(sourceThreadId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifySpiritCenterEntry(state.progress, entryId, category, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: skipSpiritCenterClassification(state.progress, now()) }
        : state),
      selectScenario: (scenarioId) => set((state) => state.progress
        ? { progress: selectSpiritCenterScenario(state.progress, scenarioId, now()) }
        : state),
      setCenter: (dimension) => set((state) => state.progress
        ? { progress: setSpiritCenterDimension(state.progress, dimension, now()) }
        : state),
      chooseNoCenter: () => set((state) => state.progress
        ? { progress: chooseNoSpiritCenter(state.progress, now()) }
        : state),
      setDuration: (duration) => set((state) => state.progress
        ? { progress: setSpiritCenterDuration(state.progress, duration, now()) }
        : state),
      setReview: (review) => set((state) => state.progress
        ? { progress: setSpiritCenterReview(state.progress, review, now()) }
        : state),
      setDecision: (decision) => set((state) => state.progress
        ? { progress: setSpiritCenterDecision(state.progress, decision, now()) }
        : state),
      declineCenter: () => set((state) => state.progress
        ? { progress: declineSpiritCenter(state.progress, now()) }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeSpiritCenter(state.progress, spiritCenterEntries.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-spirit-center-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
