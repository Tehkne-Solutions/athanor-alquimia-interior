import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  classifySpiritDecisionEntry,
  completeSpiritDecision,
  createSpiritDecisionProgress,
  declineSpiritDecision,
  selectSpiritDecisionScenario,
  setSpiritDecisionChoice,
  setSpiritDecisionPosition,
  setSpiritDecisionReviewCondition,
  setSpiritDecisionReviewWindow,
  setSpiritDecisionRevision,
  skipSpiritDecisionClassification,
  type SpiritDecisionCategory,
  type SpiritDecisionChoice,
  type SpiritDecisionCondition,
  type SpiritDecisionPosition,
  type SpiritDecisionProgress,
  type SpiritDecisionRevision,
  type SpiritDecisionWindow
} from '../domain/spiritDecision';
import type { SpiritDimension } from '../domain/spiritThread';

interface SpiritDecisionStore {
  progress?: SpiritDecisionProgress;
  start: (sourceCouncilId: string) => void;
  classify: (entryId: string, category: SpiritDecisionCategory) => void;
  skipClassification: () => void;
  selectScenario: (scenarioId: string) => void;
  setPosition: (dimension: SpiritDimension, position: SpiritDecisionPosition) => void;
  setChoice: (choice: SpiritDecisionChoice) => void;
  setRevision: (revision: SpiritDecisionRevision) => void;
  setReviewWindow: (window: SpiritDecisionWindow) => void;
  setReviewCondition: (condition: SpiritDecisionCondition) => void;
  declineDecision: () => void;
  complete: (entryCount: number) => void;
  reset: () => void;
}

const now = () => new Date().toISOString();

export const useSpiritDecisionStore = create<SpiritDecisionStore>()(persist((set) => ({
  progress: undefined,
  start: (sourceCouncilId) => set((state) => {
    if (state.progress?.sourceCouncilId === sourceCouncilId) return state;
    return { progress: createSpiritDecisionProgress(sourceCouncilId, now()) };
  }),
  classify: (entryId, category) => set((state) => state.progress
    ? { progress: classifySpiritDecisionEntry(state.progress, entryId, category, now()) }
    : state),
  skipClassification: () => set((state) => state.progress
    ? { progress: skipSpiritDecisionClassification(state.progress, now()) }
    : state),
  selectScenario: (scenarioId) => set((state) => state.progress
    ? { progress: selectSpiritDecisionScenario(state.progress, scenarioId, now()) }
    : state),
  setPosition: (dimension, position) => set((state) => state.progress
    ? { progress: setSpiritDecisionPosition(state.progress, dimension, position, now()) }
    : state),
  setChoice: (choice) => set((state) => state.progress
    ? { progress: setSpiritDecisionChoice(state.progress, choice, now()) }
    : state),
  setRevision: (revision) => set((state) => state.progress
    ? { progress: setSpiritDecisionRevision(state.progress, revision, now()) }
    : state),
  setReviewWindow: (window) => set((state) => state.progress
    ? { progress: setSpiritDecisionReviewWindow(state.progress, window, now()) }
    : state),
  setReviewCondition: (condition) => set((state) => state.progress
    ? { progress: setSpiritDecisionReviewCondition(state.progress, condition, now()) }
    : state),
  declineDecision: () => set((state) => state.progress
    ? { progress: declineSpiritDecision(state.progress, now()) }
    : state),
  complete: (entryCount) => set((state) => state.progress
    ? { progress: completeSpiritDecision(state.progress, entryCount, now()) }
    : state),
  reset: () => set({ progress: undefined })
}), {
  name: 'athanor-spirit-decision-v1'
}));
