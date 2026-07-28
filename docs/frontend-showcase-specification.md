# Frontend Showcase Specification

This document is the framework-neutral contract for the React, Angular, and Vue
showcase pages. Each implementation must use its framework's native component,
state, binding, lifecycle, and testing patterns while producing the same visible
layout and behavior.

## Routes and hosting

The showcases are embedded in `Portfolio.Web`; they are not separately hosted
applications.

| Page | Route |
| --- | --- |
| Frontend Lab hub | `/frontend-lab` |
| React | `/frontend-lab/react` |
| Angular | `/frontend-lab/angular` |
| Vue | `/frontend-lab/vue` |

Authored source and generated framework bundles must remain readable. Production
bundles may tree-shake and select production runtimes, but must not be minified.
Each framework must be isolated from the portfolio's global styles.

## Page hierarchy

Every framework page uses this order:

1. Framework showcase header
2. Section navigation
3. Control Gallery
4. Northwind Data Binding
   1. Customer Explorer
   2. Customer Details
   3. Orders and Line Items

The page header identifies the active framework. The Control Gallery and
Northwind Data Binding are independent peer sections.

## Control Gallery

### Default state

| Field | Default |
| --- | --- |
| Name | `Ada Lovelace` |
| Email | `ada@example.com` |
| Seats | `3` |
| Start date | `2026-08-01` |
| Role | `Developer` |
| Interests | `Data` |
| Preferred contact | `Email` |
| Notifications | Enabled |
| Confidence | `72` |
| Active tab | `Summary` |

### Required behavior

- Bind text, email, number, date, and select controls to local framework state.
- Bind checkbox, radio, switch, and range controls to local framework state.
- Reflect changes immediately in the summary or settings panel.
- Validate email format and require a non-empty name.
- Disable profile validation while the form is invalid.
- Display a dismissible success notification after validation.
- Include working Summary and Settings tabs with keyboard arrow navigation.
- Include a native details/summary disclosure.
- Launch a modal dialog with correct focus trapping and keyboard dismissal.
- Include primary, secondary, and disabled button states.
- Display both a range value and a progress indicator.

No Control Gallery value is sent to the Northwind API.

## Northwind Customer Explorer

### Grid query state

| Setting | Default |
| --- | --- |
| Search | Empty |
| Country | All countries |
| Sort | Company name |
| Direction | Ascending |
| Page | `1` |
| Page size | `10` |
| Selection | None |

### Required behavior

- Load countries from the API.
- Debounce customer search by approximately 250 ms.
- Filter by exact country.
- Sort Customer ID, Company, Contact, City, and Country in both directions.
- Reset to page 1 after search, filter, or sort-column changes.
- Page entirely on the server.
- Expose loading, empty, validation, and request-error states.
- Selecting a customer binds Customer Details and Customer Orders.
- Keep a selection only while that customer remains on the current grid page.

## Customer and order binding

Customer Details are read-only unless Editing Sandbox is enabled.

Selecting a customer must:

1. Load the full customer record and aggregate metrics.
2. Load that customer's orders.
3. Select the newest order by default.

Selecting an order must bind:

- Order date and status
- Assigned employee
- Shipper
- Destination
- Product line items
- Quantity, price, and extended price
- Subtotal, freight, and total

Customer and order reads use canonical Northwind data even when customer fields
are being edited in a sandbox. Sandbox edits are limited to customer fields.

## Editing Sandbox

The canonical SQL Server Northwind database is always read-only from showcase
editing workflows.

### Session rules

- The web host issues an HTTP-only browser-session identifier.
- The API creates an in-memory SQLite customer database for that identifier.
- The session database is seeded from canonical Northwind on first use.
- Different session identifiers receive independent copies.
- Customer writes target only the session database.
- A save immediately rebinds the grid and customer controls.
- Reset destroys the session copy; the next request reseeds vanilla Northwind.
- Abandoned session databases expire after 30 minutes without sandbox activity.
- Closing the browser session and starting a new one produces vanilla data.
- API or application restart discards all sandbox databases.

### Editing behavior

- Editing Sandbox is off by default.
- Enabling it changes Customer Details into editable controls.
- Company name is required.
- Show `Unsaved fields` when a bound value differs from the loaded record.
- Disable Save and Discard when no field is dirty.
- Prevent leaving sandbox mode while fields are unsaved.
- Discard restores the last loaded sandbox record.
- Save displays a persistent success notification.
- Display `Vanilla copy` until the first successful write.
- Display `Changes made` after a successful write.
- Reset clears the selection and returns the status to `Vanilla copy`.

## API contract

All browser requests use same-origin `/api/northwind/...` URLs. `Portfolio.Web`
forwards them to `Portfolio.ApiService` through Aspire service discovery.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/northwind/countries` | Country filter values |
| GET | `/api/northwind/customers` | Canonical customer grid |
| GET | `/api/northwind/customers/{id}` | Canonical customer details |
| GET | `/api/northwind/customers/{id}/orders` | Customer orders |
| GET | `/api/northwind/orders/{id}` | Order and line items |
| GET | `/api/northwind/sandbox/customers` | Session customer grid |
| GET | `/api/northwind/sandbox/customers/{id}` | Session customer details |
| PUT | `/api/northwind/sandbox/customers/{id}` | Update session customer |
| GET | `/api/northwind/sandbox/status` | Changes and expiration status |
| POST | `/api/northwind/sandbox/reset` | Destroy the session copy |

Grid query parameters are `search`, `country`, `sort`, `direction`, `page`, and
`pageSize`. Page size must be between 1 and 50.

## Responsive layout

| Width | Required layout |
| --- | --- |
| Above 1100 px | Two-column Control Gallery and two-column order workspace |
| 761-1100 px | Stacked gallery cards and stacked order list/detail |
| 760 px and below | Single-column forms, details, and summaries |

Grid and line-item tables may scroll horizontally rather than truncate content.
Grid children must use `min-width: 0` so controls never force container overflow.
Section navigation may scroll horizontally on narrow screens.

## Accessibility

- Use one visible page-level `h1` and preserve heading order.
- Do not nest `main` landmarks inside the portfolio's main landmark.
- Label sections, navigation, forms, tables, dialogs, and loading states.
- Use native inputs, buttons, tables, details, dialog, and progress elements.
- Expose `aria-sort` on sortable table headers.
- Select customers through the full table row; company names are plain text.
- Keep selectable rows keyboard operable with Enter and Space.
- Support keyboard operation for all interactions.
- Connect tabs and tab panels with `aria-controls` and `aria-labelledby`.
- Announce loading, errors, save results, and reset results.
- Honor reduced-motion preferences and Windows forced-colors mode.
- Preserve visible focus indicators in light and dark themes.

## Verification contract

Each framework implementation must provide automated coverage for:

- Controlled inputs and derived state
- Debounced customer filtering
- Customer selection and detail binding
- Order selection and line-item binding
- Sandbox save and reset
- Canonical-data immutability
- Cross-session sandbox isolation

Before commit or pull request:

```text
Framework lint
Framework tests
Unminified production bundle
dotnet test Portfolio.slnx -c Release
NuGet vulnerability audit
JavaScript dependency vulnerability audit
Live Aspire browser smoke test
```

The React implementation is the reference implementation until all three
frameworks pass this contract.
