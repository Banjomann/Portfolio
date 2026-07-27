import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
  employeeName: string | null;
  shipperName: string | null;
  status: string;
  freight: number;
  subtotal: number;
  total: number;
  shippingAddress: { city: string | null; country: string | null };
  items: Array<{
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    extendedPrice: number;
  }>;
}

const customerColumns: ReadonlyArray<readonly [SortColumn, string]> = [
  ['companyName', 'Company'],
  ['contactName', 'Contact'],
  ['city', 'City'],
  ['country', 'Country'],
  ['customerId', 'ID'],
];

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
  protected readonly pageLabel = computed(
    () => `Page ${this.page()} of ${Math.max(this.totalPages(), 1)}`,
  );

  private readonly customerQueryEffect = effect((onCleanup) => {
    const search = this.search().trim();
    const country = this.country();
    const sort = this.sort();
    const direction = this.direction();
    const page = this.page();
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
        const response = await fetch(`/api/northwind/customers?${parameters}`, {
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
    const controller = new AbortController();

    if (!selectedId) {
      this.customerDetail.set(null);
      this.detailError.set('');
      return;
    }

    this.detailLoading.set(true);
    this.detailError.set('');
    fetch(`/api/northwind/customers/${selectedId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Customer details could not be loaded.');
        return response.json() as Promise<CustomerDetail>;
      })
      .then((detail) => this.customerDetail.set(detail))
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
