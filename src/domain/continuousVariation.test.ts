import { describe, expect, it } from 'vitest';
import type { ContinuousCycleInstance } from './continuousCycle';
import {
  advanceContinuousTrail,
  createContinuousTrailProgress,
  getContinuousTrailVariantHistory,
  keepContinuousTrailVariant,
  pauseContinuousTrail,
  rotateContinuousTrailVariant,
  selectContinuousTrailPractice,
  selectNextContinuousTrailVariantId,
  startContinuousTrail
} from './continuousTrail';

const now = '2026-07-26T22:00:00.000Z';
const later = '2026-07-26T22:05:00.000Z';
const catalogVersion = '2.0.0';
const candidates = ['water-trail-v1', 'water-trail-v2'];

function cycle(): ContinuousCycleInstance {
  return {
    id: 'cycle-variation-1',
    sourceRecordId: 'record-variation-1',
    sourceSpiritCycleId: 'spirit-cycle-variation-1',
    startPoint: 'water',
    sourceMode: 'revisit_practice',
    status: 'active',
    comparison: 'not_compared',
    contentSeed: 'continuous:variation:water',
    activatedAt: now,
    updatedAt: now
  };
}

function started() {
  return startContinuousTrail(
    createContinuousTrailProgress(now),
    cycle(),
    'trail-variation-1',
    'water-trail-v1',
    now,
    catalogVersion
  );
}

describe('continuousVariation', () => {
  it('registra versão e seleção inicial no novo Rastro', () => {
    const trail = started().trails[0];
    expect(trail.catalogVersion).toBe(catalogVersion);
    expect(trail.variantRotationCount).toBe(0);
    expect(getContinuousTrailVariantHistory(trail)).toEqual([expect.objectContaining({
      sequence: 0,
      variantId: 'water-trail-v1',
      action: 'initial',
      catalogVersion
    })]);
  });

  it('mantém explicitamente a variante sem trocar o conteúdo', () => {
    const progress = keepContinuousTrailVariant(started(), 'trail-variation-1', catalogVersion, later);
    const trail = progress.trails[0];
    expect(trail.contentVariantId).toBe('water-trail-v1');
    expect(getContinuousTrailVariantHistory(trail).at(-1)).toEqual(expect.objectContaining({
      variantId: 'water-trail-v1',
      action: 'kept'
    }));
  });

  it('solicita outra variante sem repetir imediatamente a atual', () => {
    const progress = rotateContinuousTrailVariant(started(), 'trail-variation-1', candidates, catalogVersion, later);
    const trail = progress.trails[0];
    expect(trail.contentVariantId).toBe('water-trail-v2');
    expect(trail.variantRotationCount).toBe(1);
    expect(getContinuousTrailVariantHistory(trail).at(-1)?.action).toBe('rotated');
  });

  it('produz a mesma próxima variante para a mesma semente e contador', () => {
    const first = selectNextContinuousTrailVariantId('seed-fixed', 'water-trail-v1', candidates, 1, catalogVersion);
    const second = selectNextContinuousTrailVariantId('seed-fixed', 'water-trail-v1', candidates, 1, catalogVersion);
    expect(first).toBe(second);
    expect(first).not.toBe('water-trail-v1');
  });

  it('evita repetição imediata em rotações sucessivas', () => {
    let progress = started();
    progress = rotateContinuousTrailVariant(progress, 'trail-variation-1', candidates, catalogVersion, later);
    const firstRotated = progress.trails[0].contentVariantId;
    progress = rotateContinuousTrailVariant(progress, 'trail-variation-1', candidates, catalogVersion, '2026-07-26T22:10:00.000Z');
    expect(progress.trails[0].contentVariantId).not.toBe(firstRotated);
  });

  it('preserva prática, etapa e resultados ao trocar a variante', () => {
    let progress = started();
    progress = selectContinuousTrailPractice(progress, 'trail-variation-1', 'water-name-tone', later);
    progress = advanceContinuousTrail(progress, 'trail-variation-1', 'completed', later);
    progress = rotateContinuousTrailVariant(progress, 'trail-variation-1', candidates, catalogVersion, '2026-07-26T22:10:00.000Z');
    const trail = progress.trails[0];
    expect(trail.practiceId).toBe('water-name-tone');
    expect(trail.currentStage).toBe('observation');
    expect(trail.stages.orientation.result).toBe('completed');
  });

  it('não troca variante enquanto o Rastro está pausado', () => {
    let progress = pauseContinuousTrail(started(), 'trail-variation-1', later);
    const before = progress.trails[0];
    progress = rotateContinuousTrailVariant(progress, 'trail-variation-1', candidates, catalogVersion, '2026-07-26T22:10:00.000Z');
    expect(progress.trails[0]).toEqual(before);
  });

  it('não troca variante depois que o Rastro foi concluído', () => {
    let progress = started();
    progress = advanceContinuousTrail(progress, 'trail-variation-1', 'passed', later);
    progress = advanceContinuousTrail(progress, 'trail-variation-1', 'passed', later);
    progress = advanceContinuousTrail(progress, 'trail-variation-1', 'passed', later);
    const before = progress.trails[0];
    progress = rotateContinuousTrailVariant(progress, 'trail-variation-1', candidates, catalogVersion, '2026-07-26T22:10:00.000Z');
    expect(progress.trails[0]).toEqual(before);
  });

  it('reconstrói histórico inicial para Rastro persistido antes do catálogo versionado', () => {
    const legacyTrail = started().trails[0];
    legacyTrail.catalogVersion = undefined;
    legacyTrail.variantHistory = undefined;
    legacyTrail.variantRotationCount = undefined;
    expect(getContinuousTrailVariantHistory(legacyTrail)).toEqual([expect.objectContaining({
      variantId: 'water-trail-v1',
      action: 'initial',
      catalogVersion: '1.0.0'
    })]);
  });
});
