import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import './main.js'

let element
let root

beforeEach(async () => {
  element = document.createElement('vue-showcase')
  document.body.append(element)
  await nextTick()
  root = element.shadowRoot
})

afterEach(() => {
  element.remove()
})

function updateControl(selector, value) {
  const control = root.querySelector(selector)
  control.value = value
  control.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
  return nextTick()
}

describe('Control Gallery', () => {
  it('renders the specified defaults and derives summary state', async () => {
    expect(root.querySelector('input[type="text"]').value).toBe('Ada Lovelace')
    expect(root.querySelector('input[type="email"]').value).toBe(
      'ada@example.com',
    )
    expect(root.querySelector('input[type="number"]').value).toBe('3')
    expect(root.querySelector('input[type="date"]').value).toBe('2026-08-01')
    expect(root.querySelector('select').value).toBe('Developer')
    expect(root.querySelector('input[value="Data"]').checked).toBe(true)
    expect(root.querySelector('input[value="Email"]').checked).toBe(true)
    expect(root.querySelector('[role="switch"]').checked).toBe(true)
    expect(root.querySelector('input[type="range"]').value).toBe('72')

    await updateControl('input[type="text"]', 'Grace Hopper')

    expect(root.querySelector('#summary-panel').textContent).toContain(
      'Grace Hopper',
    )
  })

  it('validates required profile fields and shows a dismissible result', async () => {
    await updateControl('input[type="email"]', 'invalid')

    const submit = [...root.querySelectorAll('button')].find(
      (button) => button.textContent.trim() === 'Validate profile',
    )
    expect(submit.disabled).toBe(true)
    expect(root.querySelector('#email-error')).not.toBeNull()

    await updateControl('input[type="email"]', 'grace@example.com')
    expect(submit.disabled).toBe(false)

    submit.click()
    await nextTick()

    expect(root.querySelector('[role="status"]').textContent).toContain(
      'Profile validated for Ada Lovelace.',
    )

    root.querySelector('[aria-label="Dismiss success message"]').click()
    await nextTick()
    expect(root.querySelector('[role="status"]')).toBeNull()
  })

  it('switches linked tab panels with arrow keys', async () => {
    const summaryTab = root.querySelector('#summary-tab')
    summaryTab.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    )
    await nextTick()

    expect(root.querySelector('#settings-tab').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(root.querySelector('#settings-panel').textContent).toContain(
      'Confidence',
    )
  })
})
