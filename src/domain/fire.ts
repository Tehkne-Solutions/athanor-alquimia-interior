export type FireEmotionId =
  | 'anger'
  | 'courage'
  | 'frustration'
  | 'urgency'
  | 'enthusiasm'
  | 'fear';

export type FireNeedId =
  | 'pause'
  | 'protection'
  | 'clarity'
  | 'expression'
  | 'boundary'
  | 'movement'
  | 'support'
  | 'unknown';

export type FireActionId =
  | 'breathe_and_wait'
  | 'write_without_sending'
  | 'step_away'
  | 'ask_for_time'
  | 'state_boundary_calmly'
  | 'seek_support'
  | 'no_action';

export type FirePauseId = 'three_breaths' | 'physical_distance' | 'brief_silence' | 'none';
export type FireClassificationCategory = 'emotion' | 'impulse' | 'need' | 'action';
export type FireMissionStatus = 'active' | 'completed';

export interface FireMissionProgress {
  id: 'mission_name_the_flame_v1';
  sourceWaterCycleId: string;
  status: FireMissionStatus;
  emotions: FireEmotionId[];
  intensity?: 1 | 2 | 3 | 4 | 5;
  checkInSkipped: boolean;
  classifications: Record<string, FireClassificationCategory>;
  classificationSkipped: boolean;
  pause?: FirePauseId;
  need?: FireNeedId;
  action?: FireActionId;
  namedFlameCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const createFireMissionProgress = (
  sourceWaterCycleId: string,
  createdAt: string
): FireMissionProgress => ({
  id: 'mission_name_the_flame_v1',
  sourceWaterCycleId,
  status: 'active',
  emotions: [],
  checkInSkipped: false,
  classifications: {},
  classificationSkipped: false,
  namedFlameCreated: false,
  startedAt: createdAt,
  updatedAt: createdAt
});

export function toggleFireEmotion(
  progress: FireMissionProgress,
  emotion: FireEmotionId,
  updatedAt: string
): FireMissionProgress {
  const emotions = progress.emotions.includes(emotion)
    ? progress.emotions.filter((item) => item !== emotion)
    : [...progress.emotions, emotion];

  return {
    ...progress,
    emotions,
    checkInSkipped: false,
    updatedAt
  };
}

export function skipFireCheckIn(progress: FireMissionProgress, updatedAt: string): FireMissionProgress {
  return {
    ...progress,
    emotions: [],
    intensity: undefined,
    checkInSkipped: true,
    updatedAt
  };
}

export function classifyFireEntry(
  progress: FireMissionProgress,
  entryId: string,
  category: FireClassificationCategory,
  updatedAt: string
): FireMissionProgress {
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function canCompleteFireMission(progress: FireMissionProgress, entryCount: number): boolean {
  const checkInReady = progress.checkInSkipped || progress.emotions.length > 0;
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;

  return Boolean(
    checkInReady
      && classificationReady
      && progress.pause
      && progress.need
      && progress.action
  );
}

export function completeFireMission(
  progress: FireMissionProgress,
  entryCount: number,
  completedAt: string
): FireMissionProgress {
  if (!canCompleteFireMission(progress, entryCount)) return progress;

  return {
    ...progress,
    status: 'completed',
    namedFlameCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
