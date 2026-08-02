import { z } from 'zod';

export const provenanceClassSchema = z.enum(['BIB', 'SRC', 'TRD', 'HIS', 'HER', 'CMP', 'ATH', 'USR']);
export type ProvenanceClass = 'BIB' | 'SRC' | 'TRD' | 'HIS' | 'HER' | 'CMP' | 'ATH' | 'USR';

export const symbolicLayerSchema = z.enum(['sefer', 'kabbalah', 'iching', 'tarot']);
export type SymbolicLayer = 'sefer' | 'kabbalah' | 'iching' | 'tarot';

export const characterClassSchema = z.enum(['scribe', 'artisan', 'guardian', 'navigator', 'mediator', 'pilgrim']);
export type CharacterClass = 'scribe' | 'artisan' | 'guardian' | 'navigator' | 'mediator' | 'pilgrim';

export const characterOriginSchema = z.enum(['reader', 'traveler', 'builder', 'keeper', 'artificer', 'contemplative']);
export type CharacterOrigin = 'reader' | 'traveler' | 'builder' | 'keeper' | 'artificer' | 'contemplative';

export const templeThemeSchema = z.enum(['mineral', 'luminal', 'living']);
export type TempleTheme = 'mineral' | 'luminal' | 'living';

export const biblicalModeSchema = z.enum(['devotional', 'study', 'rpg', 'balanced', 'cultural', 'authorial']);
export type BiblicalMode = 'devotional' | 'study' | 'rpg' | 'balanced' | 'cultural' | 'authorial';

export const missionStatusSchema = z.enum([
  'available',
  'active',
  'paused',
  'awaiting_action',
  'awaiting_review',
  'completed',
  'integrated'
]);
export type MissionStatus = 'available' | 'active' | 'paused' | 'awaiting_action' | 'awaiting_review' | 'completed' | 'integrated';

export const itemLifecycleSchema = z.enum([
  'recipe',
  'discovered',
  'incomplete',
  'created',
  'active',
  'awaiting_review',
  'adjusted',
  'resting',
  'integrated',
  'memorial',
  'archived'
]);
export type ItemLifecycle = 'recipe' | 'discovered' | 'incomplete' | 'created' | 'active' | 'awaiting_review' | 'adjusted' | 'resting' | 'integrated' | 'memorial' | 'archived';

export type ReviewOutcome = 'integrated' | 'adjusted' | 'resting';

export type WaterEmotionId =
  | 'fear'
  | 'hope'
  | 'sadness'
  | 'gratitude'
  | 'anger'
  | 'loneliness'
  | 'trust'
  | 'confusion';

export type WaterNeedId =
  | 'expression'
  | 'silence'
  | 'rest'
  | 'support'
  | 'clarity'
  | 'time'
  | 'unknown';

export type WaterJourneyStatus = 'available' | 'active' | 'named';

export interface WaterCheckIn {
  emotions: WaterEmotionId[];
  intensity?: 1 | 2 | 3 | 4 | 5;
  need?: WaterNeedId;
  skipped: boolean;
}

export interface WaterJourneyProgress {
  id: 'mission_name_waters_v1';
  status: WaterJourneyStatus;
  checkIn: WaterCheckIn;
  namedDropCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ProvenanceEntry {
  id: string;
  label: string;
  class: ProvenanceClass;
  explanation: string;
  sourceLabel?: string;
}

export interface SymbolicNode {
  id: string;
  name: string;
  category: 'biblical' | 'principle' | 'sefirah' | 'element' | 'letter' | 'trigram' | 'archetype' | 'athanor';
  description: string;
  provenance: ProvenanceEntry;
  layer?: SymbolicLayer;
  fallbackNodeId?: string;
}

export interface BiblicalUnit {
  id: string;
  reference: string;
  title: string;
  principle: string;
  context: string;
  themes: string[];
  application: string;
  provenance: ProvenanceEntry[];
}

export interface CharacterAppearance {
  body: string;
  skin: string;
  hair: string;
  garment: string;
  accent: string;
  symbol: string;
}

export interface AthanorCharacter {
  id: string;
  name: string;
  title: string;
  origin: CharacterOrigin;
  primaryClass: CharacterClass;
  appearance: CharacterAppearance;
  workLevel: 'foundation' | 'first_fire' | 'form' | 'construction' | 'integration' | 'new_work';
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface TempleRoomState {
  roomId: string;
  name: string;
  status: 'hidden' | 'dormant' | 'available' | 'active' | 'restored';
  restorationProgress: number;
  activeMissionId?: string;
  placedItemIds: string[];
}

export interface AstralTemple {
  id: string;
  theme: TempleTheme;
  rooms: TempleRoomState[];
  activeRoomId: string;
  placedItems: string[];
  restorationLevel: number;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface ClassificationEntry {
  id: string;
  text: string;
  correctCategory: 'fact' | 'interpretation' | 'prediction' | 'intention';
}

export interface MissionProgress {
  id: string;
  status: MissionStatus;
  currentStep: number;
  classifications: Record<string, ClassificationEntry['correctCategory']>;
  intention?: string;
  action?: string;
  reviewDueAt?: string;
  lastReviewId?: string;
  startedAt: string;
  updatedAt: string;
}

export interface ReviewEntry {
  id: string;
  missionId: string;
  itemId: string;
  outcome: ReviewOutcome;
  reflection?: string;
  previousAction?: string;
  adjustedAction?: string;
  createdAt: string;
}

export interface CraftedItem {
  id: string;
  recipeId: string;
  name: string;
  category: 'journey_instrument';
  lifecycle: ItemLifecycle;
  functions: string[];
  restrictions: string[];
  action?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface AthanorPreferences {
  locale: 'pt-BR';
  appearance: 'temple' | 'codex' | 'system';
  reducedMotion: boolean;
  highContrast: boolean;
  biblicalMode: BiblicalMode;
  enabledLayers: SymbolicLayer[];
}
