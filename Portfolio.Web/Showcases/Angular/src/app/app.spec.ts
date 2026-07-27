import { TestBed } from '@angular/core/testing';
import { beforeEach, vi } from 'vitest';
import { App } from './app';

const customer = {
  customerId: 'ALFKI',
  companyName: 'Alfreds Futterkiste',
  contactName: 'Maria Anders',
  city: 'Berlin',
  country: 'Germany',
};

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL | Request) => {
        const url = String(input);
        const value = url.endsWith('/countries')
          ? ['Germany']
          : {
              items: [customer],
              page: 1,
              pageSize: 10,
              totalCount: 1,
              totalPages: 1,
            };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(value),
        });
      }),
    );

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the showcase foundation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const shadowRoot = compiled.shadowRoot;
    expect(shadowRoot?.querySelector('h1')?.textContent).toContain('Angular showcase');
    expect(shadowRoot?.querySelector('h2')?.textContent).toContain('Control gallery');
  });

  it('should bind profile inputs into the live summary', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const nameInput = shadowRoot.querySelector('input[formcontrolname="name"]') as HTMLInputElement;

    nameInput.value = 'Grace Hopper';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(shadowRoot.querySelector('.tab-panel h3')?.textContent).toContain('Grace Hopper');
  });

  it('should validate the profile and dismiss its success notification', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const emailInput = shadowRoot.querySelector(
      'input[formcontrolname="email"]',
    ) as HTMLInputElement;
    const submitButton = shadowRoot.querySelector('button[type="submit"]') as HTMLButtonElement;

    emailInput.value = 'invalid';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submitButton.disabled).toBe(true);
    expect(emailInput.getAttribute('aria-invalid')).toBe('true');

    emailInput.value = 'grace@example.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submitButton.disabled).toBe(false);

    submitButton.click();
    fixture.detectChanges();
    expect(shadowRoot.querySelector('.notification[role="status"]')?.textContent).toContain(
      'validated successfully',
    );

    (shadowRoot.querySelector('[aria-label="Dismiss notification"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(shadowRoot.querySelector('.notification[role="status"]')).toBeNull();
  });

  it('should switch tabs with arrow keys', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const summaryTab = shadowRoot.querySelector('#profile-summary-tab') as HTMLButtonElement;

    summaryTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    const settingsTab = shadowRoot.querySelector('#profile-settings-tab') as HTMLButtonElement;
    expect(settingsTab.getAttribute('aria-selected')).toBe('true');
    expect(shadowRoot.querySelector('#profile-settings-panel')).not.toBeNull();
  });

  it('should send debounced customer filters to the API', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const searchInput = shadowRoot.querySelector('input[type="search"]') as HTMLInputElement;

    searchInput.value = 'alfreds';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=alfreds'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('should bind and retain a customer selection on the current page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 300));
    fixture.detectChanges();
    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;
    const customerButton = shadowRoot.querySelector('.row-select') as HTMLButtonElement;

    customerButton.click();
    fixture.detectChanges();

    expect(customerButton.getAttribute('aria-pressed')).toBe('true');
    expect(shadowRoot.querySelector('.grid-footer')?.textContent).toContain('Selected: ALFKI');
  });
});
