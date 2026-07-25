import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyTimelineEntry,
  classifyUrgencyEntry,
  completeFireInterval,
  createFireIntervalProgress,
  type FireExitChoice,
  type FireIntervalChoice,
  type FireIntervalProgress,
  type FireTimelinePhase,
  type FireUrgencyCategory
} from '../domain/fireInterval';
import { fireTimelineEntries, fireUrgencyEntries } from '../content/fireInterval';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface FireIntervalStoreState {
  schemaVersion: number;
  progress?: FireIntervalProgress;
  start: (sourceNamedFlameId: string) => void;
  classifyTimeline: (entryId: string, phase: FireTimelinePhase) => void;
  skipTimeline: () => void;
  classifyUrgency: (entryId: string, category: FireUrgencyCategory) => void;
  skipUrgency: () => void;
  setInterval: (interval: FireIntervalChoice) => void;
  setExit: (exit: FireExitChoice) => void;
  complete: () => void;
  reset: () => void;
}

export const useFireIntervalStore = create<FireIntervalStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceNamedFlameId) => {
        const current = get().progress;
        if (current?.sourceNamedFlameId === sourceNamedFlameId) return;
        set({ progress: createFireIntervalProgress(sourceNamedFlameId, now()) });
      },
      classifyTimeline: (entryId, phase) => set((state) => state.progress
        ? { progress: classifyTimelineEntry(state.progress, entryId, phase, now()) }
        : state),
      skipTimeline: () => set((state) => state.progress
        ? { progress: { ...state.progress, timeline: {}, timelineSkipped: true, updatedAt: now() } }
        : state),
      classifyUrgency: (entryId, category) => set((state) => state.progress
        ? { progress: classifyUrgencyEntry(state.progress, entryId, category, now()) }
        : state),
      skipUrgency: () => set((state) => state.progress
        ? { progress: { ...state.progress, urgency: {}, urgencySkipped: true, updatedAt: now() } }
        : state),
      setInterval: (interval) => set((state) => state.progress
        ? { progress: { ...state.progress, interval, updatedAt: now() } }
        : state),
      setExit: (exit) => set((state) => state.progress
        ? { progress: { ...state.progress, exit, updatedAt: now() } }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeFireInterval(state.progress, fireTimelineEntries.length, fireUrgencyEntries.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-interval-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
