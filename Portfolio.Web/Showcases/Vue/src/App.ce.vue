<script setup>
import { computed, nextTick, ref } from 'vue'

const activeSection = ref('controls')
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

const isNameValid = computed(() => name.value.trim().length > 0)
const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
)
const isProfileValid = computed(
  () => isNameValid.value && isEmailValid.value,
)

function validateProfile() {
  if (!isProfileValid.value) return
  successMessage.value = `Profile validated for ${name.value.trim()}.`
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
</script>

<template>
  <div class="showcase-shell">
    <header class="showcase-header">
      <p class="eyebrow">Frontend lab · Vue</p>
      <h1>Vue interface showcase</h1>
      <p>
        The shared Frontend Lab experience, implemented with Vue components and
        the Composition API.
      </p>
    </header>

    <nav aria-label="Vue showcase sections">
      <button
        type="button"
        :aria-current="activeSection === 'controls' ? 'page' : undefined"
        @click="activeSection = 'controls'"
      >
        Control Gallery
      </button>
      <button
        type="button"
        :aria-current="activeSection === 'northwind' ? 'page' : undefined"
        @click="activeSection = 'northwind'"
      >
        Northwind Data Binding
      </button>
    </nav>

    <section id="controls" aria-labelledby="controls-heading">
      <p class="section-number">01 · Local state</p>
      <h2 id="controls-heading">Control Gallery</h2>
      <p class="section-intro">
        Native form controls bound through Vue refs and computed state.
      </p>

      <div
        v-if="successMessage"
        class="notice"
        role="status"
        aria-live="polite"
      >
        <span>{{ successMessage }}</span>
        <button
          type="button"
          class="icon-button"
          aria-label="Dismiss success message"
          @click="successMessage = ''"
        >
          ×
        </button>
      </div>

      <div class="gallery-grid">
        <form class="gallery-card" aria-labelledby="profile-heading" @submit.prevent="validateProfile">
          <div class="card-heading">
            <p class="card-kicker">Profile form</p>
            <h3 id="profile-heading">Attendee details</h3>
          </div>

          <label>
            <span>Name</span>
            <input v-model="name" type="text" required aria-describedby="name-error" />
          </label>
          <p v-if="!isNameValid" id="name-error" class="field-error">Enter a name.</p>

          <label>
            <span>Email</span>
            <input v-model="email" type="email" required aria-describedby="email-error" />
          </label>
          <p v-if="!isEmailValid" id="email-error" class="field-error">
            Enter a valid email address.
          </p>

          <div class="field-pair">
            <label>
              <span>Seats</span>
              <input v-model.number="seats" type="number" min="1" max="12" />
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
              <option>Product manager</option>
            </select>
          </label>

          <fieldset>
            <legend>Interests</legend>
            <div class="choice-row">
              <label><input v-model="interests" type="checkbox" value="Data" /> Data</label>
              <label><input v-model="interests" type="checkbox" value="UI" /> UI</label>
              <label><input v-model="interests" type="checkbox" value="Testing" /> Testing</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Preferred contact</legend>
            <div class="choice-row">
              <label><input v-model="contact" type="radio" value="Email" /> Email</label>
              <label><input v-model="contact" type="radio" value="Phone" /> Phone</label>
            </div>
          </fieldset>

          <button class="primary-button" type="submit" :disabled="!isProfileValid">
            Validate profile
          </button>
        </form>

        <div class="gallery-stack">
          <article class="gallery-card" aria-labelledby="preferences-heading">
            <div class="card-heading">
              <p class="card-kicker">Preferences</p>
              <h3 id="preferences-heading">Experience settings</h3>
            </div>

            <label class="switch-row">
              <span>
                <strong>Notifications</strong>
                <small>Receive event updates</small>
              </span>
              <input v-model="notifications" type="checkbox" role="switch" />
            </label>

            <label>
              <span>Confidence: {{ confidence }}%</span>
              <input v-model.number="confidence" type="range" min="0" max="100" />
            </label>
            <progress :value="confidence" max="100">{{ confidence }}%</progress>

            <div class="button-row">
              <button class="primary-button" type="button" @click="openDialog">
                Open dialog
              </button>
              <button class="secondary-button" type="button">Secondary</button>
              <button type="button" disabled>Disabled</button>
            </div>
          </article>

          <article class="gallery-card" aria-labelledby="preview-heading">
            <div class="card-heading">
              <p class="card-kicker">Live preview</p>
              <h3 id="preview-heading">Bound state</h3>
            </div>

            <div role="tablist" aria-label="Profile preview">
              <button
                id="summary-tab"
                type="button"
                role="tab"
                data-tab="summary"
                :aria-selected="activeTab === 'summary'"
                aria-controls="summary-panel"
                @click="activeTab = 'summary'"
                @keydown="handleTabKeydown"
              >
                Summary
              </button>
              <button
                id="settings-tab"
                type="button"
                role="tab"
                data-tab="settings"
                :aria-selected="activeTab === 'settings'"
                aria-controls="settings-panel"
                @click="activeTab = 'settings'"
                @keydown="handleTabKeydown"
              >
                Settings
              </button>
            </div>

            <dl
              v-if="activeTab === 'summary'"
              id="summary-panel"
              role="tabpanel"
              aria-labelledby="summary-tab"
            >
              <div><dt>Name</dt><dd>{{ name || '—' }}</dd></div>
              <div><dt>Email</dt><dd>{{ email || '—' }}</dd></div>
              <div><dt>Seats</dt><dd>{{ seats }}</dd></div>
              <div><dt>Start</dt><dd>{{ startDate }}</dd></div>
              <div><dt>Role</dt><dd>{{ role }}</dd></div>
            </dl>
            <dl
              v-else
              id="settings-panel"
              role="tabpanel"
              aria-labelledby="settings-tab"
            >
              <div><dt>Interests</dt><dd>{{ interests.join(', ') || 'None' }}</dd></div>
              <div><dt>Contact</dt><dd>{{ contact }}</dd></div>
              <div><dt>Notifications</dt><dd>{{ notifications ? 'On' : 'Off' }}</dd></div>
              <div><dt>Confidence</dt><dd>{{ confidence }}%</dd></div>
            </dl>

            <details>
              <summary>Implementation note</summary>
              <p>Every value above is derived directly from Vue reactive state.</p>
            </details>
          </article>
        </div>
      </div>
    </section>

    <section id="northwind" aria-labelledby="northwind-heading">
      <p class="section-number">02 · API state</p>
      <h2 id="northwind-heading">Northwind Data Binding</h2>
      <p>Customer, order, and sandbox binding will follow as atomic features.</p>
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
}

@media (max-width: 1100px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .field-pair {
    grid-template-columns: 1fr;
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
</style>
