export type FireTimelinePhase = 'trigger' | 'body_signal' | 'impulse' | 'gesture';
export type FireUrgencyCategory = 'immediate_safety' | 'time_sensitive' | 'perceived_pressure' | 'insufficient_information';
export type FireIntervalChoice = 'one_minute' | 'ask_for_time' | 'step_away' | 'write_without_sending' | 'no_interval';
export type FireExitChoice = 'leave_safely' | 'contact_trusted_person' | 'seek_emergency_support' | 'delay_response' | 'no_action';
export type FireIntervalStatus = 'active' | 'completed';

export interface FireIntervalProgress {
  id: 'mission_before_the_gesture_v1';
  sourceNamedFlameId: string;
  status: FireIntervalStatus;
  timeline: Record<string, FireTimelinePhase>;
  timelineSkipped: boolean;
  urgency: Record<string, FireUrgencyCategory>;
  urgencySkipped: boolean;
  interval?: FireIntervalChoice;
  exit?: FireExitChoice;
  intervalEmberCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const createFireIntervalProgress = (
  sourceNamedFlameId: string,
  createdAt: string
): FireIntervalProgress => ({
  id: 'mission_before_the_gesture_v1',
  sourceNamedFlameId,
  status: 'active',
  timeline: {},
  timelineSkipped: false,
  urgency: {},
  urgencySkipped: false,
  intervalEmberCreated: false,
  startedAt: createdAt,
  updatedAt: createdAt
});

export function classifyTimelineEntry(
  progress: FireIntervalProgress,
  entryId: string,
  phase: FireTimelinePhase,
  updatedAt: string
): FireIntervalProgress {
  return {
    ...progress,
    timeline: { ...progress.timeline, [entryId]: phase },
    timelineSkipped: false,
    updatedAt
  };
}

export function classifyUrgencyEntry(
  progress: FireIntervalProgress,
  entryId: string,
  category: FireUrgencyCategory,
  updatedAt: string
): FireIntervalProgress {
  return {
    ...progress,
    urgency: { ...progress.urgency, [entryId]: category },
    urgencySkipped: false,
    updatedAt
  };
}

export function canCompleteFireInterval(
  progress: FireIntervalProgress,
  timelineCount: number,
  urgencyCount: number
): boolean {
  const timelineReady = progress.timelineSkipped || Object.keys(progress.timeline).length === timelineCount;
  const urgencyReady = progress.urgencySkipped || Object.keys(progress.urgency).length === urgencyCount;

  return Boolean(timelineReady && urgencyReady && progress.interval && progress.exit);
}

export function completeFireInterval(
  progress: FireIntervalProgress,
  timelineCount: number,
  urgencyCount: number,
  completedAt: string
): FireIntervalProgress {
  if (!canCompleteFireInterval(progress, timelineCount, urgencyCount)) return progress;

  return {
    ...progress,
    status: 'completed',
    intervalEmberCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
