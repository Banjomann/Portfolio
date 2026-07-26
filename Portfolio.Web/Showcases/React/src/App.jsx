import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'

const columns = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['city', 'City'],
  ['country', 'Country'],
  ['customerId', 'ID'],
]

function App() {
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
          <h1>Northwind customer explorer</h1>
          <p>
            A server-driven data grid built with React state, effects, and
            accessible native controls.
          </p>
        </div>
        <div className="framework-badge">
          <img src={reactLogo} alt="" />
          <span>React</span>
        </div>
      </header>

      <section className="grid-card" aria-labelledby="customers-heading">
        <div className="grid-heading">
          <div>
            <h2 id="customers-heading">Customers</h2>
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
    </main>
  )
}

export default App
