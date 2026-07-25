import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  completeWaterLament as completeWaterLamentProgress,
  createEmptyWaterLamentDraft,
  createWaterLamentProgress,
  updateWaterLamentField as updateWaterLamentFieldProgress,
  type WaterLamentCompletionOutcome,
  type WaterLamentField,
  type WaterLamentProgress
} from '../domain/waterLament';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface WaterLamentStoreState {
  schemaVersion: number;
  journeyStartedAt?: string;
  progress?: WaterLamentProgress;
  start: (journeyStartedAt: string) => void;
  updateField: (field: WaterLamentField, value: string) => void;
  skip: () => void;
  complete: () => WaterLamentCompletionOutcome;
  reset: () => void;
}

export const useWaterLamentStore = create<WaterLamentStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 2,
      start: (journeyStartedAt) => {
        const current = get();
        if (current.progress && current.journeyStartedAt === journeyStartedAt) return;
        const startedAt = now();
        set({ journeyStartedAt, progress: createWaterLamentProgress(startedAt) });
      },
      updateField: (field, value) => set((state) => {
        const progress = state.progress ?? createWaterLamentProgress(now());
        return { progress: updateWaterLamentFieldProgress(progress, field, value, now()) };
      }),
      skip: () => set((state) => {
        const progress = state.progress ?? createWaterLamentProgress(now());
        return {
          progress: {
            ...progress,
            status: 'active',
            draft: { ...createEmptyWaterLamentDraft(), skipped: true },
            safetySignal: undefined,
            updatedAt: now()
          }
        };
      }),
      complete: () => {
        const progress = get().progress;
        if (!progress) return 'invalid';
        const result = completeWaterLamentProgress(progress, now());
        set({ progress: result.progress });
        return result.outcome;
      },
      reset: () => set({ journeyStartedAt: undefined, progress: undefined })
    }),
    {
      name: 'athanor-water-lament-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        journeyStartedAt: state.journeyStartedAt,
        progress: state.progress
      })
    }
  )
);
