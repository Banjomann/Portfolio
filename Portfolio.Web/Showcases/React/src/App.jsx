import { useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'

const columns = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['city', 'City'],
  ['country', 'Country'],
  ['customerId', 'ID'],
]

const editableCustomerFields = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['contactTitle', 'Title'],
  ['address', 'Address'],
  ['city', 'City'],
  ['region', 'Region'],
  ['postalCode', 'Postal code'],
  ['country', 'Country'],
  ['phone', 'Phone'],
  ['fax', 'Fax'],
]

function App() {
  const [profile, setProfile] = useState({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    seats: 3,
    startDate: '2026-08-01',
    role: 'Developer',
  })
  const [interests, setInterests] = useState(['Data'])
  const [contactMethod, setContactMethod] = useState('Email')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [confidence, setConfidence] = useState(72)
  const [activeTab, setActiveTab] = useState('summary')
  const [notice, setNotice] = useState('')
  const dialogRef = useRef(null)
  const [countries, setCountries] = useState([])
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [sort, setSort] = useState('companyName')
  const [direction, setDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [customerDetail, setCustomerDetail] = useState(null)
  const [customerDraft, setCustomerDraft] = useState(null)
  const [orders, setOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [orderDetail, setOrderDetail] = useState(null)
  const [sandboxEnabled, setSandboxEnabled] = useState(false)
  const [sandboxHasChanges, setSandboxHasChanges] = useState(false)
  const [sandboxExpiresAt, setSandboxExpiresAt] = useState(null)
  const [sandboxNotice, setSandboxNotice] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [revision, setRevision] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const pageSize = 10
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
  const draftIsDirty = useMemo(
    () =>
      Boolean(
        customerDetail &&
          customerDraft &&
          editableCustomerFields.some(
            ([field]) =>
              (customerDetail[field] ?? '') !== (customerDraft[field] ?? ''),
          ),
      ),
    [customerDetail, customerDraft],
  )

  function updateProfile(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    )
  }

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/northwind/countries', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Countries could not be loaded.')
        return response.json()
      })
      .then(setCountries)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })

    return () => controller.abort()
  }, [])

  const query = useMemo(() => {
    const parameters = new URLSearchParams({
      sort,
      direction,
      page: String(page),
      pageSize: String(pageSize),
    })

    if (search.trim()) parameters.set('search', search.trim())
    if (country) parameters.set('country', country)

    return parameters
  }, [country, direction, page, search, sort])

  useEffect(() => {
    const controller = new AbortController()
    const delay = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const customerPath = sandboxEnabled
          ? '/api/northwind/sandbox/customers'
          : '/api/northwind/customers'
        const response = await fetch(`${customerPath}?${query}`, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('Customers could not be loaded.')

        const result = await response.json()
        setCustomers(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
        setSelectedId((current) =>
          result.items.some((customer) => customer.customerId === current)
            ? current
            : null,
        )
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setCustomers([])
          setError(requestError.message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)

    return () => {
      clearTimeout(delay)
      controller.abort()
    }
  }, [query, revision, sandboxEnabled])

  useEffect(() => {
    if (!selectedId) {
      setCustomerDetail(null)
      setCustomerDraft(null)
      return
    }

    const controller = new AbortController()
    const customerPath = sandboxEnabled
      ? `/api/northwind/sandbox/customers/${selectedId}`
      : `/api/northwind/customers/${selectedId}`

    setDetailLoading(true)
    fetch(customerPath, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Customer details could not be loaded.')
        return response.json()
      })
      .then((detail) => {
        setCustomerDetail(detail)
        setCustomerDraft(detail)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setSandboxNotice(requestError.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false)
      })

    return () => controller.abort()
  }, [revision, sandboxEnabled, selectedId])

  useEffect(() => {
    if (!selectedId) {
      setOrders([])
      setSelectedOrderId(null)
      return
    }

    const controller = new AbortController()
    setOrdersLoading(true)
    fetch(`/api/northwind/customers/${selectedId}/orders`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Customer orders could not be loaded.')
        return response.json()
      })
      .then((items) => {
        setOrders(items)
        setSelectedOrderId((current) =>
          items.some((order) => order.orderId === current)
            ? current
            : (items[0]?.orderId ?? null),
        )
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setSandboxNotice(requestError.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setOrdersLoading(false)
      })

    return () => controller.abort()
  }, [selectedId])

  useEffect(() => {
    if (!selectedOrderId) {
      setOrderDetail(null)
      return
    }

    const controller = new AbortController()
    setOrderLoading(true)
    fetch(`/api/northwind/orders/${selectedOrderId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Order details could not be loaded.')
        return response.json()
      })
      .then(setOrderDetail)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setSandboxNotice(requestError.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setOrderLoading(false)
      })

    return () => controller.abort()
  }, [selectedOrderId])

  useEffect(() => {
    if (!sandboxEnabled) return

    const controller = new AbortController()
    fetch('/api/northwind/sandbox/status', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Sandbox status could not be loaded.')
        return response.json()
      })
      .then((status) => {
        setSandboxHasChanges(status.hasChanges)
        setSandboxExpiresAt(status.expiresAt)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setSandboxNotice(requestError.message)
        }
      })

    return () => controller.abort()
  }, [revision, sandboxEnabled])

  useEffect(() => {
    function warnBeforeUnload(event) {
      if (!draftIsDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [draftIsDirty])

  function changeSort(nextSort) {
    if (sort === nextSort) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(nextSort)
      setDirection('asc')
    }
    setPage(1)
  }

  function sortLabel(column) {
    if (sort !== column) return 'Not sorted'
    return direction === 'asc' ? 'Sorted ascending' : 'Sorted descending'
  }

  function updateCustomerDraft(field, value) {
    setCustomerDraft((current) => ({ ...current, [field]: value }))
  }

  async function saveSandboxCustomer(event) {
    event.preventDefault()
    setSandboxNotice('')

    const response = await fetch(
      `/api/northwind/sandbox/customers/${selectedId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerDraft),
      },
    )

    if (!response.ok) {
      setSandboxNotice('The sandbox customer could not be saved.')
      return
    }

    setSandboxNotice('Saved to this session’s temporary database.')
    setSandboxHasChanges(true)
    setRevision((current) => current + 1)
  }

  async function resetSandbox() {
    setSandboxNotice('')
    const response = await fetch('/api/northwind/sandbox/reset', {
      method: 'POST',
    })

    if (!response.ok) {
      setSandboxNotice('The sandbox could not be reset.')
      return
    }

    setSelectedId(null)
    setSandboxHasChanges(false)
    setSandboxExpiresAt(null)
    setSandboxNotice('Sandbox reset to vanilla Northwind data.')
    setRevision((current) => current + 1)
  }

  return (
    <div className="showcase">
      <header className="showcase-header">
        <div>
          <span className="eyebrow">Frontend Lab</span>
          <h1>React showcase</h1>
          <p>
            Interactive UI patterns, form controls, and API-backed data binding
            built with accessible native controls.
          </p>
        </div>
        <div className="framework-badge">
          <img src={reactLogo} alt="" />
          <span>React</span>
        </div>
      </header>

      <nav className="showcase-nav" aria-label="React showcase sections">
        <a href="#react-controls">Control gallery</a>
        <a href="#react-northwind">Northwind data binding</a>
      </nav>

      <section
        id="react-controls"
        className="controls-section"
        aria-labelledby="controls-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">Reactive UI state</span>
            <h2 id="controls-heading">Control gallery</h2>
          </div>
          <p>
            Every value below is bound to framework state and immediately
            reflected in the live summary.
          </p>
        </div>

        <div className="control-layout">
          <form
            className="control-card form-card"
            aria-labelledby="profile-heading"
            onSubmit={(event) => {
              event.preventDefault()
              setNotice('Example profile validated successfully.')
            }}
          >
            <div className="card-heading">
              <h3 id="profile-heading">Profile inputs</h3>
            </div>
            <div className="profile-fields">
              <label className="field-span">
                <span>Name</span>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(event) => updateProfile('name', event.target.value)}
                />
              </label>
              <label className="field-span">
                <span>Email</span>
                <input
                  type="email"
                  value={profile.email}
                  aria-invalid={!emailIsValid}
                  aria-describedby="email-help"
                  onChange={(event) =>
                    updateProfile('email', event.target.value)
                  }
                />
                <small
                  id="email-help"
                  className={emailIsValid ? 'field-help' : 'field-error'}
                >
                  {emailIsValid
                    ? 'Used for example notifications.'
                    : 'Enter a valid email address.'}
                </small>
              </label>
              <div className="field-pair field-span">
                <label>
                  <span>Seats</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={profile.seats}
                    onChange={(event) =>
                      updateProfile('seats', Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  <span>Start date</span>
                  <input
                    type="date"
                    value={profile.startDate}
                    onChange={(event) =>
                      updateProfile('startDate', event.target.value)
                    }
                  />
                </label>
              </div>
              <label className="field-span">
                <span>Role</span>
                <select
                  value={profile.role}
                  onChange={(event) => updateProfile('role', event.target.value)}
                >
                  <option>Developer</option>
                  <option>Designer</option>
                  <option>Analyst</option>
                  <option>Manager</option>
                </select>
              </label>
            </div>

            <fieldset>
              <legend>Interests</legend>
              <div className="choice-row">
                {['Data', 'Design', 'Automation'].map((interest) => (
                  <label className="choice" key={interest}>
                    <input
                      type="checkbox"
                      checked={interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Preferred contact</legend>
              <div className="choice-row">
                {['Email', 'Phone', 'Chat'].map((method) => (
                  <label className="choice" key={method}>
                    <input
                      type="radio"
                      name="contact-method"
                      value={method}
                      checked={contactMethod === method}
                      onChange={() => setContactMethod(method)}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={!emailIsValid || !profile.name.trim()}
              >
                Validate profile
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => dialogRef.current?.showModal()}
              >
                Open dialog
              </button>
              <button type="button" className="secondary-button" disabled>
                Disabled
              </button>
            </div>
          </form>

          <div className="control-stack">
            <article className="control-card">
              <div className="card-heading">
                <h3>Preferences and progress</h3>
              </div>
              <label className="switch-row">
                <span>
                  <strong>Notifications</strong>
                  <small>Enable status updates</small>
                </span>
                <input
                  className="switch"
                  type="checkbox"
                  role="switch"
                  checked={notificationsEnabled}
                  onChange={(event) =>
                    setNotificationsEnabled(event.target.checked)
                  }
                />
              </label>
              <label className="range-field">
                <span>
                  Confidence <strong>{confidence}%</strong>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={(event) => setConfidence(event.target.value)}
                />
              </label>
              <progress
                value={confidence}
                max="100"
                aria-label={`Confidence ${confidence}%`}
              />
            </article>

            <article className="control-card">
              <div className="card-heading">
                <h3>Bound state</h3>
              </div>
              <div className="tabs" role="tablist" aria-label="Profile views">
                {['summary', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    id={`profile-${tab}-tab`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`profile-${tab}-panel`}
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={(event) => {
                      if (
                        event.key !== 'ArrowLeft' &&
                        event.key !== 'ArrowRight'
                      ) {
                        return
                      }

                      event.preventDefault()
                      const nextTab = tab === 'summary' ? 'settings' : 'summary'
                      setActiveTab(nextTab)
                      event.currentTarget.parentElement
                        .querySelector(`#profile-${nextTab}-tab`)
                        ?.focus()
                    }}
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div
                id={`profile-${activeTab}-panel`}
                className="tab-panel"
                role="tabpanel"
                aria-labelledby={`profile-${activeTab}-tab`}
                tabIndex="0"
              >
                {activeTab === 'summary' ? (
                  <>
                    <h3>{profile.name || 'Unnamed profile'}</h3>
                    <dl className="summary-list">
                      <div>
                        <dt>Role</dt>
                        <dd>{profile.role}</dd>
                      </div>
                      <div>
                        <dt>Seats</dt>
                        <dd>{profile.seats}</dd>
                      </div>
                      <div>
                        <dt>Contact</dt>
                        <dd>{contactMethod}</dd>
                      </div>
                      <div>
                        <dt>Interests</dt>
                        <dd>{interests.join(', ') || 'None'}</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <>
                    <h3>Current settings</h3>
                    <p>
                      Notifications are{' '}
                      <strong>
                        {notificationsEnabled ? 'enabled' : 'disabled'}
                      </strong>
                      . The selected start date is {profile.startDate}.
                    </p>
                  </>
                )}
              </div>
              <details>
                <summary>Implementation note</summary>
                <p>
                  Native controls preserve keyboard behavior while framework
                  state derives this summary.
                </p>
              </details>
            </article>
          </div>
        </div>

        {notice && (
          <div className="notification" role="status" aria-live="polite">
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setNotice('')}
            >
              ×
            </button>
          </div>
        )}
      </section>

      <section
        id="react-northwind"
        className="data-section"
        aria-labelledby="data-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">API-backed state</span>
            <h2 id="data-heading">Northwind data binding</h2>
          </div>
          <p>
            Server-driven filtering, sorting, paging, and selection against
            the Northwind API.
          </p>
        </div>

        <aside className="sandbox-panel" aria-labelledby="sandbox-heading">
          <div>
            <span className="eyebrow">Session-isolated editing</span>
            <h3 id="sandbox-heading">Editing Sandbox</h3>
            <p>
              Changes use an in-memory browser-session copy. Canonical Northwind
              customers and every order remain read-only.
            </p>
          </div>
          <label className="switch-row">
            <span>
              <strong>{sandboxEnabled ? 'Enabled' : 'Disabled'}</strong>
              <small>
                {sandboxHasChanges ? 'Changes made' : 'Vanilla copy'}
              </small>
            </span>
            <input
              className="switch"
              type="checkbox"
              role="switch"
              aria-label="Editing sandbox"
              checked={sandboxEnabled}
              onChange={(event) => {
                if (!event.target.checked && draftIsDirty) {
                  setSandboxNotice(
                    'Save or discard the unsaved customer fields before leaving sandbox mode.',
                  )
                  return
                }
                setSandboxEnabled(event.target.checked)
                setSelectedId(null)
                setPage(1)
                setSandboxNotice('')
              }}
            />
          </label>
          {sandboxEnabled && (
            <button
              type="button"
              className="secondary-button"
              onClick={resetSandbox}
            >
              Reset sandbox
            </button>
          )}
          {sandboxEnabled && sandboxExpiresAt && (
            <small>Session copy expires after 30 minutes without sandbox activity.</small>
          )}
          {sandboxNotice && (
            <div className="notification" role="status" aria-live="polite">
              <span>{sandboxNotice}</span>
              <button
                type="button"
                aria-label="Dismiss sandbox notification"
                onClick={() => setSandboxNotice('')}
              >
                ×
              </button>
            </div>
          )}
        </aside>

        <section className="data-card grid-card" aria-labelledby="customers-heading">
          <div className="data-heading">
            <h3 id="customers-heading">Customer explorer</h3>
            <p>{totalCount} Northwind records</p>
          </div>
          <div className="filter-grid filters">
              <label>
                <span>Search customers</span>
                <input
                  type="search"
                  value={search}
                  placeholder="Company or contact"
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                />
              </label>
              <label>
                <span>Country</span>
                <select
                  value={country}
                  onChange={(event) => {
                    setCountry(event.target.value)
                    setPage(1)
                  }}
                >
                  <option value="">All countries</option>
                  {countries.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
          </div>

          {error && (
            <div className="status error" role="alert">
              {error}
            </div>
          )}

          <div className="table-wrap" aria-busy={loading}>
            <table aria-label="Northwind customers">
              <thead>
                <tr>
                  {columns.map(([key, label]) => (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={
                      sort === key
                        ? direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      type="button"
                      className={sort === key ? 'active-sort' : ''}
                      aria-label={`${label}: ${sortLabel(key)}`}
                      onClick={() => changeSort(key)}
                    >
                      {label}
                      <span aria-hidden="true">
                        {sort === key ? (direction === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading &&
                customers.map((customer) => (
                  <tr
                    key={customer.customerId}
                    className={
                      selectedId === customer.customerId ? 'selected' : ''
                    }
                    tabIndex="0"
                    aria-selected={selectedId === customer.customerId}
                    onClick={() => setSelectedId(customer.customerId)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedId(customer.customerId)
                      }
                    }}
                  >
                    <td data-label="Company">
                      {customer.companyName}
                    </td>
                    <td data-label="Contact">{customer.contactName || '—'}</td>
                    <td data-label="City">{customer.city || '—'}</td>
                    <td data-label="Country">{customer.country || '—'}</td>
                    <td data-label="ID">
                      <code>{customer.customerId}</code>
                    </td>
                  </tr>
                ))}
            </tbody>
            </table>

            {loading && (
              <div className="status" role="status" aria-live="polite">
                Loading customers…
              </div>
            )}
            {!loading && !error && customers.length === 0 && (
              <div className="status">No customers match these filters.</div>
            )}
          </div>

          <div className="pagination" aria-label="Customer pages">
              <button
                type="button"
                disabled={loading || page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.max(totalPages, 1)}
              </span>
              <button
                type="button"
                disabled={loading || page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
          </div>
          <p className="selection-status" aria-live="polite">
            {selectedId ? `Selected: ${selectedId}` : 'Select a customer'}
          </p>
        </section>

        <section className="data-card detail-card" aria-labelledby="detail-heading">
          <div className="data-heading">
            <h3 id="detail-heading">Customer details</h3>
            {selectedId && <code>{selectedId}</code>}
          </div>

          {!selectedId && (
            <div className="status">
              Select a customer to bind its complete record and sales metrics.
            </div>
          )}
          {detailLoading && (
            <div className="status" role="status" aria-live="polite">
              Loading customer…
            </div>
          )}

          {!detailLoading && customerDetail && (
            <dl className="metric-grid" aria-label="Customer sales metrics">
              <div><dt>Orders</dt><dd>{customerDetail.orderCount}</dd></div>
              <div>
                <dt>Total sales</dt>
                <dd>${Number(customerDetail.totalSales).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Last order</dt>
                <dd>
                  {customerDetail.lastOrderDate
                    ? new Date(customerDetail.lastOrderDate).toLocaleDateString()
                    : '—'}
                </dd>
              </div>
            </dl>
          )}

          {!detailLoading && customerDraft && sandboxEnabled && (
            <form className="detail-form" onSubmit={saveSandboxCustomer}>
              {editableCustomerFields.map(([field, label]) => (
                <label key={field}>
                  <span>{label}</span>
                  <input
                    required={field === 'companyName'}
                    value={customerDraft[field] ?? ''}
                    onChange={(event) =>
                      updateCustomerDraft(field, event.target.value)
                    }
                  />
                </label>
              ))}
              <p className="dirty-status" aria-live="polite">
                {draftIsDirty ? 'Unsaved fields' : 'No unsaved fields'}
              </p>
              <div className="detail-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={!draftIsDirty}
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={!draftIsDirty}
                  onClick={() => {
                    setCustomerDraft(customerDetail)
                    setSandboxNotice('Unsaved field changes discarded.')
                  }}
                >
                  Discard
                </button>
              </div>
            </form>
          )}

          {!detailLoading && customerDetail && !sandboxEnabled && (
            <dl className="detail-grid customer-detail">
              {[
                ['Company', customerDetail.companyName],
                ['Contact', customerDetail.contactName],
                ['Title', customerDetail.contactTitle],
                ['Address', customerDetail.address],
                ['City', customerDetail.city],
                ['Region', customerDetail.region],
                ['Postal code', customerDetail.postalCode],
                ['Country', customerDetail.country],
                ['Phone', customerDetail.phone],
                ['Fax', customerDetail.fax],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || '—'}</dd>
                </div>
              ))}
            </dl>
          )}

        </section>

        <section className="data-card orders-card" aria-labelledby="orders-heading">
          <div className="data-heading">
            <h3 id="orders-heading">Orders and line items</h3>
            {orders.length > 0 && <span>{orders.length} orders</span>}
          </div>

          {!selectedId && (
            <div className="status">
              Select a customer to load their orders.
            </div>
          )}

          {selectedId && (
            <div className="order-workspace orders-layout">
              <div className="order-list" aria-label="Customer orders" aria-busy={ordersLoading}>
                {ordersLoading && (
                  <div className="status" role="status" aria-live="polite">
                    Loading orders…
                  </div>
                )}
                {!ordersLoading && orders.length === 0 && (
                  <div className="status">This customer has no orders.</div>
                )}
                {!ordersLoading &&
                  orders.map((order) => (
                    <button
                      type="button"
                      key={order.orderId}
                      className="order-card"
                      aria-pressed={selectedOrderId === order.orderId}
                      onClick={() => setSelectedOrderId(order.orderId)}
                    >
                      <span>
                        <strong>Order {order.orderId}</strong>
                        <small>
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : 'No order date'}
                        </small>
                      </span>
                      <span>
                        <strong>
                          ${Number(order.total).toLocaleString()}
                        </strong>
                        <small className={`order-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </small>
                      </span>
                    </button>
                  ))}
              </div>

              <div className="order-detail" aria-live="polite" aria-busy={orderLoading}>
                {orderLoading && (
                  <div className="status" role="status" aria-live="polite">
                    Loading order…
                  </div>
                )}
                {!orderLoading && orderDetail && (
                  <>
                    <div className="order-detail-heading">
                      <p className="card-kicker">Order {orderDetail.orderId}</p>
                      <h4>{orderDetail.status}</h4>
                      <p>
                        {orderDetail.orderDate
                          ? new Date(orderDetail.orderDate).toLocaleDateString()
                          : 'No order date'}
                      </p>
                    </div>
                    <dl className="order-summary">
                      <div>
                        <dt>Employee</dt>
                        <dd>{orderDetail.employeeName || '—'}</dd>
                      </div>
                      <div>
                        <dt>Shipper</dt>
                        <dd>{orderDetail.shipperName || '—'}</dd>
                      </div>
                      <div>
                        <dt>Destination</dt>
                        <dd>
                          {[
                            orderDetail.shippingAddress.city,
                            orderDetail.shippingAddress.country,
                          ]
                            .filter(Boolean)
                            .join(', ') || '—'}
                        </dd>
                      </div>
                    </dl>
                    <div className="line-items-wrap">
                      <table className="line-items">
                        <caption className="visually-hidden">Order line items</caption>
                        <thead>
                          <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Qty.</th>
                            <th scope="col">Price</th>
                            <th scope="col">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetail.items.map((item) => (
                            <tr key={item.productId}>
                              <td>{item.productName}</td>
                              <td>{item.quantity}</td>
                              <td>${Number(item.unitPrice).toLocaleString()}</td>
                              <td>
                                ${Number(item.extendedPrice).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <dl className="order-totals">
                      <div>
                        <dt>Subtotal</dt>
                        <dd>${Number(orderDetail.subtotal).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt>Freight</dt>
                        <dd>${Number(orderDetail.freight).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt>Total</dt>
                        <dd>${Number(orderDetail.total).toLocaleString()}</dd>
                      </div>
                    </dl>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </section>

      <dialog ref={dialogRef}>
        <form method="dialog">
          <span className="eyebrow">Native dialog</span>
          <h2>React-controlled launch</h2>
          <p>
            This modal uses the browser dialog element for focus management and
            keyboard dismissal.
          </p>
          <button className="primary-button">Close dialog</button>
        </form>
      </dialog>
    </div>
  )
}

export default App
