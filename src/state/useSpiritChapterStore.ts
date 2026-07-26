import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  completeSpiritChapter,
  createSpiritChapterProgress,
  selectSpiritChapterDestination,
  setSpiritChapterNote,
  type SpiritChapterDestination,
  type SpiritChapterMissionId,
  type SpiritChapterProgress
} from '../domain/spiritChapter';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface SpiritChapterStoreState {
  schemaVersion: number;
  progress?: SpiritChapterProgress;
  start: (sourceOrbId: string) => void;
  selectDestination: (missionId: SpiritChapterMissionId, destination: SpiritChapterDestination) => void;
  setNote: (note: string) => void;
  complete: () => SpiritChapterProgress | undefined;
  reset: () => void;
}

export const useSpiritChapterStore = create<SpiritChapterStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceOrbId) => {
        const current = get().progress;
        if (current?.sourceOrbId === sourceOrbId) return;
        set({ progress: createSpiritChapterProgress(sourceOrbId, now()) });
      },
      selectDestination: (missionId, destination) => set((state) => state.progress
        ? { progress: selectSpiritChapterDestination(state.progress, missionId, destination, now()) }
        : state),
      setNote: (note) => set((state) => state.progress
        ? { progress: setSpiritChapterNote(state.progress, note, now()) }
        : state),
      complete: () => {
        const current = get().progress;
        if (!current) return undefined;
        const completed = completeSpiritChapter(current, now(), crypto.randomUUID());
        set({ progress: completed });
        return completed;
      },
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-spirit-chapter-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
