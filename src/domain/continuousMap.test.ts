import { describe, expect, it } from 'vitest';
import type { ContinuousThemeCycleInstance } from './continuousThemeCycle';
import type { ContinuousTrailInstance } from './continuousTrail';
import {
  buildContinuousMapItems,
  compareContinuousMapItems,
  createContinuousMapExport,
  defaultContinuousMapFilters,
  filterContinuousMapItems,
  groupContinuousMapItems
} from './continuousMap';

const startedAt = '2026-07-27T15:00:00.000Z';
const completedAt = '2026-07-27T15:10:00.000Z';

function trail(overrides: Partial<ContinuousTrailInstance> = {}): ContinuousTrailInstance {
  return {
    id: 'trail-1',
    sourceCycleInstanceId: 'continuous-cycle-1',
    sourceRecordId: 'new-work-1',
    sourceSpiritCycleId: 'spirit-cycle-1',
    startPoint: 'earth',
    contentSeed: 'seed-earth',
    contentVariantId: 'earth-trail-v1',
    catalogVersion: '2.0.0',
    variantRotationCount: 0,
    variantHistory: [],
    themeCatalogVersion: '1.0.0',
    themeId: 'theme-clarity',
    noTheme: false,
    themeRotationCount: 0,
    themeHistory: [],
    status: 'completed',
    currentStage: 'review',
    practiceId: 'earth-small-step',
    noPractice: false,
    stages: {
      orientation: { stage: 'orientation', result: 'completed', completedAt: startedAt },
      observation: { stage: 'observation', result: 'passed', completedAt: startedAt },
      review: { stage: 'review', result: 'completed', completedAt }
    },
    continuousTrailTraceCreated: true,
    startedAt,
    updatedAt: completedAt,
    completedAt,
    ...overrides
  };
}

function themeCycle(overrides: Partial<ContinuousThemeCycleInstance> = {}): ContinuousThemeCycleInstance {
  return {
    id: 'theme-cycle-1',
    sourceTrailId: 'trail-1',
    sourceCycleInstanceId: 'continuous-cycle-1',
    sourceRecordId: 'new-work-1',
    sourceSpiritCycleId: 'spirit-cycle-1',
    startPoint: 'earth',
    sourceThemeId: 'theme-clarity',
    sourceNoTheme: false,
    sourceVariantId: 'earth-trail-v1',
    packageId: 'package-clarity-window',
    packageLabel: 'Janela da Clareza Provisória',
    catalogVersion: '1.0.0',
    depth: 2,
    passages: [
      { id: 'passage-1', stage: 'orientation', label: 'Primeira', prompt: 'Prompt', sequence: 0, result: 'completed', resolvedAt: startedAt },
      { id: 'passage-2', stage: 'observation', label: 'Segunda', prompt: 'Prompt', sequence: 1, result: 'passed', resolvedAt: completedAt }
    ],
    currentPassageIndex: 1,
    status: 'completed',
    endedEarly: false,
    createdAt: startedAt,
    updatedAt: completedAt,
    completedAt,
    ...overrides
  };
}

describe('continuousMap', () => {
  it('projeta Rastros e ciclos em uma linha do tempo única', () => {
    const items = buildContinuousMapItems([trail()], [themeCycle()]);
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.kind)).toEqual(['trail', 'theme-cycle']);
    expect(items[1].passageSummary).toEqual({ completed: 1, passed: 1, pending: 0 });
  });

  it('preserva ciclo órfão como desconhecido e não vinculado', () => {
    const items = buildContinuousMapItems([], [themeCycle({ sourceTrailId: 'missing-trail' })]);
    expect(items[0].linked).toBe(false);
    expect(items[0].status).toBe('unknown');
  });

  it('distingue ciclo encerrado antecipadamente como incompleto', () => {
    const items = buildContinuousMapItems([trail()], [themeCycle({
      endedEarly: true,
      passages: [
        { id: 'passage-1', stage: 'orientation', label: 'Primeira', prompt: 'Prompt', sequence: 0, result: 'completed' },
        { id: 'passage-2', stage: 'observation', label: 'Segunda', prompt: 'Prompt', sequence: 1, result: 'pending' }
      ]
    })]);
    expect(items[1].status).toBe('incomplete');
  });

  it('preserva Rastro concluído sem componente como incompleto', () => {
    const items = buildContinuousMapItems([trail({ continuousTrailTraceCreated: false })], []);
    expect(items[0].status).toBe('incomplete');
  });

  it('filtra por tipo, elemento, tema, pacote, estado e busca', () => {
    const items = buildContinuousMapItems([trail()], [themeCycle()]);
    const filtered = filterContinuousMapItems(items, {
      ...defaultContinuousMapFilters,
      kind: 'theme-cycle',
      startPoint: 'earth',
      themeId: 'theme-clarity',
      packageId: 'package-clarity-window',
      status: 'completed',
      query: 'janela'
    });
    expect(filtered.map((item) => item.id)).toEqual(['theme-cycle-1']);
  });

  it('mantém ausência temática como filtro explícito', () => {
    const noThemeTrail = trail({ id: 'trail-no-theme', themeId: undefined, noTheme: true });
    const items = buildContinuousMapItems([noThemeTrail], []);
    const filtered = filterContinuousMapItems(items, { ...defaultContinuousMapFilters, themeId: 'no-theme' });
    expect(filtered).toHaveLength(1);
  });

  it('agrupa sem ordenar por quantidade ou desempenho', () => {
    const items = buildContinuousMapItems([
      trail(),
      trail({ id: 'trail-water', startPoint: 'water', themeId: 'theme-support', contentVariantId: 'water-v1' })
    ], [themeCycle()]);
    const groups = groupContinuousMapItems(items, 'element');
    expect(groups.map((group) => group.id)).toEqual(['earth', 'water']);
    expect(groups[0].items).toHaveLength(2);
  });

  it('compara somente igualdade, diferença ou desconhecimento', () => {
    const items = buildContinuousMapItems([trail()], [themeCycle()]);
    const comparison = compareContinuousMapItems(items[0], items[1]);
    expect(comparison.find((row) => row.dimension === 'element')?.relation).toBe('same');
    expect(comparison.find((row) => row.dimension === 'kind')?.relation).toBe('different');
    expect(comparison.find((row) => row.dimension === 'depth')?.relation).toBe('unknown');
  });

  it('exporta somente o recorte fornecido e declara política sem ranking', () => {
    const items = buildContinuousMapItems([trail()], [themeCycle()]);
    const exported = createContinuousMapExport(items.slice(1), defaultContinuousMapFilters, completedAt);
    expect(exported.schema).toBe('athanor-continuous-map-export-v1');
    expect(exported.policy).toBe('descriptive-local-no-ranking-v1');
    expect(exported.totals).toEqual({ items: 1, trails: 0, themeCycles: 1, linked: 1, unlinked: 0 });
  });

  it('não adiciona score, ranking ou tendência ao payload', () => {
    const items = buildContinuousMapItems([trail()], [themeCycle()]);
    const serialized = JSON.stringify(createContinuousMapExport(items, defaultContinuousMapFilters, completedAt));
    expect(serialized).not.toMatch(/score|ranking|trend|streak/i);
  });
});
