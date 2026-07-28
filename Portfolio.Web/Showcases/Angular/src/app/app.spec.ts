import { TestBed } from '@angular/core/testing';
import { beforeEach, vi } from 'vitest';
import { App } from './app';

const customer = {
  customerId: 'ALFKI',
  companyName: 'Alfreds Futterkiste',
  contactName: 'Maria Anders',
  city: 'Berlin',
  country: 'Germany',
  contactTitle: 'Sales Representative',
  address: 'Obere Str. 57',
  region: null,
  postalCode: '12209',
  phone: '030-0074321',
  fax: null,
  orderCount: 6,
  totalSales: 4273.5,
};
const order = { orderId: 10643, orderDate: '1997-08-25T00:00:00', status: 'Shipped', total: 814.5 };
const orderDetail = {
  ...order,
  employeeName: 'Nancy Davolio',
  shipperName: 'Speedy Express',
  freight: 29.46,
  subtotal: 785.04,
  shippingAddress: { city: 'Berlin', country: 'Germany' },
  items: [
    {
      productId: 28,
      productName: 'Rössle Sauerkraut',
      unitPrice: 45.6,
      quantity: 15,
      extendedPrice: 684,
    },
  ],
};

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL | Request, options: RequestInit = {}) => {
        const url = String(input);
        const value = url.endsWith('/sandbox/status')
          ? { hasChanges: false, expiresAt: '2026-08-01T12:00:00Z' }
          : options.method === 'PUT' || options.method === 'POST'
            ? null
            : url.endsWith('/countries')
              ? ['Germany']
              : url.endsWith('/customers/ALFKI/orders')
                ? [order]
                : url.endsWith('/orders/10643')
                  ? orderDetail
                  : url.endsWith('/customers/ALFKI')
                    ? customer
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
    const customerRow = shadowRoot.querySelector('tbody tr') as HTMLTableRowElement;

    customerRow.click();
    fixture.detectChanges();

    expect(customerRow.getAttribute('aria-selected')).toBe('true');
    expect(shadowRoot.querySelector('.selection-status')?.textContent).toContain('Selected: ALFKI');
  });

  it('should bind selected customer details and aggregate metrics', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 300));
    fixture.detectChanges();
    const shadowRoot = fixture.nativeElement.shadowRoot as ShadowRoot;

    (shadowRoot.querySelector('tbody tr') as HTMLTableRowElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    const details = shadowRoot.querySelector('.detail-card')?.textContent;
    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/customers/ALFKI',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(details).toContain('Sales Representative');
    expect(details).toContain('Berlin');
    expect(details).toContain('12209');
    expect(details).toContain('Germany');
    expect(details).toContain('6');
    expect(details).toContain('$4,273.5');
  });

  it('should select the newest order and bind line items and totals', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 300));
    fixture.detectChanges();
    const root = fixture.nativeElement.shadowRoot as ShadowRoot;
    (root.querySelector('tbody tr') as HTMLTableRowElement).click();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(root.querySelector('.orders-card')?.textContent).toContain('Order 10643');
    expect(root.querySelector('.orders-card')?.textContent).toContain('Rössle Sauerkraut');
    expect(root.querySelector('.order-totals')?.textContent).toContain('$814.5');
  });

  it('should save and reset only through sandbox endpoints', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 300));
    fixture.detectChanges();
    const root = fixture.nativeElement.shadowRoot as ShadowRoot;
    (root.querySelector('.sandbox-panel input[role="switch"]') as HTMLInputElement).click();
    await new Promise((resolve) => setTimeout(resolve, 300));
    fixture.detectChanges();
    (root.querySelector('tbody tr') as HTMLTableRowElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    const company = root.querySelector('.detail-form input') as HTMLInputElement;
    company.value = 'Session Company';
    company.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (root.querySelector('.detail-form button[type="submit"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/sandbox/customers/ALFKI',
      expect.objectContaining({ method: 'PUT' }),
    );
    (root.querySelector('.sandbox-panel .secondary-button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(fetch).toHaveBeenCalledWith(
      '/api/northwind/sandbox/reset',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetch).not.toHaveBeenCalledWith(
      '/api/northwind/customers/ALFKI',
      expect.objectContaining({ method: 'PUT' }),
    );
  });
});
