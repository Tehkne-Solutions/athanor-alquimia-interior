import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyEarthRhythmEntry,
  completeEarthRhythm,
  createEarthRhythmProgress,
  setEarthRhythmActionUnit,
  setEarthRhythmDecision,
  setEarthRhythmFrequency,
  setEarthRhythmResourceMode,
  setEarthRhythmRest,
  setEarthRhythmResume,
  skipEarthRhythmClassification,
  type EarthRhythmActionUnitId,
  type EarthRhythmCategory,
  type EarthRhythmDecisionId,
  type EarthRhythmFrequencyId,
  type EarthRhythmProgress,
  type EarthRhythmResourceModeId,
  type EarthRhythmRestId,
  type EarthRhythmResumeId
} from '../domain/earthRhythm';
import { earthRhythmEntries } from '../content/earthRhythm';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthRhythmStoreState {
  schemaVersion: number;
  progress?: EarthRhythmProgress;
  start: (sourceResourceBasketId: string) => void;
  classify: (entryId: string, category: EarthRhythmCategory) => void;
  skipClassification: () => void;
  setFrequency: (frequency: EarthRhythmFrequencyId) => void;
  setActionUnit: (actionUnit: EarthRhythmActionUnitId) => void;
  setRest: (rest: EarthRhythmRestId) => void;
  setResourceMode: (resourceMode: EarthRhythmResourceModeId) => void;
  setResume: (resume: EarthRhythmResumeId) => void;
  setDecision: (decision: EarthRhythmDecisionId) => void;
  complete: () => void;
  reset: () => void;
}

export const useEarthRhythmStore = create<EarthRhythmStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceResourceBasketId) => {
        const current = get().progress;
        if (current?.sourceResourceBasketId === sourceResourceBasketId) return;
        set({ progress: createEarthRhythmProgress(sourceResourceBasketId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress ? { progress: classifyEarthRhythmEntry(state.progress, entryId, category, now()) } : state),
      skipClassification: () => set((state) => state.progress ? { progress: skipEarthRhythmClassification(state.progress, now()) } : state),
      setFrequency: (frequency) => set((state) => state.progress ? { progress: setEarthRhythmFrequency(state.progress, frequency, now()) } : state),
      setActionUnit: (actionUnit) => set((state) => state.progress ? { progress: setEarthRhythmActionUnit(state.progress, actionUnit, now()) } : state),
      setRest: (rest) => set((state) => state.progress ? { progress: setEarthRhythmRest(state.progress, rest, now()) } : state),
      setResourceMode: (resourceMode) => set((state) => state.progress ? { progress: setEarthRhythmResourceMode(state.progress, resourceMode, now()) } : state),
      setResume: (resume) => set((state) => state.progress ? { progress: setEarthRhythmResume(state.progress, resume, now()) } : state),
      setDecision: (decision) => set((state) => state.progress ? { progress: setEarthRhythmDecision(state.progress, decision, now()) } : state),
      complete: () => set((state) => state.progress ? { progress: completeEarthRhythm(state.progress, earthRhythmEntries.length, now()) } : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-rhythm-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
