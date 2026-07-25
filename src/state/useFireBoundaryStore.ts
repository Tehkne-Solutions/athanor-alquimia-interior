import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyBoundaryStatement,
  completeFireBoundary,
  createFireBoundaryProgress,
  type FireBoundaryAction,
  type FireBoundaryCondition,
  type FireBoundaryDuration,
  type FireBoundaryProgress,
  type FireBoundaryReview,
  type FireBoundaryScope,
  type FireBoundaryStatementCategory
} from '../domain/fireBoundary';
import { fireBoundaryStatements } from '../content/fireBoundary';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface FireBoundaryStoreState {
  schemaVersion: number;
  progress?: FireBoundaryProgress;
  start: (sourceIntervalEmberId: string) => void;
  classify: (entryId: string, category: FireBoundaryStatementCategory) => void;
  skipClassification: () => void;
  setScope: (scope: FireBoundaryScope) => void;
  setCondition: (condition: FireBoundaryCondition) => void;
  setAction: (action: FireBoundaryAction) => void;
  setDuration: (duration: FireBoundaryDuration) => void;
  setReview: (review: FireBoundaryReview) => void;
  complete: () => void;
  reset: () => void;
}

export const useFireBoundaryStore = create<FireBoundaryStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceIntervalEmberId) => {
        const current = get().progress;
        if (current?.sourceIntervalEmberId === sourceIntervalEmberId) return;
        set({ progress: createFireBoundaryProgress(sourceIntervalEmberId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifyBoundaryStatement(state.progress, entryId, category, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: { ...state.progress, classifications: {}, classificationSkipped: true, updatedAt: now() } }
        : state),
      setScope: (scope) => set((state) => state.progress
        ? { progress: { ...state.progress, scope, updatedAt: now() } }
        : state),
      setCondition: (condition) => set((state) => state.progress
        ? { progress: { ...state.progress, condition, updatedAt: now() } }
        : state),
      setAction: (action) => set((state) => state.progress
        ? { progress: { ...state.progress, action, updatedAt: now() } }
        : state),
      setDuration: (duration) => set((state) => state.progress
        ? { progress: { ...state.progress, duration, updatedAt: now() } }
        : state),
      setReview: (review) => set((state) => state.progress
        ? { progress: { ...state.progress, review, updatedAt: now() } }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeFireBoundary(state.progress, fireBoundaryStatements.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-boundary-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
