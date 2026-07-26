import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ReactShowcaseElement extends HTMLElement {
  connectedCallback() {
    if (this.reactRoot) {
      return
    }

    this.reactRoot = createRoot(this)
    this.reactRoot.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }

  disconnectedCallback() {
    this.reactRoot?.unmount()
    this.reactRoot = undefined
  }
}

if (!customElements.get('react-showcase')) {
  customElements.define('react-showcase', ReactShowcaseElement)
}
