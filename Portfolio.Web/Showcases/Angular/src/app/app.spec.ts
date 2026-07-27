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
    expect(shadowRoot?.querySelector('h2')?.textContent).toContain(
      'Angular is connected to the portfolio host.',
    );
  });
});
