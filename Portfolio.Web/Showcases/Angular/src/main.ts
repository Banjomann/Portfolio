import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

createApplication(appConfig)
  .then((application) => {
    if (!customElements.get('angular-showcase')) {
      const showcaseElement = createCustomElement(App, {
        injector: application.injector,
      });

      customElements.define('angular-showcase', showcaseElement);
    }
  })
  .catch((error: unknown) => console.error(error));
