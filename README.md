
# Banking Sector Banking Portal

A production-grade Angular banking dashboard

## Tech Stack

| Technology      | Version  | Purpose                           |
|-----------------|----------|-----------------------------------|
| Angular         | 21.x     | Framework (standalone + signals)  |
| TailwindCSS     | 4.x      | Utility-first CSS                 |
| TypeScript      | 5.9.x    | Strict typed language             |
| RxJS            | 7.8.x    | Reactive async flows              |
| primeIcons      | 7.x      | Reactive async flows              |
| PrimeNG         | 17.x     | UI Component Library              |

## Features

- **Auth Module** — Login with Reactive Forms, validation, fake session via localStorage
- **Dashboard** — customers Analysis cards,  customer table + pagination
- **Customer Detail** — Profile, accounts list, mini statement, monthly insights, spending bars
- **Transactions** — Full table with filtering (type, category, date range, search), CSV export, sortable columns
- **Create Transaction** — Reactive form with full validation: amount limits, future date block, insufficient balance check
- **State Management** — Angular Signals +  service for selected customer/account
- **Caching** — HTTP results cached in-memory (signals) + persisted to localStorage
- **Loading UX** — Skeleton loaders everywhere, empty states, animated transitions
- **Routing** — Auth guards, lazy-loaded routes, redirect logic

## Project Structure

```
src/app/
├── core/
│   ├── auth/guards/       # authGuard, loginGuard
│   └── services/         # AuthService, CustomerService,TransactionService
│   ├── models/           #  Customer, Account, Transaction, Auth interfaces
├── features/
│   ├── auth/login/       # LoginComponent 
│   ├── dashboard/        # DashboardComponent
│   ├── customers/        # CustomerDetailComponent
│   └── transactions/     # TransactionsComponent + CreateTransactionComponent
├── layouts/
│   ├── mainLayout/       # MainLayoutComponent (main layout wrapper)
│   ├── authLayout/       # AuthLayoutComponent 
├── shared/
│   ├── components/       # skeletonCard, skeletonTable
│   └── helpers/          # paginationHelper
└── validators/           # Custom reactive form validators
public/assets/mock/          # Static JSON data files
```

## Routes

| Path                                | Component               | Guard      |
|-------------------------------------|-------------------------|------------|
| `/login`                            | LoginComponent          | loginGuard |
| `/dashboard`                        | DashboardComponent      | authGuard  |
| `/customers/:cif`                    | CustomerDetailComponent | authGuard  |
| `/transactions`                     | TransactionsComponent   | authGuard  |
| `/transactions/:accountId`          | TransactionsComponent   | authGuard  |

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
cd banking-portal
npm install
npm start
# → http://localhost:4200
```

### Login

Enter **any valid email** and **any password starts with capital and 6+ characters**.

```
Email:    admin@email.com
Password: Admin123
```

### Build

```bash
npm run build          # Production
npm start              # Dev server (localhost:4200)
```

## Validation Rules (Create Transaction)

| Field    | Rules                                                                 |
|----------|-----------------------------------------------------------------------|
| Type     | Required                                                              |
| Amount   | Required · > 0 · ≤ 100,000 · max 2 decimals · Debit ≤ account balance|
| Date     | Required · cannot be a future date                                    |
| Merchant | Required · 3–50 characters                                            |
| Category | Required                                                              |

## Architecture Notes

- **OnPush** change detection on every component for optimal performance
- **Standalone components** — zero NgModules
- **Signal-based state** — AppState manages selected customer/account across routes
- **localStorage caching** — accounts and transactions persist across page refreshes
- **Lazy loading** — every route loads its bundle on demand
- **Responsive** — navbar collapses on mobile, layouts switch to single-column

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

بناءً على ملف التاسك وعلى الكود اللي نفذناه سوا، ده الجزء الخاص بـ **Feature List & Assumptions** اللي المفروض تحطيه في الـ README أو تقدميه مع التاسك. الجزء ده مهم جداً لأنه بيعرف المصحح إنك مش بس بتكتبي كود، لا أنتِ فاهمة الـ **Business Logic** والـ **Edge Cases**.

---

## 🚀 Detailed Feature List

### 1. Authentication & Security

* **Reactive Login System:** Implemented a secure login flow using Angular Reactive Forms.
* **Smart Pattern Validation:** Password field requires a specific pattern (Starts with a Capital letter, followed by exactly 5 characters) to demonstrate custom Regex handling.
* **State-Persistent Navbar:** The user's initial (from email) is reactively displayed in the navigation bar immediately upon login using **Angular Signals**.

### 2. Customer & Account Management

* **Hierarchical Navigation (Drill-down):**
* **Dashboard:** High-level view of all customers from `customers.json`.
* **Customer Details:** Deep dive into specific customer metadata and their associated accounts.


* **Dynamic Account Cards:** Real-time display of account status (Active/Inactive), IBAN, and current balance.

### 3. Transaction Ledger (Per Account)

* **Isolated Transaction View:** Specifically built to display transactions filtered by the selected `accountId` (as per requirement 1.1).
* **Advanced Filtering Suite:**
* Date range filtering (From/To).
* Categorical filtering (Shopping, Bills, etc.) using dynamic chips.
* Type filtering (Debit/Credit) via a toggle system.


* **Multi-Sort Engine:** Users can sort the ledger by **Date** (Recency) or **Amount** (Value) in ascending or descending order.

### 4. Create Transaction & Business Logic

* **Balance-Aware Validation:** The form includes a custom validator that prevents **Debit** transactions if the amount exceeds the current account balance.
* **Real-time UI Updates:** New transactions appear instantly in the ledger and update the account balance immediately without page refresh.
* **Data Integrity:** Implemented strict validations for:
* No future dates allowed.
* Decimal precision (max 2 places).
* Amount caps (max 100,000).



### 5. Analytics & Export (Layer 3)

* **Monthly Insights:** Automated computation of total inflows (Credit), outflows (Debit), and identifying the "Highest Spending Category".
* **Financial Export:** Integrated CSV export functionality for account statements.

---

## 🧠 Assumptions & Technical Decisions

* **LocalStorage as a Mock DB:** Since the task uses static JSON, I assumed `localStorage` should act as the primary persistence layer for new transactions and balance updates. This ensures data persists across browser refreshes.
* **State Management:** I chose **Angular Signals** for state management (instead of traditional RxJS subjects where possible) to leverage fine-grained reactivity and better performance in Angular 18/19.
* **Default Currency:** Assumed **EGP** as the base currency for all calculations, although the system is architected to support dynamic currency symbols from the `accounts.json` file.
* **User CIF:** For the simulation, I assumed the logged-in user is an **Admin/Staff** who has access to view and manage different customers' accounts.
* **Pagination:** Assumed a default page size of **5-10 records** to demonstrate the `PaginationHelper` logic while keeping the UI clean for the assessment.

---


