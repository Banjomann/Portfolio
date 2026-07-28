import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import './main.js'

let element
let root
let sandboxCompany

beforeEach(async () => {
  sandboxCompany = 'Alfreds Futterkiste'
  vi.stubGlobal(
    'fetch',
    vi.fn((url, options = {}) => {
      let result
      if (url === '/api/northwind/countries') {
        result = ['Germany', 'USA']
      } else if (url === '/api/northwind/sandbox/status') {
        result = {
          hasChanges: sandboxCompany !== 'Alfreds Futterkiste',
          expiresAt: '2026-08-01T18:00:00Z',
        }
      } else if (
        url === '/api/northwind/sandbox/customers/ALFKI' &&
        options.method === 'PUT'
      ) {
        sandboxCompany = JSON.parse(options.body).companyName
        result = { customerId: 'ALFKI' }
      } else if (url === '/api/northwind/sandbox/customers/ALFKI') {
        result = {
          customerId: 'ALFKI',
          companyName: sandboxCompany,
          contactName: 'Maria Anders',
          contactTitle: 'Sales Representative',
          address: 'Obere Str. 57',
          city: 'Berlin',
          region: null,
          postalCode: '12209',
          country: 'Germany',
          phone: '030-0074321',
          fax: '030-0076545',
          orderCount: 6,
          totalSales: 4273,
          lastOrderDate: '1998-04-09T00:00:00',
        }
      } else if (
        url === '/api/northwind/sandbox/reset' &&
        options.method === 'POST'
      ) {
        sandboxCompany = 'Alfreds Futterkiste'
        result = {}
      } else if (url === '/api/northwind/customers/ALFKI') {
        result = {
          customerId: 'ALFKI',
          companyName: 'Alfreds Futterkiste',
          contactName: 'Maria Anders',
          contactTitle: 'Sales Representative',
          address: 'Obere Str. 57',
          city: 'Berlin',
          region: null,
          postalCode: '12209',
          country: 'Germany',
          phone: '030-0074321',
          fax: '030-0076545',
          orderCount: 6,
          totalSales: 4273,
          lastOrderDate: '1998-04-09T00:00:00',
        }
      } else if (url === '/api/northwind/customers/ALFKI/orders') {
        result = [
          {
            orderId: 11011,
            orderDate: '1998-04-09T00:00:00',
            status: 'Shipped',
            employeeName: 'Janet Leverling',
            shipperName: 'Speedy Express',
            shipCity: 'Berlin',
            shipCountry: 'Germany',
            freight: 1.21,
            total: 960,
          },
          {
            orderId: 10952,
            orderDate: '1998-03-16T00:00:00',
            status: 'Shipped',
            total: 471.2,
          },
        ]
      } else if (url === '/api/northwind/orders/11011') {
        result = {
          orderId: 11011,
          customerId: 'ALFKI',
          companyName: 'Alfreds Futterkiste',
          orderDate: '1998-04-09T00:00:00',
          status: 'Shipped',
          employeeName: 'Janet Leverling',
          shipperName: 'Speedy Express',
          freight: 1.21,
          shippingAddress: {
            city: 'Berlin',
            country: 'Germany',
          },
          items: [
            {
              productId: 58,
              productName: 'Escargots de Bourgogne',
              unitPrice: 13.25,
              quantity: 40,
              discount: 0,
              extendedPrice: 530,
            },
            {
              productId: 71,
              productName: 'Flotemysost',
              unitPrice: 21.5,
              quantity: 20,
              discount: 0,
              extendedPrice: 430,
            },
          ],
          subtotal: 960,
          total: 961.21,
        }
      } else {
        const companyName = url.startsWith('/api/northwind/sandbox/customers?')
          ? sandboxCompany
          : 'Alfreds Futterkiste'
        result = {
          items: [
            {
              customerId: 'ALFKI',
              companyName,
              contactName: 'Maria Anders',
              city: 'Berlin',
              country: 'Germany',
            },
          ],
          totalCount: 1,
          totalPages: 1,
        }
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(result),
      })
    }),
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

    expect(root.querySelector('#profile-summary-panel').textContent).toContain(
      'Grace Hopper',
    )
  })

  it('validates required profile fields and shows a dismissible result', async () => {
    await updateControl('input[type="email"]', 'invalid')

    const submit = [...root.querySelectorAll('button')].find(
      (button) => button.textContent.trim() === 'Validate profile',
    )
    expect(submit.disabled).toBe(true)
    expect(root.querySelector('#email-help').classList).toContain('field-error')

    await updateControl('input[type="email"]', 'grace@example.com')
    expect(submit.disabled).toBe(false)

    submit.click()
    await nextTick()

    expect(root.querySelector('[role="status"]').textContent).toContain(
      'Example profile validated successfully.',
    )

    root.querySelector('[aria-label="Dismiss notification"]').click()
    await nextTick()
    expect(root.querySelector('[role="status"]')).toBeNull()
  })

  it('switches linked tab panels with arrow keys', async () => {
    const summaryTab = root.querySelector('#profile-summary-tab')
    summaryTab.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    )
    await nextTick()

    expect(root.querySelector('#profile-settings-tab').getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(root.querySelector('#profile-settings-panel').textContent).toContain(
      'Current settings',
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
    expect(root.querySelector('tbody tr td').textContent).toContain(
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

  it('selects a customer from the full row', async () => {
    root.querySelector('tbody tr').click()
    await nextTick()

    expect(root.querySelector('.selection-status').textContent).toContain(
      'Selected: ALFKI',
    )
    expect(root.querySelector('tbody tr').getAttribute('aria-selected')).toBe(
      'true',
    )
  })

  it('loads and binds the selected customer detail and metrics', async () => {
    root.querySelector('tbody tr').click()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/customers/ALFKI',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    const detail = root.querySelector('.customer-detail-layout')
    expect(detail.textContent).toContain('Maria Anders')
    expect(detail.textContent).toContain('Sales Representative')
    expect(detail.textContent).toContain('6')
    expect(detail.textContent).toContain('$4,273')
    expect(detail.textContent).toContain('4/9/1998')
  })

  it('selects the newest order and binds line items and totals', async () => {
    root.querySelector('tbody tr').click()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/customers/ALFKI/orders',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/orders/11011',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(root.querySelector('.order-card').getAttribute('aria-pressed')).toBe(
      'true',
    )

    const orderDetail = root.querySelector('.order-detail')
    expect(orderDetail.textContent).toContain('Janet Leverling')
    expect(orderDetail.textContent).toContain('Speedy Express')
    expect(orderDetail.textContent).toContain('Escargots de Bourgogne')
    expect(orderDetail.textContent).toContain('$530')
    expect(orderDetail.textContent).toContain('$961.21')
  })

  it('saves sandbox customer changes while keeping order reads canonical', async () => {
    root.querySelector('tbody tr').click()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    const sandboxSwitch = root.querySelector('.sandbox-panel [role="switch"]')
    sandboxSwitch.checked = true
    sandboxSwitch.dispatchEvent(new Event('change', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    const company = root.querySelector(
      '.customer-edit-form input[required]',
    )
    company.value = 'Alfreds Session Market'
    company.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    expect(root.querySelector('.dirty-status').textContent).toContain(
      'Unsaved fields',
    )

    root.querySelector('.customer-edit-form button[type="submit"]').click()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/sandbox/customers/ALFKI',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    expect(root.querySelector('.customer-edit-form input[required]').value).toBe(
      'Alfreds Session Market',
    )
    expect(root.querySelector('.sandbox-panel').textContent).toContain(
      'Changes made',
    )
    expect(
      [...fetch.mock.calls].some(
        ([url]) => url === '/api/northwind/customers/ALFKI/orders',
      ),
    ).toBe(true)
    expect(
      [...fetch.mock.calls].some(([url]) => url.includes('/sandbox/orders')),
    ).toBe(false)
  })

  it('blocks leaving with dirty fields and resets the session copy', async () => {
    root.querySelector('tbody tr').click()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    const sandboxSwitch = root.querySelector('.sandbox-panel [role="switch"]')
    sandboxSwitch.checked = true
    sandboxSwitch.dispatchEvent(new Event('change', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    await updateControl('.customer-edit-form input[required]', 'Unsaved name')
    sandboxSwitch.checked = false
    sandboxSwitch.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()

    expect(root.querySelector('.sandbox-panel').textContent).toContain(
      'Save or discard unsaved fields',
    )

    root.querySelector('.customer-edit-form .secondary-button').click()
    await nextTick()
    root.querySelector('.sandbox-panel > .secondary-button').click()
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()

    expect(fetch).toHaveBeenCalledWith('/api/northwind/sandbox/reset', {
      method: 'POST',
    })
    expect(root.querySelector('.selection-status').textContent).toContain(
      'Select a customer',
    )
    expect(root.querySelector('.sandbox-panel').textContent).toContain(
      'Vanilla copy',
    )
  })
})
