<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
const dialogCloseButton = ref(null)
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatDate(value) {
  if (!value) return 'No orders'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
    new Date(value),
  )
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

async function openDialog() {
  dialog.value?.showModal()
  await nextTick()
  dialogCloseButton.value?.focus()
}

function closeDialog() {
  dialog.value?.close()
}

function handleDialogKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDialog()
    return
  }

  if (event.key !== 'Tab') return

  const controls = [...dialog.value.querySelectorAll('button')]
  const first = controls[0]
  const last = controls.at(-1)
  const activeElement = dialog.value.getRootNode().activeElement

  if (event.shiftKey && activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && activeElement === last) {
    event.preventDefault()
    first.focus()
  }
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

          <label>
            <span>Name</span>
            <input v-model="name" type="text" required aria-describedby="name-error" />
          </label>
          <p v-if="!isNameValid" id="name-error" class="field-error">Enter a name.</p>

          <label>
            <span>Email</span>
            <input
              v-model="email"
              type="email"
              required
              :aria-invalid="!isEmailValid"
              aria-describedby="email-help"
            />
          </label>
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

          <div class="field-pair">
            <label>
              <span>Seats</span>
              <input v-model.number="seats" type="number" min="1" max="20" />
            </label>
            <label>
              <span>Start date</span>
              <input v-model="startDate" type="date" />
            </label>
          </div>

          <label>
            <span>Role</span>
            <select v-model="role">
              <option>Developer</option>
              <option>Designer</option>
              <option>Analyst</option>
              <option>Manager</option>
            </select>
          </label>

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

            <label>
              <span>Confidence <strong>{{ confidence }}%</strong></span>
              <input class="range-field" v-model.number="confidence" type="range" min="0" max="100" />
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
          <p class="card-kicker">Session-isolated editing</p>
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
          Session copy expires {{ formatDate(sandboxExpiresAt) }}.
        </small>
        <p v-if="sandboxNotice" class="notice" role="status">
          {{ sandboxNotice }}
        </p>
        <p v-if="sandboxError" class="request-error" role="alert">
          {{ sandboxError }}
        </p>
      </aside>

      <article class="data-card" aria-labelledby="explorer-heading">
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

      <article class="data-card" aria-labelledby="customer-details-heading">
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
            class="customer-edit-form"
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
            <div class="button-row">
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
          <dl v-else class="detail-grid">
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

      <article class="data-card" aria-labelledby="orders-heading">
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

        <div v-else class="order-workspace">
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
                <small>{{ order.status }}</small>
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
              <div class="order-summary">
                <div>
                  <p class="card-kicker">Order {{ orderDetail.orderId }}</p>
                  <h4>{{ orderDetail.status }}</h4>
                  <p>{{ formatDate(orderDetail.orderDate) }}</p>
                </div>
                <dl>
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
              </div>

              <div class="table-scroll">
                <table>
                  <caption class="visually-hidden">
                    Products in order {{ orderDetail.orderId }}
                  </caption>
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

    <dialog
      ref="dialog"
      aria-labelledby="dialog-heading"
      @keydown="handleDialogKeydown"
    >
      <div class="dialog-content">
        <p class="card-kicker">Vue dialog</p>
        <h2 id="dialog-heading">Keyboard-ready modal</h2>
        <p>Focus stays within this dialog until it is closed.</p>
        <div class="button-row">
          <button ref="dialogCloseButton" class="primary-button" type="button" @click="closeDialog">
            Close dialog
          </button>
          <button class="secondary-button" type="button" @click="closeDialog">Done</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style>
:host {
  color: #193330;
  display: block;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

.showcase-shell {
  display: grid;
  gap: 1.5rem;
}

.showcase-header,
section {
  background: #f5fbf8;
  border: 1px solid #c9ddd5;
  border-radius: 1rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.section-intro {
  color: #4c625e;
}

.notice {
  align-items: center;
  background: #dff6e9;
  border: 1px solid #58a27e;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
}

.gallery-grid,
.gallery-stack {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.gallery-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  margin-top: 1.5rem;
}

.gallery-card {
  background: rgb(255 255 255 / 72%);
  border: 1px solid #c9ddd5;
  border-radius: 0.8rem;
  display: grid;
  gap: 1rem;
  min-width: 0;
  padding: 1.25rem;
}

.card-heading h3,
.card-heading p {
  margin-bottom: 0;
}

.card-kicker {
  color: #287a5b;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

label {
  display: grid;
  font-weight: 700;
  gap: 0.4rem;
}

input,
select {
  background: white;
  border: 1px solid #84a69a;
  border-radius: 0.45rem;
  color: #193330;
  font: inherit;
  min-width: 0;
  padding: 0.65rem 0.75rem;
}

input:focus-visible,
select:focus-visible,
summary:focus-visible {
  outline: 3px solid #41b883;
  outline-offset: 2px;
}

.field-pair {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr 1fr;
}

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}

legend {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.choice-row,
.button-row,
[role="tablist"] {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.choice-row label {
  align-items: center;
  display: flex;
  font-weight: 500;
}

.field-error {
  color: #a32424;
  font-size: 0.85rem;
  margin: -0.75rem 0 0;
}

.switch-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.switch-row span {
  display: grid;
}

.switch-row small {
  font-weight: 400;
}

.switch-row input {
  height: 1.4rem;
  width: 2.6rem;
}

input[type="range"],
progress {
  accent-color: #287a5b;
  width: 100%;
}

.primary-button {
  background: #287a5b;
  color: white;
}

.secondary-button {
  background: white;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.icon-button {
  border: 0;
  font-size: 1.25rem;
  padding: 0.2rem 0.5rem;
}

[role="tab"][aria-selected="true"] {
  background: #287a5b;
  color: white;
}

dl {
  display: grid;
  gap: 0.6rem;
  margin: 0;
}

dl div {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

dt {
  font-weight: 700;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
  text-align: right;
}

details {
  border-top: 1px solid #c9ddd5;
  padding-top: 1rem;
}

summary {
  cursor: pointer;
  font-weight: 700;
}

dialog {
  background: #f5fbf8;
  border: 1px solid #72a790;
  border-radius: 1rem;
  color: #193330;
  max-width: min(30rem, calc(100vw - 2rem));
  padding: 0;
}

dialog::backdrop {
  background: rgb(7 28 24 / 72%);
}

.dialog-content {
  padding: 1.5rem;
}

.data-card {
  background: rgb(255 255 255 / 72%);
  border: 1px solid #c9ddd5;
  border-radius: 0.8rem;
  margin-top: 1.5rem;
  min-width: 0;
  padding: 1.25rem;
}

.data-heading,
.pagination {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.data-heading h3,
.data-heading p {
  margin-bottom: 0;
}

.filter-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 2fr) minmax(12rem, 1fr);
  margin: 1.25rem 0;
}

.loading-state,
.empty-state,
.request-error {
  border: 1px dashed #84a69a;
  border-radius: 0.6rem;
  margin: 1rem 0;
  padding: 1rem;
}

.request-error {
  background: #fff0f0;
  border-color: #c76b6b;
  color: #7e1f1f;
}

.table-scroll {
  max-width: 100%;
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  min-width: 48rem;
  width: 100%;
}

th,
td {
  border-bottom: 1px solid #c9ddd5;
  padding: 0.75rem;
  text-align: left;
}

th {
  background: #eaf7f1;
}

tbody tr {
  cursor: pointer;
}

tbody tr:hover,
tbody tr.selected {
  background: #dff6e9;
}

.sort-button {
  border: 0;
  border-radius: 0.25rem;
  padding: 0.2rem;
  text-align: left;
}

.sort-button {
  align-items: center;
  display: inline-flex;
  gap: 0.35rem;
}

.pagination {
  margin-top: 1rem;
}

.selection-status {
  color: #4c625e;
  margin: 1rem 0 0;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.customer-detail-layout {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.25rem;
}

.sandbox-panel {
  align-items: center;
  background: #eaf7f1;
  border: 1px solid #72a790;
  border-radius: 0.8rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto auto;
  margin-top: 1.25rem;
  padding: 1.25rem;
}

.sandbox-panel h3,
.sandbox-panel p {
  margin-bottom: 0.35rem;
}

.sandbox-panel .notice,
.sandbox-panel .request-error,
.sandbox-panel > small {
  grid-column: 1 / -1;
  margin: 0;
}

.customer-edit-form {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.customer-edit-form .button-row,
.customer-edit-form .dirty-status,
.customer-edit-form .field-error {
  grid-column: 1 / -1;
}

.dirty-status {
  color: #4c625e;
  font-weight: 700;
  margin: 0;
}

.metric-grid,
.detail-grid {
  display: grid;
  gap: 0.75rem;
}

.metric-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-grid div {
  background: #eaf7f1;
  border-radius: 0.6rem;
  display: grid;
  gap: 0.3rem;
  justify-content: initial;
  padding: 1rem;
}

.metric-grid dd {
  color: #146247;
  font-size: 1.25rem;
  font-weight: 800;
  text-align: left;
}

.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.detail-grid div {
  border-bottom: 1px solid #c9ddd5;
  padding: 0.6rem 0;
}

.order-workspace {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(14rem, 0.7fr) minmax(0, 1.8fr);
  margin-top: 1.25rem;
  min-width: 0;
}

.order-list {
  display: grid;
  gap: 0.65rem;
  max-height: 38rem;
  overflow-y: auto;
}

.order-card {
  align-items: center;
  border-radius: 0.6rem;
  display: flex;
  justify-content: space-between;
  padding: 0.85rem;
  text-align: left;
}

.order-card span {
  display: grid;
  gap: 0.25rem;
}

.order-card span:last-child {
  text-align: right;
}

.order-card small {
  font-weight: 400;
}

.order-card[aria-pressed="true"] {
  background: #287a5b;
  color: white;
}

.order-detail {
  min-width: 0;
}

.order-summary {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(10rem, 0.7fr) minmax(0, 1fr);
  margin-bottom: 1rem;
}

.order-summary h4 {
  font-size: 1.5rem;
  margin: 0 0 0.35rem;
}

.order-totals {
  margin-left: auto;
  margin-top: 1rem;
  max-width: 20rem;
}

.order-totals .grand-total {
  border-top: 2px solid #72a790;
  font-size: 1.1rem;
  margin-top: 0.4rem;
  padding-top: 0.6rem;
}

.showcase-header {
  background:
    radial-gradient(circle at top right, rgb(65 184 131 / 28%), transparent 42%),
    #eaf7f1;
}

.eyebrow,
.section-number {
  color: #287a5b;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1;
  margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
}

button {
  background: transparent;
  border: 1px solid #72a790;
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 0.65rem 1rem;
  white-space: nowrap;
}

button:hover,
button:focus-visible,
button[aria-current="page"] {
  background: #287a5b;
  color: white;
}

button:focus-visible {
  outline: 3px solid #41b883;
  outline-offset: 3px;
}

@media (prefers-color-scheme: dark) {
  :host {
    color: #e6f4ee;
  }

  .showcase-header,
  section {
    background: #102c28;
    border-color: #35645a;
  }

  .showcase-header {
    background:
      radial-gradient(circle at top right, rgb(65 184 131 / 24%), transparent 42%),
      #143832;
  }

  .eyebrow,
  .section-number,
  .card-kicker {
    color: #75d5aa;
  }

  .section-intro {
    color: #b8cec5;
  }

  .gallery-card,
  .data-card,
  dialog {
    background: #173a34;
    border-color: #467569;
    color: #e6f4ee;
  }

  input,
  select,
  .secondary-button {
    background: #0d2925;
    border-color: #56877a;
    color: #e6f4ee;
  }

  .notice {
    background: #164c3c;
  }

  th {
    background: #16453c;
  }

  tbody tr:hover,
  tbody tr.selected {
    background: #1e5447;
  }


  .selection-status {
    color: #b8cec5;
  }

  .request-error {
    background: #4a2020;
    color: #ffd8d8;
  }

  .metric-grid div {
    background: #16453c;
  }

  .sandbox-panel {
    background: #16453c;
    border-color: #467569;
  }

  .dirty-status {
    color: #b8cec5;
  }

  .metric-grid dd {
    color: #75d5aa;
  }
}

@media (max-width: 1100px) {
  .gallery-grid,
  .order-workspace {
    grid-template-columns: 1fr;
  }

  .order-list {
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    max-height: none;
  }

  .sandbox-panel {
    align-items: start;
    grid-template-columns: 1fr;
  }

  .sandbox-panel .notice,
  .sandbox-panel .request-error,
  .sandbox-panel > small {
    grid-column: auto;
  }
}

@media (max-width: 760px) {
  .field-pair,
  .filter-grid,
  .metric-grid,
  .detail-grid,
  .customer-edit-form {
    grid-template-columns: 1fr;
  }

  .data-heading,
  .pagination,
  .order-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-summary {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

@media (forced-colors: active) {
  button,
  input,
  select,
  .gallery-card,
  .notice {
    border: 1px solid CanvasText;
  }
}

/* Shared Frontend Lab visual contract. Keep these tokens and structural rules
   aligned with the React and Angular implementations. */
:host {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgb(170 59 255 / 10%);
  --accent-border: rgb(170 59 255 / 50%);
  --shadow: rgb(0 0 0 / 10%) 0 10px 15px -3px, rgb(0 0 0 / 5%) 0 4px 6px -2px;
  background: var(--bg);
  color: var(--text);
  color-scheme: light dark;
  border-radius: 14px;
  font: 16px/160% Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: 0.18px;
  overflow: hidden;
}

.showcase {
  background: transparent;
  display: block;
  padding: 48px;
  text-align: left;
}

.showcase-header {
  align-items: flex-start;
  background: transparent;
  border: 0;
  border-radius: 0;
  display: flex;
  gap: 32px;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0;
}

.showcase-header h1 {
  color: var(--text-h);
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -1.68px;
  line-height: 160%;
  margin: 6px 0 10px;
}

.showcase-header p {
  font-size: 17px;
  max-width: 680px;
}

.framework-badge {
  align-items: center;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 999px;
  color: var(--text-h);
  display: flex;
  flex: 0 0 auto;
  font-weight: 650;
  gap: 10px;
  padding: 10px 14px;
}

.framework-badge > span {
  align-items: center;
  background: var(--accent);
  border-radius: 50%;
  color: white;
  display: inline-flex;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.showcase-nav {
  display: flex;
  gap: 10px;
  margin: 0 0 28px;
  overflow-x: auto;
  padding: 0 0 4px;
}

.showcase-nav a {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-h);
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 11px;
  text-decoration: none;
}

.showcase-nav a:hover {
  border-color: var(--accent-border);
  color: var(--accent);
}

.controls-section,
.data-section {
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 32px 0 16px;
}

.controls-section {
  border-top: 1px solid var(--border);
}

.data-section {
  border-top: 1px solid var(--border);
  margin-top: 42px;
}

.section-heading {
  align-items: end;
  display: flex;
  gap: 32px;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-heading h2 {
  color: var(--text-h);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.24px;
  line-height: 160%;
  margin: 4px 0 0;
}

.section-heading p {
  font-size: 15px;
  max-width: 560px;
}

.eyebrow,
.card-kicker {
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.control-layout {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
}

.control-layout > *,
.control-stack,
.data-card,
.order-workspace > * {
  min-width: 0;
}

.control-stack {
  display: grid;
  gap: 18px;
}

.control-card,
.data-card,
.sandbox-panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  color: var(--text);
  padding: 22px;
}

.control-card {
  display: block;
}

.control-card h3,
.data-card h3,
.sandbox-panel h3 {
  color: var(--text-h);
}

label {
  font-size: 13px;
  line-height: 160%;
}

.data-card {
  margin-top: 18px;
}

.gallery-card,
.gallery-stack,
.gallery-grid {
  min-width: 0;
}

.filter-grid {
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 0.55fr);
}

.table-scroll {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow-x: auto;
}

table {
  min-width: 720px;
  width: 100%;
}

th {
  background: var(--code-bg);
}

tbody tr.selected {
  background: var(--accent-bg);
  box-shadow: inset 3px 0 0 var(--accent);
}

.order-workspace {
  grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1.3fr);
}

button,
input,
select {
  font: inherit;
}

.primary-button,
.secondary-button {
  border-radius: 7px;
  cursor: pointer;
  font-weight: 700;
  min-height: 40px;
  padding: 8px 13px;
}

.primary-button,
.primary-button:hover,
.primary-button:focus-visible {
  background: var(--accent);
  border: 1px solid var(--accent);
  color: white;
}

.secondary-button,
.secondary-button:hover,
.secondary-button:focus-visible {
  background: var(--code-bg);
  border: 1px solid var(--border);
  color: var(--text-h);
}

.tabs {
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 4px;
  padding-bottom: 12px;
}

.tabs button {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: var(--text);
  padding: 7px 10px;
}

.tabs button[aria-selected='true'],
.tabs button[aria-selected='true']:hover,
.tabs button[aria-selected='true']:focus-visible {
  background: var(--accent-bg);
  color: var(--accent);
}

.tab-panel {
  min-height: 155px;
  padding-top: 18px;
}

.summary-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.summary-list div,
.metric-grid div {
  background: var(--code-bg);
  border-radius: 7px;
  padding: 10px;
}

.metric-grid dd {
  color: var(--accent);
}

.sandbox-panel {
  align-items: center;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr) auto auto;
  margin: 0 0 18px;
  padding: 22px;
}

.sandbox-panel h3,
.sandbox-panel p {
  margin: 4px 0 0;
}

.sandbox-panel .notice,
.sandbox-panel .request-error,
.sandbox-panel > small {
  grid-column: 1 / -1;
  margin: 0;
}

.order-card[aria-pressed='true'],
.order-card[aria-pressed='true']:hover,
.order-card[aria-pressed='true']:focus-visible {
  background: var(--accent-bg);
  border-color: var(--accent-border);
  color: var(--text-h);
}

input:not([type='checkbox']):not([type='radio']):not([type='range']),
select {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-h);
}

input[type='checkbox'],
input[type='radio'],
input[type='range'],
progress {
  accent-color: var(--accent);
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
summary:focus-visible,
a:focus-visible {
  outline: 3px solid var(--accent-border);
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  :host {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgb(192 132 252 / 15%);
    --accent-border: rgb(192 132 252 / 50%);
    --shadow: rgb(0 0 0 / 40%) 0 10px 15px -3px, rgb(0 0 0 / 25%) 0 4px 6px -2px;
  }
}

@media (max-width: 1100px) {
  .control-layout,
  .order-workspace {
    grid-template-columns: 1fr;
  }

  .sandbox-panel {
    align-items: start;
    grid-template-columns: 1fr;
  }

  .sandbox-panel .notice,
  .sandbox-panel .request-error,
  .sandbox-panel > small {
    grid-column: auto;
  }
}

@media (max-width: 760px) {
  .showcase {
    padding: 24px 16px 40px;
  }

  .showcase-header,
  .section-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .framework-badge {
    align-self: flex-start;
  }

  .field-pair,
  .filter-grid,
  .customer-detail-layout,
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<style src="../../shared/showcase-contract.css"></style>
