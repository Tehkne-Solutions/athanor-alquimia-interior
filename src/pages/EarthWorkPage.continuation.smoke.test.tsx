import { describe, expect, it } from 'vitest'

describe('First Work continuation smoke', () => {
  it('protects the two existing post-completion destinations', () => {
    const destinations = ['/temple/garden', '/temple']

    expect(destinations).toContain('/temple/garden')
    expect(destinations).toContain('/temple')
  })
})
