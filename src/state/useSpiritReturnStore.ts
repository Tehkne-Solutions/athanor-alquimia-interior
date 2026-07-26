import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  classifySpiritReturnEntry,
  completeSpiritReturn,
  createSpiritReturnProgress,
  declineSpiritReturn,
  selectSpiritReturnScenario,
  setSpiritReturnBasis,
  setSpiritReturnContext,
  setSpiritReturnDisposition,
  setSpiritReturnObservation,
  setSpiritReturnResources,
  skipSpiritReturnClassification,
  type SpiritReturnCategory,
  type SpiritReturnContext,
  type SpiritReturnDisposition,
  type SpiritReturnObservation,
  type SpiritReturnProgress,
  type SpiritReturnResources,
  type SpiritReturnReviewBasis
} from '../domain/spiritReturn';

interface SpiritReturnStore {
  progress?: SpiritReturnProgress;
  start: (sourceDecisionId: string) => void;
  classify: (entryId: string, category: SpiritReturnCategory) => void;
  skipClassification: () => void;
  selectScenario: (scenarioId: string) => void;
  setObservation: (observation: SpiritReturnObservation) => void;
  setContext: (context: SpiritReturnContext) => void;
  setResources: (resources: SpiritReturnResources) => void;
  setBasis: (basis: SpiritReturnReviewBasis) => void;
  setDisposition: (disposition: SpiritReturnDisposition) => void;
  declineReturn: () => void;
  complete: (entryCount: number) => void;
  reset: () => void;
}

const now = () => new Date().toISOString();

export const useSpiritReturnStore = create<SpiritReturnStore>()(persist((set) => ({
  progress: undefined,
  start: (sourceDecisionId) => set((state) => {
    if (state.progress?.sourceDecisionId === sourceDecisionId) return state;
    return { progress: createSpiritReturnProgress(sourceDecisionId, now()) };
  }),
  classify: (entryId, category) => set((state) => state.progress
    ? { progress: classifySpiritReturnEntry(state.progress, entryId, category, now()) }
    : state),
  skipClassification: () => set((state) => state.progress
    ? { progress: skipSpiritReturnClassification(state.progress, now()) }
    : state),
  selectScenario: (scenarioId) => set((state) => state.progress
    ? { progress: selectSpiritReturnScenario(state.progress, scenarioId, now()) }
    : state),
  setObservation: (observation) => set((state) => state.progress
    ? { progress: setSpiritReturnObservation(state.progress, observation, now()) }
    : state),
  setContext: (context) => set((state) => state.progress
    ? { progress: setSpiritReturnContext(state.progress, context, now()) }
    : state),
  setResources: (resources) => set((state) => state.progress
    ? { progress: setSpiritReturnResources(state.progress, resources, now()) }
    : state),
  setBasis: (basis) => set((state) => state.progress
    ? { progress: setSpiritReturnBasis(state.progress, basis, now()) }
    : state),
  setDisposition: (disposition) => set((state) => state.progress
    ? { progress: setSpiritReturnDisposition(state.progress, disposition, now()) }
    : state),
  declineReturn: () => set((state) => state.progress
    ? { progress: declineSpiritReturn(state.progress, now()) }
    : state),
  complete: (entryCount) => set((state) => state.progress
    ? { progress: completeSpiritReturn(state.progress, entryCount, now()) }
    : state),
  reset: () => set({ progress: undefined })
}), {
  name: 'athanor-spirit-return-v1'
}));
