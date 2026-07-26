import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  completeFireChapter,
  createFireChapterProgress,
  selectFireChapterDestination,
  setFireChapterNote,
  type FireChapterDestination,
  type FireChapterMissionId,
  type FireChapterProgress
} from '../domain/fireChapter';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface FireChapterStoreState {
  schemaVersion: number;
  progress?: FireChapterProgress;
  start: (sourceShieldId: string) => void;
  selectDestination: (missionId: FireChapterMissionId, destination: FireChapterDestination) => void;
  setNote: (note: string) => void;
  complete: () => FireChapterProgress | undefined;
  reset: () => void;
}

export const useFireChapterStore = create<FireChapterStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceShieldId) => {
        const current = get().progress;
        if (current?.sourceShieldId === sourceShieldId) return;
        set({ progress: createFireChapterProgress(sourceShieldId, now()) });
      },
      selectDestination: (missionId, destination) => set((state) => state.progress
        ? { progress: selectFireChapterDestination(state.progress, missionId, destination, now()) }
        : state),
      setNote: (note) => set((state) => state.progress
        ? { progress: setFireChapterNote(state.progress, note, now()) }
        : state),
      complete: () => {
        const current = get().progress;
        if (!current) return undefined;
        const completed = completeFireChapter(current, now(), crypto.randomUUID());
        set({ progress: completed });
        return completed;
      },
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-chapter-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
