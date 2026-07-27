import { describe, expect, it } from 'vitest';
import { continuousThemeCyclePackages } from '../content/continuousThemeCycle';
import type { ContinuousTrailInstance } from './continuousTrail';
import {
  advanceContinuousThemeCycle,
  createContinuousThemeCycleProgress,
  declineContinuousThemeCycle,
  endContinuousThemeCycleEarly,
  findOpenContinuousThemeCycle,
  getContinuousThemeCyclesByTrail,
  pauseContinuousThemeCycle,
  resumeContinuousThemeCycle,
  selectContinuousThemeCyclePassages,
  startContinuousThemeCycle
} from './continuousThemeCycle';

const now = '2026-07-27T14:00:00.000Z';
const later = '2026-07-27T14:05:00.000Z';
const catalogVersion = '1.0.0';

function trail(overrides: Partial<ContinuousTrailInstance> = {}): ContinuousTrailInstance {
  return {
    id: 'trail-theme-cycle-1',
    sourceCycleInstanceId: 'cycle-1',
    sourceRecordId: 'record-1',
    sourceSpiritCycleId: 'spirit-cycle-1',
    startPoint: 'water',
    contentSeed: 'continuous:theme-cycle:water',
    contentVariantId: 'water-trail-v1',
    catalogVersion: '2.0.0',
    variantRotationCount: 0,
    variantHistory: [],
    themeCatalogVersion: '1.0.0',
    themeId: 'clarity',
    noTheme: false,
    themeRotationCount: 0,
    themeHistory: [],
    status: 'completed',
    currentStage: 'review',
    practiceId: 'water-name-tone',
    noPractice: false,
    stages: {
      orientation: { stage: 'orientation', result: 'completed', completedAt: now },
      observation: { stage: 'observation', result: 'completed', completedAt: now },
      review: { stage: 'review', result: 'completed', completedAt: now }
    },
    continuousTrailTraceCreated: true,
    startedAt: now,
    updatedAt: now,
    completedAt: now,
    ...overrides
  };
}

const clarityPackage = continuousThemeCyclePackages.find((item) => item.id === 'package-clarity-window')!;
const supportPackage = continuousThemeCyclePackages.find((item) => item.id === 'package-support-bridge')!;
const noThemePackage = continuousThemeCyclePackages.find((item) => item.id === 'package-open-no-theme')!;

function started(depth: 1 | 2 | 3 = 3) {
  return startContinuousThemeCycle(
    createContinuousThemeCycleProgress(now),
    trail(),
    clarityPackage,
    depth,
    'theme-cycle-1',
    catalogVersion,
    now
  );
}

describe('continuousThemeCycle', () => {
  it('seleciona uma passagem única para profundidade 1', () => {
    const instance = started(1).instances[0];
    expect(instance.depth).toBe(1);
    expect(instance.passages).toHaveLength(1);
    expect(new Set(instance.passages.map((item) => item.id)).size).toBe(1);
  });

  it('seleciona três passagens sem repetição para profundidade 3', () => {
    const instance = started(3).instances[0];
    expect(instance.passages).toHaveLength(3);
    expect(new Set(instance.passages.map((item) => item.id)).size).toBe(3);
    expect(new Set(instance.passages.map((item) => item.stage)).size).toBe(3);
  });

  it('produz a mesma ordem para a mesma semente e sequência', () => {
    const first = selectContinuousThemeCyclePassages('seed-a', clarityPackage.id, clarityPackage.passages, 3, 0);
    const second = selectContinuousThemeCyclePassages('seed-a', clarityPackage.id, clarityPackage.passages, 3, 0);
    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
  });

  it('não inicia antes da conclusão do Rastro', () => {
    const initial = createContinuousThemeCycleProgress(now);
    const result = startContinuousThemeCycle(
      initial,
      trail({ status: 'active', continuousTrailTraceCreated: false, completedAt: undefined }),
      clarityPackage,
      2,
      'theme-cycle-1',
      catalogVersion,
      now
    );
    expect(result).toEqual(initial);
  });

  it('bloqueia pacote incompatível com o tema atual', () => {
    const initial = createContinuousThemeCycleProgress(now);
    const result = startContinuousThemeCycle(initial, trail(), supportPackage, 2, 'theme-cycle-1', catalogVersion, now);
    expect(result).toEqual(initial);
  });

  it('aceita pacote sem tema quando o Rastro escolheu ausência temática', () => {
    const result = startContinuousThemeCycle(
      createContinuousThemeCycleProgress(now),
      trail({ themeId: undefined, noTheme: true }),
      noThemePackage,
      2,
      'theme-cycle-1',
      catalogVersion,
      now
    );
    expect(result.instances[0].sourceNoTheme).toBe(true);
    expect(result.instances[0].packageId).toBe('package-open-no-theme');
  });

  it('impede duas instâncias abertas para o mesmo Rastro', () => {
    const first = started(2);
    const second = startContinuousThemeCycle(first, trail(), clarityPackage, 1, 'theme-cycle-2', catalogVersion, later);
    expect(second.instances).toHaveLength(1);
    expect(findOpenContinuousThemeCycle(second, trail().id)?.id).toBe('theme-cycle-1');
  });

  it('avança por passagens concluídas ou passadas até completar', () => {
    let progress = started(2);
    progress = advanceContinuousThemeCycle(progress, 'theme-cycle-1', 'completed', later);
    expect(progress.instances[0].currentPassageIndex).toBe(1);
    progress = advanceContinuousThemeCycle(progress, 'theme-cycle-1', 'passed', '2026-07-27T14:10:00.000Z');
    expect(progress.instances[0].status).toBe('completed');
    expect(progress.instances[0].passages.map((item) => item.result)).toEqual(['completed', 'passed']);
  });

  it('pausa e retoma sem apagar passagens', () => {
    let progress = started(3);
    progress = advanceContinuousThemeCycle(progress, 'theme-cycle-1', 'completed', later);
    progress = pauseContinuousThemeCycle(progress, 'theme-cycle-1', '2026-07-27T14:10:00.000Z');
    expect(progress.instances[0].status).toBe('paused');
    expect(progress.instances[0].passages[0].result).toBe('completed');
    progress = resumeContinuousThemeCycle(progress, 'theme-cycle-1', '2026-07-27T14:15:00.000Z');
    expect(progress.instances[0].status).toBe('active');
    expect(progress.instances[0].currentPassageIndex).toBe(1);
  });

  it('encerra antecipadamente sem apagar o histórico', () => {
    let progress = started(3);
    progress = advanceContinuousThemeCycle(progress, 'theme-cycle-1', 'completed', later);
    progress = endContinuousThemeCycleEarly(progress, 'theme-cycle-1', '2026-07-27T14:10:00.000Z');
    expect(progress.instances[0].status).toBe('completed');
    expect(progress.instances[0].endedEarly).toBe(true);
    expect(progress.instances[0].passages[0].result).toBe('completed');
    expect(progress.instances[0].passages[1].result).toBe('pending');
  });

  it('registra Nenhum ciclo adicional como resultado completo', () => {
    const progress = declineContinuousThemeCycle(
      createContinuousThemeCycleProgress(now),
      trail(),
      'theme-cycle-declined',
      catalogVersion,
      now
    );
    expect(progress.instances[0].status).toBe('declined');
    expect(progress.instances[0].depth).toBe(0);
    expect(progress.instances[0].passages).toEqual([]);
  });

  it('mantém histórico de múltiplos ciclos depois do encerramento', () => {
    let progress = started(1);
    progress = advanceContinuousThemeCycle(progress, 'theme-cycle-1', 'completed', later);
    progress = startContinuousThemeCycle(
      progress,
      trail(),
      clarityPackage,
      2,
      'theme-cycle-2',
      catalogVersion,
      '2026-07-27T14:10:00.000Z'
    );
    expect(getContinuousThemeCyclesByTrail(progress, trail().id)).toHaveLength(2);
    expect(progress.instances[1].passages.map((item) => item.id)).not.toEqual(progress.instances[0].passages.map((item) => item.id));
  });
});
