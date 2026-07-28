<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const name = ref('Ada Lovelace')
const email = ref('ada@example.com')
const seats = ref(3)
const startDate = ref('2026-08-01')
const role = ref('Developer')
const interests = ref(['Data'])
const contact = ref('Email')
const notifications = ref(true)
const confidence = ref(72)
const activeTab = ref('summary')
const successMessage = ref('')
const dialog = ref(null)
const tabNames = ['summary', 'settings']
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
const countries = ref([])
const customers = ref([])
const search = ref('')
const debouncedSearch = ref('')
const country = ref('')
const sort = ref('companyName')
const direction = ref('asc')
const page = ref(1)
const pageSize = 10
const totalCount = ref(0)
const totalPages = ref(0)
const selectedId = ref(null)
const customerDetail = ref(null)
const customerDetailLoading = ref(false)
const customerDetailError = ref('')
const orders = ref([])
const ordersLoading = ref(false)
const ordersError = ref('')
const selectedOrderId = ref(null)
const orderDetail = ref(null)
const orderDetailLoading = ref(false)
const orderDetailError = ref('')
const sandboxEnabled = ref(false)
const sandboxHasChanges = ref(false)
const sandboxExpiresAt = ref(null)
const sandboxNotice = ref('')
const sandboxError = ref('')
const sandboxSaving = ref(false)
const customerDraft = ref(null)
const customersLoading = ref(true)
const customersError = ref('')
const countriesError = ref('')
let searchTimer
let customerController
let countryController
let customerDetailController
let ordersController
let orderDetailController

const isNameValid = computed(() => name.value.trim().length > 0)
const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
)
const isProfileValid = computed(
  () => isNameValid.value && isEmailValid.value,
)
const pageDescription = computed(() =>
  totalPages.value === 0
    ? 'No pages'
    : `Page ${page.value} of ${totalPages.value}`,
)
const customerDraftDirty = computed(() => {
  if (!customerDetail.value || !customerDraft.value) return false
  return editableCustomerFields.some(
    ([key]) => (customerDraft.value[key] ?? '') !== (customerDetail.value[key] ?? ''),
  )
})
const draftCompanyValid = computed(
  () => customerDraft.value?.companyName?.trim().length > 0,
)

async function loadCountries() {
  countryController?.abort()
  const controller = new AbortController()
  countryController = controller
  countriesError.value = ''

  try {
    const response = await fetch('/api/northwind/countries', {
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('Countries could not be loaded.')
    countries.value = await response.json()
  } catch (error) {
    if (error.name !== 'AbortError') {
      countriesError.value = error.message
    }
  }
}

async function loadCustomers() {
  customerController?.abort()
  const controller = new AbortController()
  customerController = controller
  customersLoading.value = true
  customersError.value = ''

  const query = new URLSearchParams({
    search: debouncedSearch.value,
    country: country.value,
    sort: sort.value,
    direction: direction.value,
    page: String(page.value),
    pageSize: String(pageSize),
  })

  try {
    const collectionPath = sandboxEnabled.value
      ? '/api/northwind/sandbox/customers'
      : '/api/northwind/customers'
    const response = await fetch(`${collectionPath}?${query}`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      const message =
        response.status === 400
          ? 'The customer query is invalid.'
          : 'Customers could not be loaded.'
      throw new Error(message)
    }

    const result = await response.json()
    customers.value = result.items
    totalCount.value = result.totalCount
    totalPages.value = result.totalPages
    selectedId.value = result.items.some(
      (customer) => customer.customerId === selectedId.value,
    )
      ? selectedId.value
      : null
  } catch (error) {
    if (error.name !== 'AbortError') {
      customers.value = []
      totalCount.value = 0
      totalPages.value = 0
      customersError.value = error.message
    }
  } finally {
    if (!controller.signal.aborted) customersLoading.value = false
  }
}

function changeSort(column) {
  if (sort.value === column) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = column
    direction.value = 'asc'
  }
  page.value = 1
}

function ariaSort(column) {
  if (sort.value !== column) return 'none'
  return direction.value === 'asc' ? 'ascending' : 'descending'
}

function selectCustomer(customerId) {
  selectedId.value = customerId
}

async function loadCustomerDetail() {
  customerDetailController?.abort()
  customerDetail.value = null
  customerDetailError.value = ''

  if (!selectedId.value) {
    customerDetailLoading.value = false
    return
  }

  const controller = new AbortController()
  customerDetailController = controller
  customerDetailLoading.value = true

  try {
    const detailPath = sandboxEnabled.value
      ? `/api/northwind/sandbox/customers/${selectedId.value}`
      : `/api/northwind/customers/${selectedId.value}`
    const response = await fetch(detailPath, { signal: controller.signal })
    if (!response.ok) throw new Error('Customer details could not be loaded.')
    customerDetail.value = await response.json()
    customerDraft.value = Object.fromEntries(
      editableCustomerFields.map(([key]) => [
        key,
        customerDetail.value[key] ?? '',
      ]),
    )
  } catch (error) {
    if (error.name !== 'AbortError') {
      customerDetailError.value = error.message
    }
  } finally {
    if (!controller.signal.aborted) customerDetailLoading.value = false
  }
}

async function loadOrders() {
  ordersController?.abort()
  orders.value = []
  selectedOrderId.value = null
  ordersError.value = ''

  if (!selectedId.value) {
    ordersLoading.value = false
    return
  }

  const controller = new AbortController()
  ordersController = controller
  ordersLoading.value = true

  try {
    const response = await fetch(
      `/api/northwind/customers/${selectedId.value}/orders`,
      { signal: controller.signal },
    )
    if (!response.ok) throw new Error('Customer orders could not be loaded.')
    orders.value = await response.json()
    selectedOrderId.value = orders.value[0]?.orderId ?? null
  } catch (error) {
    if (error.name !== 'AbortError') ordersError.value = error.message
  } finally {
    if (!controller.signal.aborted) ordersLoading.value = false
  }
}

async function loadOrderDetail() {
  orderDetailController?.abort()
  orderDetail.value = null
  orderDetailError.value = ''

  if (!selectedOrderId.value) {
    orderDetailLoading.value = false
    return
  }

  const controller = new AbortController()
  orderDetailController = controller
  orderDetailLoading.value = true

  try {
    const response = await fetch(
      `/api/northwind/orders/${selectedOrderId.value}`,
      { signal: controller.signal },
    )
    if (!response.ok) throw new Error('Order details could not be loaded.')
    orderDetail.value = await response.json()
  } catch (error) {
    if (error.name !== 'AbortError') orderDetailError.value = error.message
  } finally {
    if (!controller.signal.aborted) orderDetailLoading.value = false
  }
}

function formatCurrency(value) {
  return `$${Number(value).toLocaleString()}`
}

function formatDate(value) {
  if (!value) return 'No orders'
  return new Date(value).toLocaleDateString()
}

async function loadSandboxStatus() {
  sandboxError.value = ''
  try {
    const response = await fetch('/api/northwind/sandbox/status')
    if (!response.ok) throw new Error('Sandbox status could not be loaded.')
    const status = await response.json()
    sandboxHasChanges.value = status.hasChanges
    sandboxExpiresAt.value = status.expiresAt
  } catch (error) {
    sandboxError.value = error.message
  }
}

async function setSandboxEnabled(enabled, control) {
  if (!enabled && customerDraftDirty.value) {
    control.checked = true
    sandboxNotice.value =
      'Save or discard unsaved fields before leaving Editing Sandbox.'
    return
  }

  sandboxEnabled.value = enabled
  sandboxNotice.value = ''

  if (enabled) await loadSandboxStatus()
  await Promise.all([loadCustomers(), loadCustomerDetail()])
}

function discardCustomerChanges() {
  if (!customerDetail.value) return
  customerDraft.value = Object.fromEntries(
    editableCustomerFields.map(([key]) => [
      key,
      customerDetail.value[key] ?? '',
    ]),
  )
  sandboxNotice.value = 'Unsaved fields discarded.'
}

async function saveCustomer() {
  if (
    !selectedId.value ||
    !customerDraftDirty.value ||
    !draftCompanyValid.value
  ) {
    return
  }

  sandboxSaving.value = true
  sandboxError.value = ''

  try {
    const response = await fetch(
      `/api/northwind/sandbox/customers/${selectedId.value}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerDraft.value),
      },
    )
    if (!response.ok) throw new Error('Customer changes could not be saved.')

    sandboxNotice.value = 'Customer changes saved in this browser session.'
    sandboxHasChanges.value = true
    await Promise.all([
      loadCustomers(),
      loadCustomerDetail(),
      loadSandboxStatus(),
    ])
  } catch (error) {
    sandboxError.value = error.message
  } finally {
    sandboxSaving.value = false
  }
}

async function resetSandbox() {
  sandboxError.value = ''
  try {
    const response = await fetch('/api/northwind/sandbox/reset', {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Sandbox could not be reset.')

    selectedId.value = null
    sandboxHasChanges.value = false
    sandboxExpiresAt.value = null
    sandboxNotice.value = 'Editing Sandbox reset to the vanilla Northwind copy.'
    await Promise.all([loadCustomers(), loadSandboxStatus()])
  } catch (error) {
    sandboxError.value = error.message
  }
}

function validateProfile() {
  if (!isProfileValid.value) return
  successMessage.value = 'Example profile validated successfully.'
}

function openDialog() {
  dialog.value?.showModal()
}

function handleTabKeydown(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()

  const currentIndex = tabNames.indexOf(activeTab.value)
  const nextIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabNames.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabNames.length) %
          tabNames.length

  activeTab.value = tabNames[nextIndex]
  event.currentTarget
    .closest('[role="tablist"]')
    .querySelector(`[data-tab="${activeTab.value}"]`)
    .focus()
}

watch(search, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    debouncedSearch.value = value
  }, 250)
})

watch(country, () => {
  page.value = 1
})

watch([debouncedSearch, country, sort, direction, page], loadCustomers)
watch(selectedId, loadCustomerDetail)
watch(selectedId, loadOrders)
watch(selectedOrderId, loadOrderDetail)

onMounted(() => {
  loadCountries()
  loadCustomers()
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  customerController?.abort()
  countryController?.abort()
  customerDetailController?.abort()
  ordersController?.abort()
  orderDetailController?.abort()
})
</script>

<template>
  <div class="showcase">
    <header class="showcase-header">
      <div>
        <span class="eyebrow">Frontend Lab</span>
        <h1>Vue showcase</h1>
        <p>
          Interactive UI patterns, form controls, and API-backed data binding
          built with accessible native controls.
        </p>
      </div>
      <div class="framework-badge" aria-label="Built with Vue">
        <span aria-hidden="true">V</span>
        <strong>Vue</strong>
      </div>
    </header>

    <nav class="showcase-nav" aria-label="Vue showcase sections">
      <a href="#vue-controls">Control gallery</a>
      <a href="#vue-northwind">Northwind data binding</a>
    </nav>

    <section
      id="vue-controls"
      class="controls-section"
      aria-labelledby="controls-heading"
    >
      <div class="section-heading">
        <div>
          <span class="eyebrow">Reactive UI state</span>
          <h2 id="controls-heading">Control gallery</h2>
        </div>
        <p>
          Every value below is bound to framework state and immediately
          reflected in the live summary.
        </p>
      </div>

      <div class="control-layout">
        <form class="control-card form-card" aria-labelledby="profile-heading" @submit.prevent="validateProfile">
          <div class="card-heading">
            <h3 id="profile-heading">Profile inputs</h3>
          </div>

          <div class="profile-fields">
            <label class="field-span">
              <span>Name</span>
              <input v-model="name" type="text" required aria-describedby="name-error" />
              <small v-if="!isNameValid" id="name-error" class="field-error">Enter a name.</small>
            </label>

            <label class="field-span">
              <span>Email</span>
              <input
                v-model="email"
                type="email"
                required
                :aria-invalid="!isEmailValid"
                aria-describedby="email-help"
              />
              <small
                id="email-help"
                :class="isEmailValid ? 'field-help' : 'field-error'"
              >
                {{
                  isEmailValid
                    ? 'Used for example notifications.'
                    : 'Enter a valid email address.'
                }}
              </small>
            </label>

            <div class="field-pair field-span">
              <label>
                <span>Seats</span>
                <input v-model.number="seats" type="number" min="1" max="20" />
              </label>
              <label>
                <span>Start date</span>
                <input v-model="startDate" type="date" />
              </label>
            </div>

            <label class="field-span">
              <span>Role</span>
              <select v-model="role">
                <option>Developer</option>
                <option>Designer</option>
                <option>Analyst</option>
                <option>Manager</option>
              </select>
            </label>
          </div>

          <fieldset>
            <legend>Interests</legend>
            <div class="choice-row">
              <label class="choice"><input v-model="interests" type="checkbox" value="Data" /> Data</label>
              <label class="choice"><input v-model="interests" type="checkbox" value="Design" /> Design</label>
              <label class="choice"><input v-model="interests" type="checkbox" value="Automation" /> Automation</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Preferred contact</legend>
            <div class="choice-row">
              <label class="choice"><input v-model="contact" type="radio" value="Email" /> Email</label>
              <label class="choice"><input v-model="contact" type="radio" value="Phone" /> Phone</label>
              <label class="choice"><input v-model="contact" type="radio" value="Chat" /> Chat</label>
            </div>
          </fieldset>

          <div class="form-actions">
            <button class="primary-button" type="submit" :disabled="!isProfileValid">
              Validate profile
            </button>
            <button class="secondary-button" type="button" @click="openDialog">
              Open dialog
            </button>
            <button class="secondary-button" type="button" disabled>Disabled</button>
          </div>
        </form>

        <div class="control-stack">
          <article class="control-card" aria-labelledby="preferences-heading">
            <div class="card-heading">
              <h3 id="preferences-heading">Preferences and progress</h3>
            </div>

            <label class="switch-row">
              <span>
                <strong>Notifications</strong>
                <small>Enable status updates</small>
              </span>
              <input v-model="notifications" type="checkbox" role="switch" />
            </label>

            <label class="range-field">
              <span>Confidence <strong>{{ confidence }}%</strong></span>
              <input v-model.number="confidence" type="range" min="0" max="100" />
            </label>
            <progress
              :value="confidence"
              max="100"
              :aria-label="`Confidence ${confidence}%`"
            />
          </article>

          <article class="control-card" aria-labelledby="preview-heading">
            <div class="card-heading">
              <h3 id="preview-heading">Bound state</h3>
            </div>

            <div class="tabs" role="tablist" aria-label="Profile views">
              <button
                id="profile-summary-tab"
                type="button"
                role="tab"
                data-tab="summary"
                :aria-selected="activeTab === 'summary'"
                aria-controls="profile-summary-panel"
                @click="activeTab = 'summary'"
                @keydown="handleTabKeydown"
              >
                Summary
              </button>
              <button
                id="profile-settings-tab"
                type="button"
                role="tab"
                data-tab="settings"
                :aria-selected="activeTab === 'settings'"
                aria-controls="profile-settings-panel"
                @click="activeTab = 'settings'"
                @keydown="handleTabKeydown"
              >
                Settings
              </button>
            </div>

            <div
              v-if="activeTab === 'summary'"
              id="profile-summary-panel"
              class="tab-panel"
              role="tabpanel"
              aria-labelledby="profile-summary-tab"
              tabindex="0"
            >
              <h3>{{ name || 'Unnamed profile' }}</h3>
              <dl class="summary-list">
                <div><dt>Role</dt><dd>{{ role }}</dd></div>
                <div><dt>Seats</dt><dd>{{ seats }}</dd></div>
                <div><dt>Contact</dt><dd>{{ contact }}</dd></div>
                <div><dt>Interests</dt><dd>{{ interests.join(', ') || 'None' }}</dd></div>
              </dl>
            </div>
            <div
              v-else
              id="profile-settings-panel"
              class="tab-panel"
              role="tabpanel"
              aria-labelledby="profile-settings-tab"
              tabindex="0"
            >
              <h3>Current settings</h3>
              <p>
                Notifications are
                <strong>{{ notifications ? 'enabled' : 'disabled' }}</strong>.
                The selected start date is {{ startDate }}.
              </p>
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

      <div v-if="successMessage" class="notification" role="status" aria-live="polite">
        <span>{{ successMessage }}</span>
        <button
          type="button"
          aria-label="Dismiss notification"
          @click="successMessage = ''"
        >
          ×
        </button>
      </div>
    </section>

    <section
      id="vue-northwind"
      class="data-section"
      aria-labelledby="data-heading"
    >
      <div class="section-heading">
        <div>
          <span class="eyebrow">API-backed state</span>
          <h2 id="data-heading">Northwind data binding</h2>
        </div>
        <p>
          Server-driven filtering, sorting, paging, and selection against the
          Northwind API.
        </p>
      </div>

      <aside class="sandbox-panel" aria-labelledby="sandbox-heading">
        <div>
          <span class="eyebrow">Session-isolated editing</span>
          <h3 id="sandbox-heading">Editing Sandbox</h3>
          <p>
            Changes use an in-memory browser-session copy. Canonical Northwind
            customers and every order remain read-only.
          </p>
        </div>
        <label class="switch-row">
          <span>
            <strong>{{ sandboxEnabled ? 'Enabled' : 'Disabled' }}</strong>
            <small>
              {{ sandboxHasChanges ? 'Changes made' : 'Vanilla copy' }}
            </small>
          </span>
          <input
            type="checkbox"
            role="switch"
            aria-label="Editing sandbox"
            :checked="sandboxEnabled"
            @change="setSandboxEnabled($event.target.checked, $event.target)"
          />
        </label>
        <button
          v-if="sandboxEnabled"
          type="button"
          class="secondary-button"
          @click="resetSandbox"
        >
          Reset sandbox
        </button>
        <small v-if="sandboxEnabled && sandboxExpiresAt">
          Session copy expires after 30 minutes without sandbox activity.
        </small>
        <p v-if="sandboxNotice" class="notice" role="status">
          {{ sandboxNotice }}
        </p>
        <p v-if="sandboxError" class="request-error" role="alert">
          {{ sandboxError }}
        </p>
      </aside>

      <article class="data-card grid-card" aria-labelledby="explorer-heading">
        <div class="data-heading">
          <div>
            <h3 id="explorer-heading">Customer explorer</h3>
          </div>
          <p>{{ totalCount }} Northwind records</p>
        </div>

        <div class="filter-grid">
          <label>
            <span>Search customers</span>
            <input
              v-model="search"
              type="search"
              placeholder="Company or contact"
            />
          </label>
          <label>
            <span>Country</span>
            <select v-model="country">
              <option value="">All countries</option>
              <option v-for="item in countries" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>
        </div>

        <p v-if="countriesError" class="request-error" role="alert">
          {{ countriesError }}
        </p>
        <p
          v-if="customersLoading"
          class="loading-state"
          role="status"
          aria-live="polite"
        >
          Loading customers…
        </p>
        <div v-else-if="customersError" class="request-error" role="alert">
          <p>{{ customersError }}</p>
          <button type="button" class="secondary-button" @click="loadCustomers">
            Try again
          </button>
        </div>
        <p v-else-if="customers.length === 0" class="empty-state" role="status">
          No customers match these filters.
        </p>

        <div v-else class="table-scroll">
          <table>
            <caption class="visually-hidden">
              Filtered Northwind customers
            </caption>
            <thead>
              <tr>
                <th
                  v-for="[key, label] in columns"
                  :key="key"
                  scope="col"
                  :aria-sort="ariaSort(key)"
                >
                  <button type="button" class="sort-button" @click="changeSort(key)">
                    {{ label }}
                    <span v-if="sort === key" aria-hidden="true">
                      {{ direction === 'asc' ? '↑' : '↓' }}
                    </span>
                    <span v-if="sort !== key" aria-hidden="true">↕</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="customer in customers"
                :key="customer.customerId"
                :class="{ selected: selectedId === customer.customerId }"
                :aria-selected="selectedId === customer.customerId"
                tabindex="0"
                @click="selectCustomer(customer.customerId)"
                @keydown.enter="selectCustomer(customer.customerId)"
                @keydown.space.prevent="selectCustomer(customer.customerId)"
              >
                <td data-label="Company">
                  {{ customer.companyName }}
                </td>
                <td data-label="Contact">{{ customer.contactName || '—' }}</td>
                <td data-label="City">{{ customer.city || '—' }}</td>
                <td data-label="Country">{{ customer.country || '—' }}</td>
                <td data-label="ID"><code>{{ customer.customerId }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" aria-label="Customer pages">
          <button
            type="button"
            class="secondary-button"
            :disabled="page <= 1 || customersLoading"
            @click="page -= 1"
          >
            Previous
          </button>
          <span>{{ pageDescription }}</span>
          <button
            type="button"
            class="secondary-button"
            :disabled="page >= totalPages || customersLoading"
            @click="page += 1"
          >
            Next
          </button>
        </div>
        <p class="selection-status" aria-live="polite">
          {{ selectedId ? `Selected: ${selectedId}` : 'Select a customer' }}
        </p>
      </article>

      <article class="data-card detail-card" aria-labelledby="customer-details-heading">
        <div class="data-heading">
          <div>
            <h3 id="customer-details-heading">Customer details</h3>
          </div>
          <code v-if="selectedId">{{ selectedId }}</code>
        </div>

        <p v-if="!selectedId" class="empty-state">
          Select a customer to bind its complete record and sales metrics.
        </p>
        <p
          v-else-if="customerDetailLoading"
          class="loading-state"
          role="status"
          aria-live="polite"
        >
          Loading customer details…
        </p>
        <div v-else-if="customerDetailError" class="request-error" role="alert">
          <p>{{ customerDetailError }}</p>
          <button type="button" class="secondary-button" @click="loadCustomerDetail">
            Try again
          </button>
        </div>
        <div v-else-if="customerDetail" class="customer-detail-layout">
          <dl class="metric-grid" aria-label="Customer sales metrics">
            <div>
              <dt>Orders</dt>
              <dd>{{ customerDetail.orderCount }}</dd>
            </div>
            <div>
              <dt>Total sales</dt>
              <dd>{{ formatCurrency(customerDetail.totalSales) }}</dd>
            </div>
            <div>
              <dt>Last order</dt>
              <dd>{{ formatDate(customerDetail.lastOrderDate) }}</dd>
            </div>
          </dl>

          <form
            v-if="sandboxEnabled"
            class="customer-edit-form detail-form"
            aria-label="Edit selected customer"
            @submit.prevent="saveCustomer"
          >
            <label v-for="[key, label] in editableCustomerFields" :key="key">
              <span>{{ label }}</span>
              <input
                v-model="customerDraft[key]"
                type="text"
                :required="key === 'companyName'"
              />
            </label>
            <p v-if="!draftCompanyValid" class="field-error">
              Company name is required.
            </p>
            <p class="dirty-status" aria-live="polite">
              {{ customerDraftDirty ? 'Unsaved fields' : 'No unsaved fields' }}
            </p>
            <div class="button-row detail-actions">
              <button
                class="primary-button"
                type="submit"
                :disabled="!customerDraftDirty || !draftCompanyValid || sandboxSaving"
              >
                {{ sandboxSaving ? 'Saving…' : 'Save changes' }}
              </button>
              <button
                class="secondary-button"
                type="button"
                :disabled="!customerDraftDirty || sandboxSaving"
                @click="discardCustomerChanges"
              >
                Discard
              </button>
            </div>
          </form>
          <dl v-else class="detail-grid customer-detail">
            <div><dt>Company</dt><dd>{{ customerDetail.companyName }}</dd></div>
            <div><dt>Contact</dt><dd>{{ customerDetail.contactName || '—' }}</dd></div>
            <div><dt>Title</dt><dd>{{ customerDetail.contactTitle || '—' }}</dd></div>
            <div><dt>Address</dt><dd>{{ customerDetail.address || '—' }}</dd></div>
            <div><dt>City</dt><dd>{{ customerDetail.city || '—' }}</dd></div>
            <div><dt>Region</dt><dd>{{ customerDetail.region || '—' }}</dd></div>
            <div><dt>Postal code</dt><dd>{{ customerDetail.postalCode || '—' }}</dd></div>
            <div><dt>Country</dt><dd>{{ customerDetail.country || '—' }}</dd></div>
            <div><dt>Phone</dt><dd>{{ customerDetail.phone || '—' }}</dd></div>
            <div><dt>Fax</dt><dd>{{ customerDetail.fax || '—' }}</dd></div>
          </dl>
        </div>
      </article>

      <article class="data-card orders-card" aria-labelledby="orders-heading">
        <div class="data-heading">
          <div>
            <h3 id="orders-heading">Orders and line items</h3>
          </div>
          <span v-if="orders.length">{{ orders.length }} orders</span>
        </div>

        <p v-if="!selectedId" class="empty-state">
          Select a customer to load their orders.
        </p>
        <p
          v-else-if="ordersLoading"
          class="loading-state"
          role="status"
          aria-live="polite"
        >
          Loading customer orders…
        </p>
        <div v-else-if="ordersError" class="request-error" role="alert">
          <p>{{ ordersError }}</p>
          <button type="button" class="secondary-button" @click="loadOrders">
            Try again
          </button>
        </div>
        <p v-else-if="orders.length === 0" class="empty-state">
          This customer has no orders.
        </p>

        <div v-else class="order-workspace orders-layout">
          <div class="order-list" aria-label="Customer orders">
            <button
              v-for="order in orders"
              :key="order.orderId"
              type="button"
              class="order-card"
              :aria-pressed="selectedOrderId === order.orderId"
              @click="selectedOrderId = order.orderId"
            >
              <span>
                <strong>Order {{ order.orderId }}</strong>
                <small>{{ formatDate(order.orderDate) }}</small>
              </span>
              <span>
                <strong>{{ formatCurrency(order.total) }}</strong>
                <small :class="['order-status', order.status.toLowerCase()]">
                  {{ order.status }}
                </small>
              </span>
            </button>
          </div>

          <div class="order-detail" aria-live="polite">
            <p v-if="orderDetailLoading" class="loading-state" role="status">
              Loading order details…
            </p>
            <div v-else-if="orderDetailError" class="request-error" role="alert">
              <p>{{ orderDetailError }}</p>
              <button type="button" class="secondary-button" @click="loadOrderDetail">
                Try again
              </button>
            </div>
            <div v-else-if="orderDetail">
              <div class="order-detail-heading">
                <p class="card-kicker">Order {{ orderDetail.orderId }}</p>
                <h4>{{ orderDetail.status }}</h4>
                <p>{{ formatDate(orderDetail.orderDate) }}</p>
              </div>
              <dl class="order-summary">
                  <div><dt>Employee</dt><dd>{{ orderDetail.employeeName || 'Unassigned' }}</dd></div>
                  <div><dt>Shipper</dt><dd>{{ orderDetail.shipperName || 'Unassigned' }}</dd></div>
                  <div>
                    <dt>Destination</dt>
                    <dd>
                      {{ orderDetail.shippingAddress.city || '—' }},
                      {{ orderDetail.shippingAddress.country || '—' }}
                    </dd>
                  </div>
              </dl>

              <div class="table-scroll line-items-wrap">
                <table>
                  <caption class="visually-hidden">Order line items</caption>
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Qty.</th>
                      <th scope="col">Price</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in orderDetail.items" :key="item.productId">
                      <td>{{ item.productName }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ formatCurrency(item.unitPrice) }}</td>
                      <td>{{ formatCurrency(item.extendedPrice) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <dl class="order-totals">
                <div><dt>Subtotal</dt><dd>{{ formatCurrency(orderDetail.subtotal) }}</dd></div>
                <div><dt>Freight</dt><dd>{{ formatCurrency(orderDetail.freight) }}</dd></div>
                <div class="grand-total"><dt>Total</dt><dd>{{ formatCurrency(orderDetail.total) }}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </article>
    </section>

    <dialog ref="dialog">
      <form method="dialog">
        <span class="eyebrow">Native dialog</span>
        <h2>Vue-controlled launch</h2>
        <p>This modal uses the browser dialog element for focus management and keyboard dismissal.</p>
        <button class="primary-button">Close dialog</button>
      </form>
    </dialog>
  </div>
</template>

<style src="../../shared/showcase-contract.css"></style>
