import { describe, expect, it } from 'vitest';
import type { ContinuousCycleInstance } from './continuousCycle';
import {
  advanceContinuousTrail,
  canCompleteContinuousTrailStage,
  chooseNoContinuousTrailTheme,
  createContinuousTrailProgress,
  getContinuousTrailThemeHistory,
  isContinuousTrailThemeResolved,
  keepContinuousTrailTheme,
  pauseContinuousTrail,
  rotateContinuousTrailTheme,
  selectContinuousTrailPractice,
  selectContinuousTrailTheme,
  selectNextContinuousTrailThemeId,
  startContinuousTrail
} from './continuousTrail';

const now = '2026-07-27T00:00:00.000Z';
const later = '2026-07-27T00:05:00.000Z';
const catalogVersion = '1.0.0';
const candidates = ['theme-support', 'theme-transition', 'theme-rest'];

function cycle(): ContinuousCycleInstance {
  return {
    id: 'cycle-theme-1',
    sourceRecordId: 'record-theme-1',
    sourceSpiritCycleId: 'spirit-cycle-theme-1',
    startPoint: 'water',
    sourceMode: 'revisit_practice',
    status: 'active',
    comparison: 'not_compared',
    contentSeed: 'continuous:theme:water',
    activatedAt: now,
    updatedAt: now
  };
}

function started() {
  return startContinuousTrail(
    createContinuousTrailProgress(now),
    cycle(),
    'trail-theme-1',
    'water-trail-v1',
    now,
    '2.0.0'
  );
}

describe('continuousTheme', () => {
  it('inicia um novo Rastro com escolha temática ainda não resolvida', () => {
    const trail = started().trails[0];
    expect(trail.noTheme).toBe(false);
    expect(trail.themeId).toBeUndefined();
    expect(isContinuousTrailThemeResolved(trail)).toBe(false);
  });

  it('exige tema ou ausência explícita para concluir a orientação', () => {
    let progress = started();
    progress = selectContinuousTrailPractice(progress, 'trail-theme-1', 'water-name-tone', later);
    expect(canCompleteContinuousTrailStage(progress.trails[0])).toBe(false);
    const unchanged = advanceContinuousTrail(progress, 'trail-theme-1', 'completed', later);
    expect(unchanged.trails[0].currentStage).toBe('orientation');
  });

  it('seleciona um tema curado e permite concluir a orientação', () => {
    let progress = started();
    progress = selectContinuousTrailPractice(progress, 'trail-theme-1', 'water-name-tone', later);
    progress = selectContinuousTrailTheme(progress, 'trail-theme-1', 'theme-support', catalogVersion, later);
    expect(canCompleteContinuousTrailStage(progress.trails[0])).toBe(true);
    expect(progress.trails[0].themeId).toBe('theme-support');
    expect(getContinuousTrailThemeHistory(progress.trails[0])[0]).toEqual(expect.objectContaining({
      action: 'selected',
      themeId: 'theme-support',
      noTheme: false
    }));
  });

  it('aceita permanecer sem tema como escolha completa', () => {
    let progress = started();
    progress = selectContinuousTrailPractice(progress, 'trail-theme-1', 'water-name-tone', later);
    progress = chooseNoContinuousTrailTheme(progress, 'trail-theme-1', catalogVersion, later);
    expect(progress.trails[0].noTheme).toBe(true);
    expect(canCompleteContinuousTrailStage(progress.trails[0])).toBe(true);
  });

  it('passar a orientação resolve automaticamente a ausência de tema', () => {
    const progress = advanceContinuousTrail(started(), 'trail-theme-1', 'passed', later);
    const trail = progress.trails[0];
    expect(trail.currentStage).toBe('observation');
    expect(trail.noTheme).toBe(true);
    expect(getContinuousTrailThemeHistory(trail)[0]?.action).toBe('passed_without_theme');
  });

  it('mantém explicitamente o tema atual sem alterar a seleção', () => {
    let progress = selectContinuousTrailTheme(started(), 'trail-theme-1', 'theme-support', catalogVersion, later);
    progress = keepContinuousTrailTheme(progress, 'trail-theme-1', catalogVersion, '2026-07-27T00:10:00.000Z');
    const trail = progress.trails[0];
    expect(trail.themeId).toBe('theme-support');
    expect(getContinuousTrailThemeHistory(trail).slice(-1)[0]?.action).toBe('kept');
  });

  it('solicita outro tema sem repetir imediatamente o atual', () => {
    let progress = selectContinuousTrailTheme(started(), 'trail-theme-1', 'theme-support', catalogVersion, later);
    progress = rotateContinuousTrailTheme(progress, 'trail-theme-1', candidates, catalogVersion, '2026-07-27T00:10:00.000Z');
    expect(progress.trails[0].themeId).not.toBe('theme-support');
    expect(progress.trails[0].themeRotationCount).toBe(1);
    expect(getContinuousTrailThemeHistory(progress.trails[0]).slice(-1)[0]?.action).toBe('rotated');
  });

  it('produz o mesmo próximo tema para a mesma semente e contador', () => {
    const first = selectNextContinuousTrailThemeId('seed-theme', 'theme-support', candidates, 1, catalogVersion);
    const second = selectNextContinuousTrailThemeId('seed-theme', 'theme-support', candidates, 1, catalogVersion);
    expect(first).toBe(second);
    expect(first).not.toBe('theme-support');
  });

  it('preserva prática, etapa e resultados ao trocar o tema', () => {
    let progress = started();
    progress = selectContinuousTrailPractice(progress, 'trail-theme-1', 'water-name-tone', later);
    progress = selectContinuousTrailTheme(progress, 'trail-theme-1', 'theme-support', catalogVersion, later);
    progress = advanceContinuousTrail(progress, 'trail-theme-1', 'completed', later);
    progress = rotateContinuousTrailTheme(progress, 'trail-theme-1', candidates, catalogVersion, '2026-07-27T00:10:00.000Z');
    const trail = progress.trails[0];
    expect(trail.practiceId).toBe('water-name-tone');
    expect(trail.currentStage).toBe('observation');
    expect(trail.stages.orientation.result).toBe('completed');
  });

  it('não troca tema durante pausa nem depois da conclusão', () => {
    let paused = selectContinuousTrailTheme(started(), 'trail-theme-1', 'theme-support', catalogVersion, later);
    paused = pauseContinuousTrail(paused, 'trail-theme-1', later);
    const pausedBefore = paused.trails[0];
    paused = rotateContinuousTrailTheme(paused, 'trail-theme-1', candidates, catalogVersion, '2026-07-27T00:10:00.000Z');
    expect(paused.trails[0]).toEqual(pausedBefore);

    let completed = started();
    completed = advanceContinuousTrail(completed, 'trail-theme-1', 'passed', later);
    completed = advanceContinuousTrail(completed, 'trail-theme-1', 'passed', later);
    completed = advanceContinuousTrail(completed, 'trail-theme-1', 'passed', later);
    const completedBefore = completed.trails[0];
    completed = selectContinuousTrailTheme(completed, 'trail-theme-1', 'theme-support', catalogVersion, '2026-07-27T00:10:00.000Z');
    expect(completed.trails[0]).toEqual(completedBefore);
  });

  it('mantém compatibilidade com Rastro legado sem campos temáticos', () => {
    const progress = started();
    const legacyTrail = progress.trails[0];
    delete legacyTrail.themeCatalogVersion;
    delete legacyTrail.themeId;
    delete legacyTrail.noTheme;
    delete legacyTrail.themeRotationCount;
    delete legacyTrail.themeHistory;
    legacyTrail.practiceId = 'water-name-tone';
    expect(isContinuousTrailThemeResolved(legacyTrail)).toBe(true);
    expect(canCompleteContinuousTrailStage(legacyTrail)).toBe(true);
    expect(getContinuousTrailThemeHistory(legacyTrail)).toEqual([]);
  });
});
