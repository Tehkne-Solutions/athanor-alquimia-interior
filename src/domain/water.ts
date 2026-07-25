import type { WaterCheckIn, WaterEmotionId, WaterJourneyProgress, WaterNeedId } from './types';

export const waterEmotionIds: WaterEmotionId[] = [
  'fear',
  'hope',
  'sadness',
  'gratitude',
  'anger',
  'loneliness',
  'trust',
  'confusion'
];

export const waterNeedIds: WaterNeedId[] = [
  'expression',
  'silence',
  'rest',
  'support',
  'clarity',
  'time',
  'unknown'
];

export const createEmptyWaterCheckIn = (): WaterCheckIn => ({
  emotions: [],
  skipped: false
});

export function toggleWaterEmotion(checkIn: WaterCheckIn, emotion: WaterEmotionId): WaterCheckIn {
  const emotions = checkIn.emotions.includes(emotion)
    ? checkIn.emotions.filter((item) => item !== emotion)
    : [...checkIn.emotions, emotion];

  return { ...checkIn, emotions, skipped: false };
}

export function canCompleteWaterNaming(checkIn: WaterCheckIn): boolean {
  return checkIn.skipped || checkIn.emotions.length > 0;
}

export function completeWaterNaming(journey: WaterJourneyProgress, completedAt: string): WaterJourneyProgress {
  if (!canCompleteWaterNaming(journey.checkIn)) return journey;

  return {
    ...journey,
    status: 'named',
    namedDropCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
