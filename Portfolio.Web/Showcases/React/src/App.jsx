import { useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'

const columns = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['city', 'City'],
  ['country', 'Country'],
  ['customerId', 'ID'],
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const pageSize = 10
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)

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
        const response = await fetch(`/api/northwind/customers?${query}`, {
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
  }, [query])

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

  return (
    <main className="showcase">
      <header className="showcase-header">
        <div>
          <span className="eyebrow">Frontend Lab</span>
          <h1>React showcase</h1>
          <p>
            Interactive UI patterns and data binding implemented with React
            state, effects, and accessible native controls.
          </p>
        </div>
        <div className="framework-badge">
          <img src={reactLogo} alt="" />
          <span>React</span>
        </div>
      </header>

      <section className="controls-section" aria-labelledby="controls-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Controlled components</span>
            <h2 id="controls-heading">Control gallery</h2>
          </div>
          <p>
            Every value below is held in React state and immediately reflected
            in the live summary.
          </p>
        </div>

        <div className="control-layout">
          <form
            className="control-card form-card"
            onSubmit={(event) => {
              event.preventDefault()
              setNotice('Example profile validated successfully.')
            }}
          >
            <h3>Profile inputs</h3>
            <div className="field-grid">
              <label>
                <span>Name</span>
                <input
                  value={profile.name}
                  onChange={(event) => updateProfile('name', event.target.value)}
                />
              </label>
              <label>
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
            <section className="control-card">
              <h3>Preferences and progress</h3>
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
            </section>

            <section className="control-card">
              <div className="tabs" role="tablist" aria-label="Profile views">
                {['summary', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="tab-panel" role="tabpanel">
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
                  Native controls preserve keyboard behavior while React binds
                  each value and derives this summary.
                </p>
              </details>
            </section>
          </div>
        </div>

        {notice && (
          <div className="notification" role="status">
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

      <section className="data-section" aria-labelledby="data-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">API-backed state</span>
            <h2 id="data-heading">Northwind data binding</h2>
          </div>
          <p>
            Server-driven filtering, sorting, paging, and selection against the
            Northwind API.
          </p>
        </div>

        <section className="grid-card" aria-labelledby="customers-heading">
          <div className="grid-heading">
            <div>
              <h3 id="customers-heading">Customer explorer</h3>
              <p>{totalCount} Northwind records</p>
            </div>
            <div className="filters">
              <label>
                <span>Search</span>
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
          </div>

          {error && <div className="status error">{error}</div>}

          <div className="table-wrap" aria-busy={loading}>
            <table>
            <thead>
              <tr>
                {columns.map(([key, label]) => (
                  <th key={key} scope="col">
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
                    <td data-label="Company">{customer.companyName}</td>
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

            {loading && <div className="status">Loading customers…</div>}
            {!loading && !error && customers.length === 0 && (
              <div className="status">No customers match these filters.</div>
            )}
          </div>

          <footer className="grid-footer">
            <span>
              {selectedId ? `Selected: ${selectedId}` : 'Select a customer row'}
            </span>
            <div className="pagination">
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
          </footer>
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
    </main>
  )
}

export default App
