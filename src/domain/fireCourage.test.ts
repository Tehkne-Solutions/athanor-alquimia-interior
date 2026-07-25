import { describe, expect, it } from 'vitest';
import {
  canCompleteFireCourage,
  classifyCourageStatement,
  completeFireCourage,
  createFireCourageProgress,
  toggleCourageResource
} from './fireCourage';

const createdAt = '2026-07-25T22:30:00.000Z';

describe('fire courage domain', () => {
  it('starts an active mission linked to the current boundary plate', () => {
    const progress = createFireCourageProgress('boundary-plate-1', createdAt);
    expect(progress.status).toBe('active');
    expect(progress.sourceBoundaryPlateId).toBe('boundary-plate-1');
    expect(progress.proportionalCourageMarkCreated).toBe(false);
  });

  it('stores didactic classifications without assigning a score', () => {
    const progress = createFireCourageProgress('boundary-plate-1', createdAt);
    const next = classifyCourageStatement(progress, 'entry-1', 'proportional_courage', createdAt);
    expect(next.classifications['entry-1']).toBe('proportional_courage');
    expect(next.classificationSkipped).toBe(false);
  });

  it('keeps the none available resource exclusive', () => {
    const progress = createFireCourageProgress('boundary-plate-1', createdAt);
    const withPerson = toggleCourageResource(progress, 'trusted_person', createdAt);
    const withoutResource = toggleCourageResource(withPerson, 'none_available', createdAt);
    expect(withoutResource.resources).toEqual(['none_available']);
  });

  it('does not complete without context, action, resources review and readiness', () => {
    const progress = createFireCourageProgress('boundary-plate-1', createdAt);
    expect(canCompleteFireCourage(progress, 8)).toBe(false);
  });

  it('accepts refusal of classification, no available resource and no action now', () => {
    const progress = {
      ...createFireCourageProgress('boundary-plate-1', createdAt),
      classificationSkipped: true,
      context: 'request_support' as const,
      action: 'no_action' as const,
      resources: ['none_available' as const],
      resourceSelectionCompleted: true,
      readiness: 'delay' as const
    };
    expect(canCompleteFireCourage(progress, 8)).toBe(true);
  });

  it('creates the proportional courage mark only after a complete configuration', () => {
    const progress = {
      ...createFireCourageProgress('boundary-plate-1', createdAt),
      classificationSkipped: true,
      context: 'clarify_request' as const,
      action: 'ask_for_information' as const,
      resources: ['verified_information' as const],
      resourceSelectionCompleted: true,
      readiness: 'smallest_sufficient' as const
    };
    const completed = completeFireCourage(progress, 8, '2026-07-25T22:40:00.000Z');
    expect(completed.status).toBe('completed');
    expect(completed.proportionalCourageMarkCreated).toBe(true);
  });
});
