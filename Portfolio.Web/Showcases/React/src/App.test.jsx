import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

const customer = {
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
  fax: null,
  orderCount: 0,
  totalSales: 0,
  lastOrderDate: null,
}

function jsonResponse(value, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(value),
  })
}

describe('React showcase', () => {
  let sandboxHasChanges

  beforeEach(() => {
    sandboxHasChanges = false
    vi.stubGlobal(
      'fetch',
      vi.fn((input, options = {}) => {
        const url = String(input)

        if (url.endsWith('/countries')) return jsonResponse(['Germany'])
        if (url.includes('/orders')) return jsonResponse([])
        if (url.endsWith('/sandbox/status')) {
          return jsonResponse({
            hasChanges: sandboxHasChanges,
            expiresAt: '2026-08-01T12:00:00Z',
          })
        }
        if (options.method === 'PUT') {
          sandboxHasChanges = true
          return jsonResponse(null, 204)
        }
        if (options.method === 'POST') {
          sandboxHasChanges = false
          return jsonResponse(null, 204)
        }
        if (/customers\/ALFKI$/.test(url)) return jsonResponse(customer)
        if (url.includes('/customers?')) {
          return jsonResponse({
            items: [customer],
            page: 1,
            pageSize: 10,
            totalCount: 1,
            totalPages: 1,
          })
        }

        throw new Error(`Unexpected request: ${url}`)
      }),
    )
  })

  it('binds controlled inputs to the live summary', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.clear(screen.getByRole('textbox', { name: 'Name' }))
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Grace Hopper')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Role' }), 'Manager')
    await user.click(screen.getByRole('checkbox', { name: 'Automation' }))

    expect(screen.getByRole('heading', { name: 'Grace Hopper' })).toBeVisible()
    expect(screen.getAllByText('Manager')).toHaveLength(2)
    expect(screen.getByText('Data, Automation')).toBeVisible()
  })

  it('sends debounced grid filters to the Northwind API', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'alfreds')

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=alfreds'),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ),
    )
  })

  it('binds a selected customer and saves only to sandbox mode', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('row', { name: /Alfreds Futterkiste/ })
    await user.click(screen.getByRole('switch', { name: 'Editing sandbox' }))
    await user.click(
      await screen.findByRole('row', { name: /Alfreds Futterkiste/ }),
    )

    const company = await screen.findByRole('textbox', { name: 'Company' })
    await user.clear(company)
    await user.type(company, 'Session Company')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        '/api/northwind/sandbox/customers/ALFKI',
        expect.objectContaining({ method: 'PUT' }),
      ),
    )
    expect(await screen.findByText('Changes made')).toBeVisible()
  })
})
