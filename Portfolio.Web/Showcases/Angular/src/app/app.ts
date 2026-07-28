import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type SortColumn = 'companyName' | 'contactName' | 'city' | 'country' | 'customerId';

interface CustomerSummary {
  customerId: string;
  companyName: string;
  contactName: string | null;
  city: string | null;
  country: string | null;
}

interface CustomerDetail extends CustomerSummary {
  contactTitle: string | null;
  address: string | null;
  region: string | null;
  postalCode: string | null;
  phone: string | null;
  fax: string | null;
  orderCount: number;
  totalSales: number;
  lastOrderDate: string | null;
}

interface CustomerPage {
  items: CustomerSummary[];
  totalCount: number;
  totalPages: number;
}

interface CustomerOrder {
  orderId: number;
  orderDate: string | null;
  status: string;
  total: number;
}
interface OrderDetail {
  orderId: number;
  orderDate: string | null;
  employeeName: string | null;
  shipperName: string | null;
  status: string;
  freight: number;
  subtotal: number;
  total: number;
  shippingAddress: { city: string | null; country: string | null };
  items: {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    extendedPrice: number;
  }[];
}

const customerColumns: readonly (readonly [SortColumn, string])[] = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['city', 'City'],
  ['country', 'Country'],
  ['customerId', 'ID'],
];
const editableFields: readonly (readonly [keyof CustomerDetail, string])[] = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['contactTitle', 'Title'],
  ['address', 'Address'],
  ['city', 'City'],
  ['region', 'Region'],
  ['postalCode', 'Postal code'],
  ['country', 'Country'],
  ['phone', 'Phone'],
  ['fax', 'Fax'],
];

@Component({
  selector: 'app-angular-showcase',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['../../../shared/showcase-contract.css'],
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
  protected readonly columns = customerColumns;
  protected readonly countries = signal<string[]>([]);
  protected readonly customers = signal<CustomerSummary[]>([]);
  protected readonly search = signal('');
  protected readonly country = signal('');
  protected readonly sort = signal<SortColumn>('companyName');
  protected readonly direction = signal<'asc' | 'desc'>('asc');
  protected readonly page = signal(1);
  protected readonly totalCount = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly customerError = signal('');
  protected readonly customerDetail = signal<CustomerDetail | null>(null);
  protected readonly detailLoading = signal(false);
  protected readonly detailError = signal('');
  protected readonly orders = signal<CustomerOrder[]>([]);
  protected readonly selectedOrderId = signal<number | null>(null);
  protected readonly orderDetail = signal<OrderDetail | null>(null);
  protected readonly ordersLoading = signal(false);
  protected readonly orderLoading = signal(false);
  protected readonly orderError = signal('');
  protected readonly sandboxEnabled = signal(false);
  protected readonly sandboxHasChanges = signal(false);
  protected readonly sandboxExpiresAt = signal<string | null>(null);
  protected readonly sandboxNotice = signal('');
  protected readonly customerDraft = signal<CustomerDetail | null>(null);
  protected readonly revision = signal(0);
  protected readonly editableFields = editableFields;
  protected readonly draftIsDirty = computed(() => {
    const detail = this.customerDetail();
    const draft = this.customerDraft();
    return Boolean(
      detail &&
      draft &&
      editableFields.some(([field]) => (detail[field] ?? '') !== (draft[field] ?? '')),
    );
  });
  protected readonly pageLabel = computed(
    () => `Page ${this.page()} of ${Math.max(this.totalPages(), 1)}`,
  );

  private readonly customerQueryEffect = effect((onCleanup) => {
    const search = this.search().trim();
    const country = this.country();
    const sort = this.sort();
    const direction = this.direction();
    const page = this.page();
    const sandboxEnabled = this.sandboxEnabled();
    this.revision();
    const controller = new AbortController();
    const delay = window.setTimeout(async () => {
      this.loading.set(true);
      this.customerError.set('');
      const parameters = new URLSearchParams({
        sort,
        direction,
        page: String(page),
        pageSize: '10',
      });

      if (search) parameters.set('search', search);
      if (country) parameters.set('country', country);

      try {
        const path = sandboxEnabled
          ? '/api/northwind/sandbox/customers'
          : '/api/northwind/customers';
        const response = await fetch(`${path}?${parameters}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Customers could not be loaded.');

        const result = (await response.json()) as CustomerPage;
        this.customers.set(result.items);
        this.totalCount.set(result.totalCount);
        this.totalPages.set(result.totalPages);
        this.selectedId.update((current) =>
          result.items.some((customer) => customer.customerId === current) ? current : null,
        );
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          this.customers.set([]);
          this.customerError.set((error as Error).message);
        }
      } finally {
        if (!controller.signal.aborted) this.loading.set(false);
      }
    }, 250);

    onCleanup(() => {
      window.clearTimeout(delay);
      controller.abort();
    });
  });

  private readonly customerDetailEffect = effect((onCleanup) => {
    const selectedId = this.selectedId();
    const sandboxEnabled = this.sandboxEnabled();
    this.revision();
    const controller = new AbortController();

    if (!selectedId) {
      this.customerDetail.set(null);
      this.detailError.set('');
      return;
    }

    this.detailLoading.set(true);
    this.detailError.set('');
    const path = sandboxEnabled
      ? `/api/northwind/sandbox/customers/${selectedId}`
      : `/api/northwind/customers/${selectedId}`;
    fetch(path, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Customer details could not be loaded.');
        return response.json() as Promise<CustomerDetail>;
      })
      .then((detail) => {
        this.customerDetail.set(detail);
        this.customerDraft.set({ ...detail });
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          this.customerDetail.set(null);
          this.detailError.set(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) this.detailLoading.set(false);
      });

    onCleanup(() => controller.abort());
  });

  private readonly ordersEffect = effect((onCleanup) => {
    const selectedId = this.selectedId();
    const controller = new AbortController();
    if (!selectedId) {
      this.orders.set([]);
      this.selectedOrderId.set(null);
      return;
    }
    this.ordersLoading.set(true);
    this.orderError.set('');
    fetch(`/api/northwind/customers/${selectedId}/orders`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Customer orders could not be loaded.');
        return response.json() as Promise<CustomerOrder[]>;
      })
      .then((orders) => {
        this.orders.set(orders);
        this.selectedOrderId.update((current) =>
          orders.some((order) => order.orderId === current)
            ? current
            : (orders[0]?.orderId ?? null),
        );
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') this.orderError.set(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) this.ordersLoading.set(false);
      });
    onCleanup(() => controller.abort());
  });

  private readonly orderDetailEffect = effect((onCleanup) => {
    const orderId = this.selectedOrderId();
    const controller = new AbortController();
    if (!orderId) {
      this.orderDetail.set(null);
      return;
    }
    this.orderLoading.set(true);
    this.orderError.set('');
    fetch(`/api/northwind/orders/${orderId}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Order details could not be loaded.');
        return response.json() as Promise<OrderDetail>;
      })
      .then((detail) => this.orderDetail.set(detail))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') this.orderError.set(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) this.orderLoading.set(false);
      });
    onCleanup(() => controller.abort());
  });

  private readonly sandboxStatusEffect = effect((onCleanup) => {
    if (!this.sandboxEnabled()) return;
    this.revision();
    const controller = new AbortController();
    fetch('/api/northwind/sandbox/status', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Sandbox status could not be loaded.');
        return response.json() as Promise<{ hasChanges: boolean; expiresAt: string }>;
      })
      .then((status) => {
        this.sandboxHasChanges.set(status.hasChanges);
        this.sandboxExpiresAt.set(status.expiresAt);
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') this.sandboxNotice.set(error.message);
      });
    onCleanup(() => controller.abort());
  });

  constructor() {
    void this.loadCountries();
  }

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

  protected updateSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  protected updateCountry(value: string): void {
    this.country.set(value);
    this.page.set(1);
  }

  protected changeSort(nextSort: SortColumn): void {
    if (this.sort() === nextSort) {
      this.direction.update((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sort.set(nextSort);
      this.direction.set('asc');
    }
    this.page.set(1);
  }

  protected sortLabel(column: SortColumn): string {
    if (this.sort() !== column) return 'Not sorted';
    return this.direction() === 'asc' ? 'Sorted ascending' : 'Sorted descending';
  }

  protected customerLocation(detail: CustomerDetail): string {
    return [detail.city, detail.region, detail.postalCode, detail.country]
      .filter(Boolean)
      .join(', ');
  }

  protected formatSales(value: number): string {
    return `$${Number(value).toLocaleString()}`;
  }

  protected formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleDateString() : 'No order date';
  }

  protected destination(detail: OrderDetail): string {
    return (
      [detail.shippingAddress.city, detail.shippingAddress.country].filter(Boolean).join(', ') ||
      '—'
    );
  }

  protected toggleSandbox(enabled: boolean): void {
    if (!enabled && this.draftIsDirty()) {
      this.sandboxNotice.set(
        'Save or discard the unsaved customer fields before leaving sandbox mode.',
      );
      return;
    }
    this.sandboxEnabled.set(enabled);
    this.selectedId.set(null);
    this.page.set(1);
    this.sandboxNotice.set('');
  }

  protected updateCustomerDraft(field: keyof CustomerDetail, value: string): void {
    this.customerDraft.update((current) => (current ? { ...current, [field]: value } : current));
  }

  protected discardCustomerDraft(): void {
    const detail = this.customerDetail();
    if (detail) this.customerDraft.set({ ...detail });
    this.sandboxNotice.set('Unsaved field changes discarded.');
  }

  protected async saveSandboxCustomer(): Promise<void> {
    const selectedId = this.selectedId();
    const draft = this.customerDraft();
    if (!selectedId || !draft || !draft.companyName.trim() || !this.draftIsDirty()) return;
    const response = await fetch(`/api/northwind/sandbox/customers/${selectedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (!response.ok) {
      this.sandboxNotice.set('The sandbox customer could not be saved.');
      return;
    }
    this.sandboxNotice.set("Saved to this session's temporary database.");
    this.sandboxHasChanges.set(true);
    this.revision.update((value) => value + 1);
  }

  protected async resetSandbox(): Promise<void> {
    const response = await fetch('/api/northwind/sandbox/reset', { method: 'POST' });
    if (!response.ok) {
      this.sandboxNotice.set('The sandbox could not be reset.');
      return;
    }
    this.selectedId.set(null);
    this.sandboxHasChanges.set(false);
    this.sandboxExpiresAt.set(null);
    this.sandboxNotice.set('Sandbox reset to vanilla Northwind data.');
    this.revision.update((value) => value + 1);
  }

  @HostListener('window:beforeunload', ['$event'])
  protected warnBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.draftIsDirty()) return;
    event.preventDefault();
    event.returnValue = '';
  }

  private async loadCountries(): Promise<void> {
    try {
      const response = await fetch('/api/northwind/countries');
      if (!response.ok) throw new Error('Countries could not be loaded.');
      this.countries.set((await response.json()) as string[]);
    } catch (error) {
      this.customerError.set((error as Error).message);
    }
  }
}
