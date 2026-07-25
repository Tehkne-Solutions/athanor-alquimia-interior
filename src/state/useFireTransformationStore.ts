import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fireTransformationStatements } from '../content/fireTransformation';
import {
  classifyTransformationStatement,
  completeFireTransformation,
  createFireTransformationProgress,
  type FireTransformationAction,
  type FireTransformationDecision,
  type FireTransformationObject,
  type FireTransformationProgress,
  type FireTransformationReview,
  type FireTransformationSafeguard,
  type FireTransformationStatementCategory
} from '../domain/fireTransformation';
import { idbStateStorage } from '../storage/idbStorage';

const currentTime = () => new Date().toISOString();

interface FireTransformationStoreState {
  schemaVersion: number;
  progress?: FireTransformationProgress;
  start: (sourceCourageMarkId: string) => void;
  classify: (entryId: string, category: FireTransformationStatementCategory) => void;
  skipClassification: () => void;
  setObject: (object: FireTransformationObject) => void;
  setDecision: (decision: FireTransformationDecision) => void;
  setAction: (action: FireTransformationAction) => void;
  setSafeguard: (safeguard: FireTransformationSafeguard) => void;
  setReview: (review: FireTransformationReview) => void;
  complete: () => void;
  reset: () => void;
}

export const useFireTransformationStore = create<FireTransformationStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceCourageMarkId) => {
        const current = get().progress;
        if (current?.sourceCourageMarkId === sourceCourageMarkId) return;
        set({ progress: createFireTransformationProgress(sourceCourageMarkId, currentTime()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifyTransformationStatement(state.progress, entryId, category, currentTime()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: { ...state.progress, classifications: {}, classificationSkipped: true, updatedAt: currentTime() } }
        : state),
      setObject: (object) => set((state) => state.progress
        ? { progress: { ...state.progress, object, updatedAt: currentTime() } }
        : state),
      setDecision: (decision) => set((state) => state.progress
        ? { progress: { ...state.progress, decision, updatedAt: currentTime() } }
        : state),
      setAction: (action) => set((state) => state.progress
        ? { progress: { ...state.progress, action, updatedAt: currentTime() } }
        : state),
      setSafeguard: (safeguard) => set((state) => state.progress
        ? { progress: { ...state.progress, safeguard, updatedAt: currentTime() } }
        : state),
      setReview: (review) => set((state) => state.progress
        ? { progress: { ...state.progress, review, updatedAt: currentTime() } }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeFireTransformation(state.progress, fireTransformationStatements.length, currentTime()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-transformation-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
