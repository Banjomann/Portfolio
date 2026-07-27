import { describe, expect, it } from 'vitest'

describe('Vue showcase custom element', () => {
  it('registers the embedded portfolio element', async () => {
    await import('./main.js')

    expect(customElements.get('vue-showcase')).toBeDefined()
  })
})
