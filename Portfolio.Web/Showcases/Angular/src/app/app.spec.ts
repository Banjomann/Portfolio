import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
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
    expect(shadowRoot.querySelector('[role="status"]')?.textContent).toContain(
      'validated successfully',
    );

    (shadowRoot.querySelector('[aria-label="Dismiss notification"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(shadowRoot.querySelector('[role="status"]')).toBeNull();
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
});
