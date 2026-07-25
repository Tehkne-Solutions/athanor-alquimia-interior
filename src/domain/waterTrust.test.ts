import { describe, expect, it } from 'vitest';
import {
  canCompleteWaterTrust,
  classifyWaterTrustStatement,
  completeWaterTrust,
  createWaterTrustProgress,
  evaluateWaterTrust,
  selectWaterCareAction,
  skipWaterTrustClassification,
  toggleWaterSupportResource,
  type WaterTrustStatement
} from './waterTrust';

const statements: WaterTrustStatement[] = [
  {
    id: 'support',
    text: 'Posso pedir companhia para esta conversa.',
    suggestedCategory: 'support',
    explanation: 'Aponta um recurso possível.'
  },
  {
    id: 'guarantee',
    text: 'Nada ruim acontecerá.',
    suggestedCategory: 'guarantee',
    explanation: 'Promete um resultado que não pode ser assegurado.'
  },
  {
    id: 'prediction',
    text: 'A conversa certamente terminará bem.',
    suggestedCategory: 'prediction',
    explanation: 'Afirma um desfecho futuro.'
  }
];

describe('water trust mission', () => {
  it('starts without assuming that support is available', () => {
    const progress = createWaterTrustProgress('journey-1', '2026-07-25T00:00:00.000Z');
    expect(progress.selectedResources).toEqual([]);
    expect(progress.careAction).toBeUndefined();
    expect(progress.bridgeCreated).toBe(false);
  });

  it('maps optional resources and a care action without creating guarantees', () => {
    let progress = createWaterTrustProgress('journey-1', '2026-07-25T00:00:00.000Z');
    progress = toggleWaterSupportResource(progress, 'trusted_person', '2026-07-25T00:01:00.000Z');
    progress = selectWaterCareAction(progress, 'ask_for_company', '2026-07-25T00:02:00.000Z');

    expect(progress.selectedResources).toEqual(['trusted_person']);
    expect(progress.careAction).toBe('ask_for_company');
  });

  it('does not complete until every fictional statement is classified', () => {
    let progress = createWaterTrustProgress('journey-1', '2026-07-25T00:00:00.000Z');
    progress = classifyWaterTrustStatement(progress, 'support', 'support', '2026-07-25T00:01:00.000Z');
    expect(canCompleteWaterTrust(progress, statements)).toBe(false);
    expect(completeWaterTrust(progress, statements, '2026-07-25T00:02:00.000Z').status).toBe('active');
  });

  it('allows completion without classification and without a selected resource', () => {
    let progress = createWaterTrustProgress('journey-1', '2026-07-25T00:00:00.000Z');
    progress = skipWaterTrustClassification(progress, '2026-07-25T00:01:00.000Z');
    progress = completeWaterTrust(progress, statements, '2026-07-25T00:02:00.000Z');

    expect(progress.status).toBe('completed');
    expect(progress.bridgeCreated).toBe(true);
    expect(progress.selectedResources).toEqual([]);
  });

  it('uses differences only as didactic feedback', () => {
    let progress = createWaterTrustProgress('journey-1', '2026-07-25T00:00:00.000Z');
    progress = classifyWaterTrustStatement(progress, 'support', 'prediction', '2026-07-25T00:01:00.000Z');
    progress = classifyWaterTrustStatement(progress, 'guarantee', 'guarantee', '2026-07-25T00:02:00.000Z');
    progress = classifyWaterTrustStatement(progress, 'prediction', 'prediction', '2026-07-25T00:03:00.000Z');

    const evaluation = evaluateWaterTrust(progress, statements);
    const completed = completeWaterTrust(progress, statements, '2026-07-25T00:04:00.000Z');

    expect(evaluation.aligned).toBe(2);
    expect(evaluation.differences).toHaveLength(1);
    expect(completed.bridgeCreated).toBe(true);
  });
});
