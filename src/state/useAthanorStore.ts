import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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
  SymbolicLayer,
  TempleTheme
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
  version: '1.0.0'
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
  inventory: CraftedItem[];
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
  resetAll: () => Promise<void>;
}

export const useAthanorStore = create<AthanorStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      contentVersion: 'bible-core-seed-1.0.0',
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
            version: '1.0.0'
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
            version: '1.0.0'
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
          ? { ...item, lifecycle: 'integrated' as const, updatedAt: now() }
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
          activeMission: state.activeMission ? { ...state.activeMission, status: 'integrated', currentStep: 4, updatedAt: now() } : state.activeMission
        };
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
          inventory: [],
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
        inventory: state.inventory,
        activePassageId: state.activePassageId
      }),
      onRehydrateStorage: () => (state) => state?.setInitialized(true)
    }
  )
);
