import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyFireEntry,
  completeFireMission,
  createFireMissionProgress,
  skipFireCheckIn,
  toggleFireEmotion,
  type FireActionId,
  type FireClassificationCategory,
  type FireEmotionId,
  type FireMissionProgress,
  type FireNeedId,
  type FirePauseId
} from '../domain/fire';
import { fireClassificationEntries } from '../content/fireMission';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface FireMissionStoreState {
  schemaVersion: number;
  progress?: FireMissionProgress;
  start: (sourceWaterCycleId: string) => void;
  toggleEmotion: (emotion: FireEmotionId) => void;
  setIntensity: (intensity?: 1 | 2 | 3 | 4 | 5) => void;
  skipCheckIn: () => void;
  classify: (entryId: string, category: FireClassificationCategory) => void;
  skipClassification: () => void;
  setPause: (pause: FirePauseId) => void;
  setNeed: (need: FireNeedId) => void;
  setAction: (action: FireActionId) => void;
  complete: () => void;
  reset: () => void;
}

export const useFireMissionStore = create<FireMissionStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceWaterCycleId) => {
        const current = get().progress;
        if (current?.sourceWaterCycleId === sourceWaterCycleId) return;
        set({ progress: createFireMissionProgress(sourceWaterCycleId, now()) });
      },
      toggleEmotion: (emotion) => set((state) => state.progress
        ? { progress: toggleFireEmotion(state.progress, emotion, now()) }
        : state),
      setIntensity: (intensity) => set((state) => state.progress
        ? { progress: { ...state.progress, intensity, checkInSkipped: false, updatedAt: now() } }
        : state),
      skipCheckIn: () => set((state) => state.progress
        ? { progress: skipFireCheckIn(state.progress, now()) }
        : state),
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifyFireEntry(state.progress, entryId, category, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: { ...state.progress, classifications: {}, classificationSkipped: true, updatedAt: now() } }
        : state),
      setPause: (pause) => set((state) => state.progress
        ? { progress: { ...state.progress, pause, updatedAt: now() } }
        : state),
      setNeed: (need) => set((state) => state.progress
        ? { progress: { ...state.progress, need, updatedAt: now() } }
        : state),
      setAction: (action) => set((state) => state.progress
        ? { progress: { ...state.progress, action, updatedAt: now() } }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeFireMission(state.progress, fireClassificationEntries.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-mission-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
