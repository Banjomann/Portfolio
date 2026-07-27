import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'portfolio-angular-showcase',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('profileDialog');

  protected readonly profile = this.formBuilder.nonNullable.group({
    name: ['Ada Lovelace', Validators.required],
    email: ['ada@example.com', [Validators.required, Validators.email]],
    seats: [3, [Validators.required, Validators.min(1), Validators.max(20)]],
    startDate: ['2026-08-01', Validators.required],
    role: ['Developer', Validators.required],
  });
  protected readonly interests = signal(['Data']);
  protected readonly contactMethod = signal('Email');
  protected readonly notificationsEnabled = signal(true);
  protected readonly confidence = signal(72);
  protected readonly activeTab = signal<'summary' | 'settings'>('summary');
  protected readonly notice = signal('');
  protected readonly interestsSummary = computed(() => this.interests().join(', ') || 'None');

  protected toggleInterest(interest: string): void {
    this.interests.update((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  protected validateProfile(): void {
    if (this.profile.invalid) {
      return;
    }

    this.notice.set('Example profile validated successfully.');
  }

  protected openDialog(): void {
    this.dialog().nativeElement.showModal();
  }

  protected selectTab(tab: 'summary' | 'settings'): void {
    this.activeTab.set(tab);
  }

  protected handleTabKey(event: KeyboardEvent, tab: 'summary' | 'settings'): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const nextTab = tab === 'summary' ? 'settings' : 'summary';
    this.activeTab.set(nextTab);
    const tabList = (event.currentTarget as HTMLElement).parentElement;
    tabList?.querySelector<HTMLButtonElement>(`#profile-${nextTab}-tab`)?.focus();
  }
}
