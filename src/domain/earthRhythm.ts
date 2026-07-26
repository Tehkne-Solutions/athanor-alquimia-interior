export type EarthRhythmCategory = 'rhythm' | 'rush' | 'repetition' | 'pressure';
export type EarthRhythmFrequencyId = 'once' | 'twice' | 'three_times' | 'flexible' | 'no_frequency';
export type EarthRhythmActionUnitId = 'observe_only' | 'five_minutes' | 'one_item' | 'one_line' | 'no_action_unit';
export type EarthRhythmRestId = 'equal_pause' | 'longer_pause' | 'next_day' | 'until_ready' | 'no_rest_plan';
export type EarthRhythmResourceModeId = 'use_current' | 'reduce_scope' | 'wait_resource' | 'pause_cycle';
export type EarthRhythmResumeId = 'next_available' | 'after_resource_change' | 'after_review' | 'no_resume';
export type EarthRhythmDecisionId = 'try_one_cycle' | 'wait' | 'pause' | 'archive' | 'no_action';
export type EarthRhythmStatus = 'active' | 'completed';

export interface EarthRhythmProgress {
  id: 'mission_sustainable_rhythm_v1';
  sourceResourceBasketId: string;
  status: EarthRhythmStatus;
  classifications: Record<string, EarthRhythmCategory>;
  classificationSkipped: boolean;
  frequency?: EarthRhythmFrequencyId;
  actionUnit?: EarthRhythmActionUnitId;
  rest?: EarthRhythmRestId;
  resourceMode?: EarthRhythmResourceModeId;
  resume?: EarthRhythmResumeId;
  decision?: EarthRhythmDecisionId;
  rhythmCompassCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createEarthRhythmProgress(sourceResourceBasketId: string, startedAt: string): EarthRhythmProgress {
  return {
    id: 'mission_sustainable_rhythm_v1',
    sourceResourceBasketId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    rhythmCompassCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifyEarthRhythmEntry(progress: EarthRhythmProgress, entryId: string, category: EarthRhythmCategory, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: { ...progress.classifications, [entryId]: category }, classificationSkipped: false, updatedAt };
}

export function skipEarthRhythmClassification(progress: EarthRhythmProgress, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function setEarthRhythmFrequency(progress: EarthRhythmProgress, frequency: EarthRhythmFrequencyId, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  const decision = frequency === 'no_frequency' && progress.decision === 'try_one_cycle' ? undefined : progress.decision;
  return { ...progress, frequency, decision, updatedAt };
}

export function setEarthRhythmActionUnit(progress: EarthRhythmProgress, actionUnit: EarthRhythmActionUnitId, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  const decision = actionUnit === 'no_action_unit' && progress.decision === 'try_one_cycle' ? undefined : progress.decision;
  return { ...progress, actionUnit, decision, updatedAt };
}

export function setEarthRhythmRest(progress: EarthRhythmProgress, rest: EarthRhythmRestId, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  const decision = rest === 'no_rest_plan' && progress.decision === 'try_one_cycle' ? undefined : progress.decision;
  return { ...progress, rest, decision, updatedAt };
}

export function setEarthRhythmResourceMode(progress: EarthRhythmProgress, resourceMode: EarthRhythmResourceModeId, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  const decision = ['wait_resource', 'pause_cycle'].includes(resourceMode) && progress.decision === 'try_one_cycle' ? undefined : progress.decision;
  return { ...progress, resourceMode, decision, updatedAt };
}

export function setEarthRhythmResume(progress: EarthRhythmProgress, resume: EarthRhythmResumeId, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  const decision = resume === 'no_resume' && progress.decision === 'try_one_cycle' ? undefined : progress.decision;
  return { ...progress, resume, decision, updatedAt };
}

export function setEarthRhythmDecision(progress: EarthRhythmProgress, decision: EarthRhythmDecisionId, updatedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed') return progress;
  if (decision === 'try_one_cycle') {
    if (progress.frequency === 'no_frequency' || progress.actionUnit === 'no_action_unit' || progress.rest === 'no_rest_plan' || progress.resume === 'no_resume') return progress;
    if (progress.resourceMode === 'wait_resource' || progress.resourceMode === 'pause_cycle') return progress;
  }
  return { ...progress, decision, updatedAt };
}

export function canCompleteEarthRhythm(progress: EarthRhythmProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped || Object.keys(progress.classifications).length === entryCount;
  const tryCompatible = progress.decision !== 'try_one_cycle' || (
    progress.frequency !== 'no_frequency'
    && progress.actionUnit !== 'no_action_unit'
    && progress.rest !== 'no_rest_plan'
    && progress.resume !== 'no_resume'
    && progress.resourceMode !== 'wait_resource'
    && progress.resourceMode !== 'pause_cycle'
  );
  return Boolean(
    classificationReady
    && progress.frequency
    && progress.actionUnit
    && progress.rest
    && progress.resourceMode
    && progress.resume
    && progress.decision
    && tryCompatible
  );
}

export function completeEarthRhythm(progress: EarthRhythmProgress, entryCount: number, completedAt: string): EarthRhythmProgress {
  if (progress.status === 'completed' || !canCompleteEarthRhythm(progress, entryCount)) return progress;
  return { ...progress, status: 'completed', rhythmCompassCreated: true, completedAt, updatedAt: completedAt };
}
