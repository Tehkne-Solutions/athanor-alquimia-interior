export type WaterLamentField = 'happened' | 'feeling' | 'desire' | 'support';

export type WaterSafetySignalCategory =
  | 'suicide'
  | 'self_harm'
  | 'violence'
  | 'medication'
  | 'medical_emergency'
  | 'command_or_persecution';

export type WaterLamentStatus = 'available' | 'active' | 'completed' | 'safety_interrupted';

export interface WaterLamentDraft {
  happened: string;
  feeling: string;
  desire: string;
  support: string;
  skipped: boolean;
}

export interface WaterSafetySignal {
  category: WaterSafetySignalCategory;
  detectedAt: string;
}

export interface WaterLamentProgress {
  id: 'mission_voice_of_lament_v1';
  status: WaterLamentStatus;
  draft: WaterLamentDraft;
  fragmentCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  safetySignal?: WaterSafetySignal;
}

export type WaterLamentCompletionOutcome = 'completed' | 'safety' | 'invalid';

const criticalPatterns: { category: WaterSafetySignalCategory; patterns: string[] }[] = [
  {
    category: 'suicide',
    patterns: ['quero me matar', 'vou me matar', 'pretendo me matar', 'tirar minha vida', 'acabar com minha vida']
  },
  {
    category: 'self_harm',
    patterns: ['quero me machucar', 'vou me machucar', 'me ferir de proposito', 'cortar meu corpo']
  },
  {
    category: 'violence',
    patterns: ['vou matar alguem', 'quero matar alguem', 'vou machucar alguem', 'quero ferir alguem']
  },
  {
    category: 'medication',
    patterns: ['parei meu remedio', 'vou parar meu remedio', 'nao vou tomar meu remedio', 'suspendi minha medicacao']
  },
  {
    category: 'medical_emergency',
    patterns: ['nao consigo respirar', 'estou tendo um infarto', 'estou convulsionando', 'desmaiei agora']
  },
  {
    category: 'command_or_persecution',
    patterns: ['as vozes mandam', 'uma voz mandou eu', 'estao me perseguindo espiritualmente']
  }
];

const normalize = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

export const createEmptyWaterLamentDraft = (): WaterLamentDraft => ({
  happened: '',
  feeling: '',
  desire: '',
  support: '',
  skipped: false
});

export function createWaterLamentProgress(startedAt: string): WaterLamentProgress {
  return {
    id: 'mission_voice_of_lament_v1',
    status: 'active',
    draft: createEmptyWaterLamentDraft(),
    fragmentCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function updateWaterLamentField(
  progress: WaterLamentProgress,
  field: WaterLamentField,
  value: string,
  updatedAt: string
): WaterLamentProgress {
  return {
    ...progress,
    status: 'active',
    draft: { ...progress.draft, [field]: value, skipped: false },
    safetySignal: undefined,
    updatedAt
  };
}

export function canCompleteWaterLament(draft: WaterLamentDraft): boolean {
  if (draft.skipped) return true;
  return [draft.happened, draft.feeling, draft.desire, draft.support].some((value) => value.trim().length > 0);
}

export function detectWaterSafetySignal(draft: WaterLamentDraft): WaterSafetySignalCategory | undefined {
  const joined = normalize([draft.happened, draft.feeling, draft.desire, draft.support].join(' '));
  if (!joined) return undefined;

  return criticalPatterns.find((entry) => entry.patterns.some((pattern) => joined.includes(pattern)))?.category;
}

export function completeWaterLament(
  progress: WaterLamentProgress,
  completedAt: string
): { progress: WaterLamentProgress; outcome: WaterLamentCompletionOutcome } {
  if (!canCompleteWaterLament(progress.draft)) return { progress, outcome: 'invalid' };

  const safetyCategory = detectWaterSafetySignal(progress.draft);
  if (safetyCategory) {
    return {
      outcome: 'safety',
      progress: {
        ...progress,
        status: 'safety_interrupted',
        draft: createEmptyWaterLamentDraft(),
        fragmentCreated: false,
        safetySignal: { category: safetyCategory, detectedAt: completedAt },
        updatedAt: completedAt
      }
    };
  }

  return {
    outcome: 'completed',
    progress: {
      ...progress,
      status: 'completed',
      fragmentCreated: true,
      completedAt,
      updatedAt: completedAt
    }
  };
}
