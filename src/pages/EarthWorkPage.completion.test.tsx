import { describe, expect, it } from 'vitest'

describe('Earth Work completion contract', () => {
  it('defines the post-completion continuation contract', () => {
    const continuation = {
      completion: 'earth-work.completed',
      seed: 'first-step-seed.created',
      return: '/temple',
      progress: 'visible',
    }

    expect(continuation.completion).toBe('earth-work.completed')
    expect(continuation.seed).toBe('first-step-seed.created')
    expect(continuation.return).toBe('/temple')
    expect(continuation.progress).toBe('visible')
  })
})
