import { describe, expect, it } from 'vitest';
import { resolveReviewOutcome } from '../src/domain/review';

describe('resolveReviewOutcome', () => {
  it('integra o ciclo somente após revisão concluída', () => {
    expect(resolveReviewOutcome('integrated')).toEqual({
      itemLifecycle: 'integrated',
      missionStatus: 'integrated',
      shouldAdvanceWorkLevel: true
    });
  });

  it('mantém a revisão aberta quando a ação é ajustada', () => {
    expect(resolveReviewOutcome('adjusted')).toEqual({
      itemLifecycle: 'adjusted',
      missionStatus: 'awaiting_review',
      shouldAdvanceWorkLevel: false
    });
  });

  it('permite repousar sem perder progresso', () => {
    expect(resolveReviewOutcome('resting')).toEqual({
      itemLifecycle: 'awaiting_review',
      missionStatus: 'awaiting_review',
      shouldAdvanceWorkLevel: false
    });
  });
});
