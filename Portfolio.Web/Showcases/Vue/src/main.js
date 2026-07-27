import { defineCustomElement } from 'vue'
import VueShowcase from './App.ce.vue'

if (!customElements.get('vue-showcase')) {
  customElements.define('vue-showcase', defineCustomElement(VueShowcase))
}

