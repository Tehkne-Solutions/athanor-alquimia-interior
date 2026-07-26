import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  configureSpiritOrb,
  craftSpiritOrb,
  createSpiritOrbProgress,
  positionSpiritOrb,
  requestSpiritOrbReview,
  resumeSpiritOrb,
  reviewSpiritOrb,
  type SpiritOrbDecision,
  type SpiritOrbDisagreement,
  type SpiritOrbFunction,
  type SpiritOrbProgress,
  type SpiritOrbReturn,
  type SpiritOrbReviewWindow,
  type SpiritOrbVisibleDimension
} from '../domain/spiritOrb';
import type { ReviewOutcome } from '../domain/types';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface SpiritOrbStoreState {
  schemaVersion: number;
  progress?: SpiritOrbProgress;
  start: (sourceReturnKeyId: string) => void;
  selectFunction: (value: SpiritOrbFunction) => void;
  selectVisibleDimension: (value: SpiritOrbVisibleDimension) => void;
  selectDisagreement: (value: SpiritOrbDisagreement) => void;
  selectDecision: (value: SpiritOrbDecision) => void;
  selectReturnMode: (value: SpiritOrbReturn) => void;
  selectReviewWindow: (value: SpiritOrbReviewWindow) => void;
  craft: () => void;
  requestReview: () => void;
  review: (outcome: ReviewOutcome, reflection?: string) => void;
  resume: () => void;
  position: () => void;
  reset: () => void;
}

export const useSpiritOrbStore = create<SpiritOrbStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceReturnKeyId) => {
        const current = get().progress;
        if (current?.sourceReturnKeyId === sourceReturnKeyId) return;
        set({ progress: createSpiritOrbProgress(sourceReturnKeyId, now()) });
      },
      selectFunction: (value) => set((state) => state.progress
        ? { progress: configureSpiritOrb(state.progress, { function: value }, now()) }
        : state),
      selectVisibleDimension: (value) => set((state) => state.progress
        ? { progress: configureSpiritOrb(state.progress, { visibleDimension: value }, now()) }
        : state),
      selectDisagreement: (value) => set((state) => state.progress
        ? { progress: configureSpiritOrb(state.progress, { disagreement: value }, now()) }
        : state),
      selectDecision: (value) => set((state) => state.progress
        ? { progress: configureSpiritOrb(state.progress, { decision: value }, now()) }
        : state),
      selectReturnMode: (value) => set((state) => state.progress
        ? { progress: configureSpiritOrb(state.progress, { returnMode: value }, now()) }
        : state),
      selectReviewWindow: (value) => set((state) => state.progress
        ? { progress: configureSpiritOrb(state.progress, { reviewWindow: value }, now()) }
        : state),
      craft: () => set((state) => state.progress
        ? { progress: craftSpiritOrb(state.progress, now()) }
        : state),
      requestReview: () => set((state) => state.progress
        ? { progress: requestSpiritOrbReview(state.progress, now()) }
        : state),
      review: (outcome, reflection) => set((state) => state.progress
        ? { progress: reviewSpiritOrb(state.progress, outcome, now(), reflection) }
        : state),
      resume: () => set((state) => state.progress
        ? { progress: resumeSpiritOrb(state.progress, now()) }
        : state),
      position: () => set((state) => state.progress
        ? { progress: positionSpiritOrb(state.progress, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-spirit-orb-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
