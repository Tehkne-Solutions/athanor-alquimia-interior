export type NewWorkStartPoint = 'word' | 'water' | 'fire' | 'earth' | 'spirit' | 'rest';
export type NewWorkMode = 'revisit_practice' | 'open_new_cycle' | 'observe_only' | 'rest_without_start';

export interface NewWorkRecord {
  id: string;
  sourceSpiritCycleId: string;
  startPoint: NewWorkStartPoint;
  mode: NewWorkMode;
  createdAt: string;
}

export interface ContinuousJourneyProgress {
  id: 'continuous_temple_v1';
  sourceSpiritCycleId: string;
  selectedStartPoint?: NewWorkStartPoint;
  selectedMode?: NewWorkMode;
  records: NewWorkRecord[];
  startedAt: string;
  updatedAt: string;
}

export function createContinuousJourneyProgress(sourceSpiritCycleId: string, startedAt: string): ContinuousJourneyProgress {
  return {
    id: 'continuous_temple_v1',
    sourceSpiritCycleId,
    records: [],
    startedAt,
    updatedAt: startedAt
  };
}

export function selectContinuousStartPoint(
  progress: ContinuousJourneyProgress,
  startPoint: NewWorkStartPoint,
  updatedAt: string
): ContinuousJourneyProgress {
  const selectedMode = startPoint === 'rest'
    ? 'rest_without_start'
    : progress.selectedMode === 'rest_without_start'
      ? undefined
      : progress.selectedMode;
  return { ...progress, selectedStartPoint: startPoint, selectedMode, updatedAt };
}

export function selectContinuousMode(
  progress: ContinuousJourneyProgress,
  mode: NewWorkMode,
  updatedAt: string
): ContinuousJourneyProgress {
  if (progress.selectedStartPoint === 'rest' && mode !== 'rest_without_start') return progress;
  if (progress.selectedStartPoint && progress.selectedStartPoint !== 'rest' && mode === 'rest_without_start') return progress;
  return { ...progress, selectedMode: mode, updatedAt };
}

export function canRegisterNewWork(progress: ContinuousJourneyProgress): boolean {
  if (!progress.selectedStartPoint || !progress.selectedMode) return false;
  if (progress.selectedStartPoint === 'rest') return progress.selectedMode === 'rest_without_start';
  return progress.selectedMode !== 'rest_without_start';
}

export function registerNewWork(
  progress: ContinuousJourneyProgress,
  recordId: string,
  createdAt: string
): ContinuousJourneyProgress {
  if (!canRegisterNewWork(progress) || !progress.selectedStartPoint || !progress.selectedMode) return progress;
  const record: NewWorkRecord = {
    id: recordId,
    sourceSpiritCycleId: progress.sourceSpiritCycleId,
    startPoint: progress.selectedStartPoint,
    mode: progress.selectedMode,
    createdAt
  };
  return {
    ...progress,
    records: [...progress.records, record],
    selectedStartPoint: undefined,
    selectedMode: undefined,
    updatedAt: createdAt
  };
}
