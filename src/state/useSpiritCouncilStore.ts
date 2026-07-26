import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { spiritCouncilEntries } from '../content/spiritCouncil';
import {
  classifySpiritCouncilEntry,
  completeSpiritCouncil,
  createSpiritCouncilProgress,
  declineSpiritCouncil,
  selectSpiritCouncilScenario,
  setSpiritCouncilBasis,
  setSpiritCouncilDecision,
  setSpiritCouncilDisagreement,
  setSpiritCouncilVoice,
  skipSpiritCouncilClassification,
  type SpiritCouncilBasis,
  type SpiritCouncilCategory,
  type SpiritCouncilDecision,
  type SpiritCouncilDisagreement,
  type SpiritCouncilProgress,
  type SpiritCouncilVoiceState
} from '../domain/spiritCouncil';
import type { SpiritDimension } from '../domain/spiritThread';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface SpiritCouncilStoreState {
  schemaVersion: number;
  progress?: SpiritCouncilProgress;
  start: (sourceCenterId: string) => void;
  classify: (entryId: string, category: SpiritCouncilCategory) => void;
  skipClassification: () => void;
  selectScenario: (scenarioId: string) => void;
  setVoice: (dimension: SpiritDimension, voiceState: SpiritCouncilVoiceState) => void;
  setDisagreement: (disagreement: SpiritCouncilDisagreement) => void;
  setBasis: (basis: SpiritCouncilBasis) => void;
  setDecision: (decision: SpiritCouncilDecision) => void;
  declineCouncil: () => void;
  complete: () => void;
  reset: () => void;
}

export const useSpiritCouncilStore = create<SpiritCouncilStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceCenterId) => {
        const current = get().progress;
        if (current?.sourceCenterId === sourceCenterId) return;
        set({ progress: createSpiritCouncilProgress(sourceCenterId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifySpiritCouncilEntry(state.progress, entryId, category, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: skipSpiritCouncilClassification(state.progress, now()) }
        : state),
      selectScenario: (scenarioId) => set((state) => state.progress
        ? { progress: selectSpiritCouncilScenario(state.progress, scenarioId, now()) }
        : state),
      setVoice: (dimension, voiceState) => set((state) => state.progress
        ? { progress: setSpiritCouncilVoice(state.progress, dimension, voiceState, now()) }
        : state),
      setDisagreement: (disagreement) => set((state) => state.progress
        ? { progress: setSpiritCouncilDisagreement(state.progress, disagreement, now()) }
        : state),
      setBasis: (basis) => set((state) => state.progress
        ? { progress: setSpiritCouncilBasis(state.progress, basis, now()) }
        : state),
      setDecision: (decision) => set((state) => state.progress
        ? { progress: setSpiritCouncilDecision(state.progress, decision, now()) }
        : state),
      declineCouncil: () => set((state) => state.progress
        ? { progress: declineSpiritCouncil(state.progress, now()) }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeSpiritCouncil(state.progress, spiritCouncilEntries.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-spirit-council-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
