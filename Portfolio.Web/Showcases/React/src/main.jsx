import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import contractStyles from '../../shared/showcase-contract.css?inline'

class ReactShowcaseElement extends HTMLElement {
  connectedCallback() {
    if (this.reactRoot) {
      return
    }

    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    let mountPoint = shadowRoot.querySelector('#root')

    if (!mountPoint) {
      const styleElement = document.createElement('style')
      styleElement.textContent = contractStyles

      mountPoint = document.createElement('div')
      mountPoint.id = 'root'

      shadowRoot.append(styleElement, mountPoint)
    }

    this.reactRoot = createRoot(mountPoint)
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
