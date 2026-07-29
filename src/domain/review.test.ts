import { describe, expect, it } from 'vitest';
import { resolveReviewOutcome } from './review';

describe('resolveReviewOutcome', () => {
  it('integra o item e permite avançar o nível da Obra', () => {
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

  it('preserva o ciclo para retomada quando fica em repouso', () => {
    expect(resolveReviewOutcome('resting')).toEqual({
      itemLifecycle: 'awaiting_review',
      missionStatus: 'awaiting_review',
      shouldAdvanceWorkLevel: false
    });
  });
});
