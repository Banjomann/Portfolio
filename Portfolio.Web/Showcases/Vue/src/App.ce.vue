<script setup>
import { ref } from 'vue'

const activeSection = ref('controls')
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
      <p>The interactive control gallery will be added in the next checkpoint.</p>
    </section>

    <section id="northwind" aria-labelledby="northwind-heading">
      <p class="section-number">02 · API state</p>
      <h2 id="northwind-heading">Northwind Data Binding</h2>
      <p>Customer, order, and sandbox binding will follow as atomic features.</p>
    </section>
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
  .section-number {
    color: #75d5aa;
  }
}
</style>

