import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  completeEarthChapter,
  createEarthChapterProgress,
  selectEarthChapterDestination,
  setEarthChapterNote,
  type EarthChapterDestination,
  type EarthChapterMissionId,
  type EarthChapterProgress
} from '../domain/earthChapter';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthChapterStoreState {
  schemaVersion: number;
  progress?: EarthChapterProgress;
  start: (sourceStoneId: string) => void;
  selectDestination: (missionId: EarthChapterMissionId, destination: EarthChapterDestination) => void;
  setNote: (note: string) => void;
  complete: () => EarthChapterProgress | undefined;
  reset: () => void;
}

export const useEarthChapterStore = create<EarthChapterStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceStoneId) => {
        const current = get().progress;
        if (current?.sourceStoneId === sourceStoneId) return;
        set({ progress: createEarthChapterProgress(sourceStoneId, now()) });
      },
      selectDestination: (missionId, destination) => set((state) => state.progress
        ? { progress: selectEarthChapterDestination(state.progress, missionId, destination, now()) }
        : state),
      setNote: (note) => set((state) => state.progress
        ? { progress: setEarthChapterNote(state.progress, note, now()) }
        : state),
      complete: () => {
        const current = get().progress;
        if (!current) return undefined;
        const completed = completeEarthChapter(current, now(), crypto.randomUUID());
        set({ progress: completed });
        return completed;
      },
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-chapter-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
