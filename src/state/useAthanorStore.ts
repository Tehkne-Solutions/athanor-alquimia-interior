import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { resolveReviewOutcome } from '../domain/review';
import {
  completeWaterNaming as completeWaterNamingProgress,
  createEmptyWaterCheckIn,
  toggleWaterEmotion as toggleWaterEmotionSelection
} from '../domain/water';
import type {
  AthanorCharacter,
  AthanorPreferences,
  AstralTemple,
  CharacterAppearance,
  CharacterClass,
  CharacterOrigin,
  ClassificationEntry,
  CraftedItem,
  MissionProgress,
  ReviewEntry,
  ReviewOutcome,
  SymbolicLayer,
  TempleTheme,
  WaterEmotionId,
  WaterJourneyProgress,
  WaterNeedId
} from '../domain/types';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

const defaultAppearance: CharacterAppearance = {
  body: 'body-01',
  skin: 'skin-03',
  hair: 'hair-02',
  garment: 'garment-scribe',
  accent: 'amber',
  symbol: 'lamp'
};

const defaultPreferences: AthanorPreferences = {
  locale: 'pt-BR',
  appearance: 'temple',
  reducedMotion: false,
  highContrast: false,
  biblicalMode: 'balanced',
  enabledLayers: ['sefer', 'kabbalah', 'iching', 'tarot']
};

const createTemple = (theme: TempleTheme): AstralTemple => ({
  id: crypto.randomUUID(),
  theme,
  activeRoomId: 'atrium',
  restorationLevel: 1,
  placedItems: [],
  rooms: [
    { roomId: 'atrium', name: 'Átrio da Presença', status: 'active', restorationProgress: 30, placedItemIds: [] },
    { roomId: 'proverbs-library', name: 'Biblioteca dos Provérbios', status: 'available', restorationProgress: 8, activeMissionId: 'mission_word_before_response_v1', placedItemIds: [] },
    { roomId: 'psalms-chamber', name: 'Câmara dos Salmos', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'forge', name: 'Forja dos Elementos', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'garden', name: 'Jardim Interior', status: 'dormant', restorationProgress: 0, placedItemIds: [] },
    { roomId: 'central-tree', name: 'Árvore Central', status: 'dormant', restorationProgress: 0, placedItemIds: [] }
  ],
  createdAt: now(),
  updatedAt: now(),
  version: '1.2.0'
});

interface DraftCharacter {
  name: string;
  title: string;
  origin: CharacterOrigin;
  primaryClass: CharacterClass;
  appearance: CharacterAppearance;
}

interface AthanorStoreState {
  schemaVersion: number;
  contentVersion: string;
  initialized: boolean;
  onboardingCompleted: boolean;
  limitsAccepted: boolean;
  preferences: AthanorPreferences;
  draftCharacter: DraftCharacter;
  character?: AthanorCharacter;
  temple?: AstralTemple;
  activeMission?: MissionProgress;
  waterJourney?: WaterJourneyProgress;
  inventory: CraftedItem[];
  reviews: ReviewEntry[];
  activePassageId: string;
  setInitialized: (value: boolean) => void;
  acceptLimits: () => void;
  updatePreferences: (updates: Partial<AthanorPreferences>) => void;
  toggleLayer: (layer: SymbolicLayer) => void;
  updateDraftCharacter: (updates: Partial<DraftCharacter>) => void;
  createCharacter: () => void;
  foundTemple: (theme: TempleTheme) => void;
  completeOnboarding: () => void;
  startMission: () => void;
  classifyEntry: (entry: ClassificationEntry, category: ClassificationEntry['correctCategory']) => void;
  setMissionIntention: (intention: string) => void;
  setMissionAction: (action: string) => void;
  completeClassification: () => void;
  craftLamp: () => void;
  placeLamp: () => void;
  completeLampReview: (outcome: ReviewOutcome, reflection?: string, adjustedAction?: string) => void;
  startWaterJourney: () => void;
  toggleWaterEmotion: (emotion: WaterEmotionId) => void;
  setWaterIntensity: (intensity?: 1 | 2 | 3 | 4 | 5) => void;
  setWaterNeed: (need?: WaterNeedId) => void;
  skipWaterCheckIn: () => void;
  completeWaterNaming: () => void;
  resetAll: () => Promise<void>;
}

export const useAthanorStore = create<AthanorStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 3,
      contentVersion: 'bible-core-seed-1.2.0',
      initialized: false,
      onboardingCompleted: false,
      limitsAccepted: false,
      preferences: defaultPreferences,
      draftCharacter: {
        name: '',
        title: 'Artesão do Átrio',
        origin: 'reader',
        primaryClass: 'scribe',
        appearance: defaultAppearance
      },
      inventory: [],
      reviews: [],
      activePassageId: 'proverb_listen_before_reply_01',
      setInitialized: (value) => set({ initialized: value }),
      acceptLimits: () => set({ limitsAccepted: true }),
      updatePreferences: (updates) => set((state) => ({ preferences: { ...state.preferences, ...updates } })),
      toggleLayer: (layer) => set((state) => ({
        preferences: {
          ...state.preferences,
          enabledLayers: state.preferences.enabledLayers.includes(layer)
            ? state.preferences.enabledLayers.filter((item) => item !== layer)
            : [...state.preferences.enabledLayers, layer]
        }
      })),
      updateDraftCharacter: (updates) => set((state) => ({
        draftCharacter: { ...state.draftCharacter, ...updates }
      })),
      createCharacter: () => {
        const draft = get().draftCharacter;
        set({
          character: {
            id: crypto.randomUUID(),
            name: draft.name.trim() || 'Peregrino',
            title: draft.title,
            origin: draft.origin,
            primaryClass: draft.primaryClass,
            appearance: draft.appearance,
            workLevel: 'foundation',
            createdAt: now(),
            updatedAt: now(),
            version: '1.2.0'
          }
        });
      },
      foundTemple: (theme) => set({ temple: createTemple(theme) }),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      startMission: () => set({
        activeMission: {
          id: 'mission_word_before_response_v1',
          status: 'active',
          currentStep: 1,
          classifications: {},
          startedAt: now(),
          updatedAt: now()
        }
      }),
      classifyEntry: (entry, category) => set((state) => ({
        activeMission: state.activeMission ? {
          ...state.activeMission,
          classifications: { ...state.activeMission.classifications, [entry.id]: category },
          updatedAt: now()
        } : state.activeMission
      })),
      setMissionIntention: (intention) => set((state) => ({
        activeMission: state.activeMission ? { ...state.activeMission, intention, updatedAt: now() } : state.activeMission
      })),
      setMissionAction: (action) => set((state) => ({
        activeMission: state.activeMission ? { ...state.activeMission, action, updatedAt: now() } : state.activeMission
      })),
      completeClassification: () => set((state) => ({
        activeMission: state.activeMission ? { ...state.activeMission, currentStep: 2, updatedAt: now() } : state.activeMission
      })),
      craftLamp: () => {
        const mission = get().activeMission;
        if (!mission?.action) return;
        const existing = get().inventory.find((item) => item.id === 'item_clear_word_lamp_v1');
        if (existing) return;
        set((state) => ({
          inventory: [...state.inventory, {
            id: 'item_clear_word_lamp_v1',
            recipeId: 'recipe_clear_word_lamp_v1',
            name: 'Lâmpada da Palavra Clara',
            category: 'journey_instrument',
            lifecycle: 'active',
            functions: [
              'Abrir missões de comunicação',
              'Destacar proveniência',
              'Comparar versões de uma mensagem',
              'Restaurar a Biblioteca dos Provérbios'
            ],
            restrictions: [
              'Não revela verdades ocultas',
              'Não prevê acontecimentos',
              'Não confirma intenções de terceiros',
              'Não substitui comunicação real'
            ],
            action: mission.action,
            createdAt: now(),
            updatedAt: now(),
            version: '1.2.0'
          }],
          activeMission: mission ? { ...mission, status: 'awaiting_action', currentStep: 3, updatedAt: now() } : mission
        }));
      },
      placeLamp: () => set((state) => {
        if (!state.temple) return state;
        const rooms = state.temple.rooms.map((room) => room.roomId === 'proverbs-library'
          ? { ...room, status: 'restored' as const, restorationProgress: 100, placedItemIds: [...new Set([...room.placedItemIds, 'item_clear_word_lamp_v1'])] }
          : room.roomId === 'atrium'
            ? { ...room, restorationProgress: Math.max(room.restorationProgress, 55) }
            : room);
        const inventory = state.inventory.map((item) => item.id === 'item_clear_word_lamp_v1'
          ? { ...item, lifecycle: 'awaiting_review' as const, updatedAt: now() }
          : item);
        return {
          temple: {
            ...state.temple,
            rooms,
            placedItems: [...new Set([...state.temple.placedItems, 'item_clear_word_lamp_v1'])],
            restorationLevel: 2,
            updatedAt: now()
          },
          inventory,
          activeMission: state.activeMission ? {
            ...state.activeMission,
            status: 'awaiting_review',
            currentStep: 4,
            reviewDueAt: now(),
            updatedAt: now()
          } : state.activeMission
        };
      }),
      completeLampReview: (outcome, reflection, adjustedAction) => set((state) => {
        const mission = state.activeMission;
        const item = state.inventory.find((candidate) => candidate.id === 'item_clear_word_lamp_v1');
        if (!mission || !item) return state;

        const resolution = resolveReviewOutcome(outcome);
        const reviewId = crypto.randomUUID();
        const normalizedReflection = reflection?.trim() || undefined;
        const normalizedAdjustedAction = adjustedAction?.trim() || undefined;
        const nextAction = outcome === 'adjusted' ? normalizedAdjustedAction || mission.action : mission.action;
        const review: ReviewEntry = {
          id: reviewId,
          missionId: mission.id,
          itemId: item.id,
          outcome,
          reflection: normalizedReflection,
          previousAction: mission.action,
          adjustedAction: outcome === 'adjusted' ? nextAction : undefined,
          createdAt: now()
        };
        const temple = outcome === 'integrated' && state.temple
          ? {
              ...state.temple,
              rooms: state.temple.rooms.map((room) => room.roomId === 'psalms-chamber'
                ? {
                    ...room,
                    status: 'available' as const,
                    restorationProgress: Math.max(room.restorationProgress, 8),
                    activeMissionId: 'mission_name_waters_v1'
                  }
                : room),
              restorationLevel: Math.max(state.temple.restorationLevel, 3),
              updatedAt: now()
            }
          : state.temple;

        return {
          reviews: [...state.reviews, review],
          activeMission: {
            ...mission,
            action: nextAction,
            status: resolution.missionStatus,
            lastReviewId: reviewId,
            reviewDueAt: outcome === 'integrated' ? undefined : now(),
            updatedAt: now()
          },
          inventory: state.inventory.map((candidate) => candidate.id === item.id
            ? { ...candidate, action: nextAction, lifecycle: resolution.itemLifecycle, updatedAt: now() }
            : candidate),
          character: resolution.shouldAdvanceWorkLevel && state.character
            ? { ...state.character, workLevel: 'first_fire', updatedAt: now() }
            : state.character,
          temple
        };
      }),
      startWaterJourney: () => {
        const lampIntegrated = get().inventory.some((item) => item.id === 'item_clear_word_lamp_v1' && item.lifecycle === 'integrated');
        const chamberAvailable = get().temple?.rooms.some((room) => room.roomId === 'psalms-chamber' && room.status !== 'dormant' && room.status !== 'hidden');
        if (!lampIntegrated || !chamberAvailable) return;
        if (get().waterJourney) return;
        const startedAt = now();
        set({
          waterJourney: {
            id: 'mission_name_waters_v1',
            status: 'active',
            checkIn: createEmptyWaterCheckIn(),
            namedDropCreated: false,
            startedAt,
            updatedAt: startedAt
          }
        });
      },
      toggleWaterEmotion: (emotion) => set((state) => state.waterJourney ? ({
        waterJourney: {
          ...state.waterJourney,
          checkIn: toggleWaterEmotionSelection(state.waterJourney.checkIn, emotion),
          updatedAt: now()
        }
      }) : state),
      setWaterIntensity: (intensity) => set((state) => state.waterJourney ? ({
        waterJourney: {
          ...state.waterJourney,
          checkIn: { ...state.waterJourney.checkIn, intensity, skipped: false },
          updatedAt: now()
        }
      }) : state),
      setWaterNeed: (need) => set((state) => state.waterJourney ? ({
        waterJourney: {
          ...state.waterJourney,
          checkIn: { ...state.waterJourney.checkIn, need, skipped: false },
          updatedAt: now()
        }
      }) : state),
      skipWaterCheckIn: () => set((state) => state.waterJourney ? ({
        waterJourney: {
          ...state.waterJourney,
          checkIn: { emotions: [], skipped: true },
          updatedAt: now()
        }
      }) : state),
      completeWaterNaming: () => set((state) => {
        if (!state.waterJourney) return state;
        return { waterJourney: completeWaterNamingProgress(state.waterJourney, now()) };
      }),
      resetAll: async () => {
        set({
          initialized: true,
          onboardingCompleted: false,
          limitsAccepted: false,
          preferences: defaultPreferences,
          draftCharacter: {
            name: '',
            title: 'Artesão do Átrio',
            origin: 'reader',
            primaryClass: 'scribe',
            appearance: defaultAppearance
          },
          character: undefined,
          temple: undefined,
          activeMission: undefined,
          waterJourney: undefined,
          inventory: [],
          reviews: [],
          activePassageId: 'proverb_listen_before_reply_01'
        });
      }
    }),
    {
      name: 'athanor-app-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        contentVersion: state.contentVersion,
        onboardingCompleted: state.onboardingCompleted,
        limitsAccepted: state.limitsAccepted,
        preferences: state.preferences,
        draftCharacter: state.draftCharacter,
        character: state.character,
        temple: state.temple,
        activeMission: state.activeMission,
        waterJourney: state.waterJourney,
        inventory: state.inventory,
        reviews: state.reviews,
        activePassageId: state.activePassageId
      }),
      onRehydrateStorage: () => (state) => state?.setInitialized(true)
    }
  )
);
