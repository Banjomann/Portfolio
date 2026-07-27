import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import './main.js'

let element
let root

beforeEach(async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            url === '/api/northwind/countries'
              ? ['Germany', 'USA']
              : {
                  items: [
                    {
                      customerId: 'ALFKI',
                      companyName: 'Alfreds Futterkiste',
                      contactName: 'Maria Anders',
                      city: 'Berlin',
                      country: 'Germany',
                    },
                  ],
                  totalCount: 1,
                  totalPages: 1,
                },
          ),
      }),
    ),
  )
  element = document.createElement('vue-showcase')
  document.body.append(element)
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve))
  await nextTick()
  root = element.shadowRoot
})

afterEach(() => {
  element.remove()
  vi.unstubAllGlobals()
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

describe('Customer Explorer', () => {
  it('loads countries and server-paged customers with accessible sorting', () => {
    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/countries',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(
      [...fetch.mock.calls].some(([url]) =>
        url.startsWith(
          '/api/northwind/customers?search=&country=&sort=companyName&direction=asc&page=1&pageSize=10',
        ),
      ),
    ).toBe(true)
    expect(root.querySelector('option[value="Germany"]')).not.toBeNull()
    expect(root.querySelector('.customer-button').textContent).toContain(
      'Alfreds Futterkiste',
    )
    expect(
      root.querySelector('th[aria-sort="ascending"]').textContent,
    ).toContain('Company')
  })

  it('debounces search and sends the filter to the server', async () => {
    vi.useFakeTimers()
    fetch.mockClear()

    await updateControl('input[type="search"]', 'alf')
    await vi.advanceTimersByTimeAsync(249)
    expect(fetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    await nextTick()

    expect(
      [...fetch.mock.calls].some(([url]) => url.includes('search=alf')),
    ).toBe(true)
    vi.useRealTimers()
  })

  it('selects a customer from the full row or accessible company button', async () => {
    root.querySelector('tbody tr').click()
    await nextTick()

    expect(root.querySelector('.selection-status').textContent).toContain(
      'Selected: ALFKI',
    )
    expect(root.querySelector('.customer-button').getAttribute('aria-pressed')).toBe(
      'true',
    )
  })
})
