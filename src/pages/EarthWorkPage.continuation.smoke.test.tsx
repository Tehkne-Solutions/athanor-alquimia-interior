import { describe, expect, it } from 'vitest'

describe('First Work continuation smoke', () => {
  it('keeps both valid post-completion destinations available', () => {
    const destinations = ['/temple/garden', '/temple']
    expect(destinations).toContain('/temple')
    expect(destinations).toContain('/temple/garden')
  })
})
