import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fireCourageStatements } from '../content/fireCourage';
import {
  classifyCourageStatement,
  completeFireCourage,
  createFireCourageProgress,
  toggleCourageResource,
  type FireCourageAction,
  type FireCourageContext,
  type FireCourageProgress,
  type FireCourageReadiness,
  type FireCourageResource,
  type FireCourageStatementCategory
} from '../domain/fireCourage';
import { idbStateStorage } from '../storage/idbStorage';

const currentTime = () => new Date().toISOString();

interface FireCourageStoreState {
  schemaVersion: number;
  progress?: FireCourageProgress;
  start: (sourceBoundaryPlateId: string) => void;
  classify: (entryId: string, category: FireCourageStatementCategory) => void;
  skipClassification: () => void;
  setContext: (context: FireCourageContext) => void;
  setAction: (action: FireCourageAction) => void;
  toggleResource: (resource: FireCourageResource) => void;
  setReadiness: (readiness: FireCourageReadiness) => void;
  complete: () => void;
  reset: () => void;
}

export const useFireCourageStore = create<FireCourageStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceBoundaryPlateId) => {
        const current = get().progress;
        if (current?.sourceBoundaryPlateId === sourceBoundaryPlateId) return;
        set({ progress: createFireCourageProgress(sourceBoundaryPlateId, currentTime()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifyCourageStatement(state.progress, entryId, category, currentTime()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: { ...state.progress, classifications: {}, classificationSkipped: true, updatedAt: currentTime() } }
        : state),
      setContext: (context) => set((state) => state.progress
        ? { progress: { ...state.progress, context, updatedAt: currentTime() } }
        : state),
      setAction: (action) => set((state) => state.progress
        ? { progress: { ...state.progress, action, updatedAt: currentTime() } }
        : state),
      toggleResource: (resource) => set((state) => state.progress
        ? { progress: toggleCourageResource(state.progress, resource, currentTime()) }
        : state),
      setReadiness: (readiness) => set((state) => state.progress
        ? { progress: { ...state.progress, readiness, updatedAt: currentTime() } }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeFireCourage(state.progress, fireCourageStatements.length, currentTime()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-courage-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
