# GST Billing System — Frontend Implementation Walkthrough

## Overview
A commercial-grade **GST Billing SaaS Frontend** built with **React, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod, and Lucide React** using a **Dark / Black Premium Design System** (`#050505`, `#090909`, `#101010`, `#151515`, `#252525`, `#6366F1`).

The frontend is strictly decoupled from the backend and structured to consume standard REST endpoints with credentials and automated query cache invalidation.

---

## Complete Frontend Architecture

```
Frontend/src/
├── api/
│   └── client.js                     # Axios instance (baseURL: VITE_API_URL, withCredentials: true)
├── components/
│   ├── common/
│   │   └── PageHeader.jsx            # Reusable page header with title, desc, breadcrumbs & actions
│   ├── shared/
│   │   ├── Logo.jsx                  # Brand SVG identity
│   │   └── RoleBadge.jsx             # Role indicator badge (OWNER, ADMIN, STAFF)
│   └── ui/
│       ├── Button.jsx                # Variants: primary, secondary, ghost, danger, success
│       ├── ConfirmDialog.jsx         # Accessible confirmation modal for destructive operations
│       ├── CurrencyDisplay.jsx       # Indian currency formatter (₹ 1,25,000.00)
│       ├── DateDisplay.jsx           # Unified date formatter (e.g. 19 Sep 2026)
│       ├── EmptyState.jsx            # Contextual empty state with action trigger
│       ├── ErrorState.jsx            # Contextual error display with retry
│       ├── Input.jsx                 # Dark themed form input with inline error & helper
│       ├── LoadingSpinner.jsx        # Subtle SVG loader
│       ├── Modal.jsx                 # Backdrop-blurred elevated surface dialog
│       ├── OTPInput.jsx              # 6-digit auto-advancing, paste-handling input
│       ├── Pagination.jsx            # Server-side pagination controls (1–10 of 150)
│       ├── PasswordInput.jsx         # Eye toggle visibility password input
│       ├── SearchInput.jsx           # Debounced search bar with clear button
│       ├── Select.jsx                # Dark select dropdown
│       ├── Skeleton.jsx              # Subtle pulse placeholder
│       └── StatCard.jsx              # Metric KPI card
├── constants/
│   ├── designTokens.js               # Hex palette, radiuses, shadows
│   ├── gstRates.js                   # GST slabs [0, 5, 12, 18, 28]
│   ├── roles.js                      # OWNER, ADMIN, STAFF
│   ├── routes.js                     # Single source of truth for paths
│   └── states.js                     # Indian states & UTs list
├── context/
│   └── AuthContext.jsx               # Auth state (user, shop, isAuthenticated, isLoading)
├── features/
│   ├── auth/components/             # LoginForm, SignupForm, ForgotPasswordForm, OTPForm, ResetForm
│   ├── bills/components/            # CustomerSelector, ItemSelector, BillItemsTable, BillSummary, EmailInvoiceModal
│   ├── dashboard/components/        # SummaryCards, SalesChart (Recharts dual area), RecentBills
│   ├── items/components/            # ItemTable, ItemForm (reusable for create and edit)
│   ├── parties/components/          # PartyTable, PartyForm, QuickAddPartyModal
│   ├── shop/components/             # ShopSettingsForm
│   └── users/components/            # UserTable, UserForm
├── hooks/
│   ├── useAuth.js                   # Consume AuthContext
│   ├── useDebounce.js               # Debounce input utility
│   └── usePermission.js             # Granular role capability flags
├── layouts/
│   ├── AppShell.jsx                 # Persistent desktop sidebar, topbar, and mobile drawer
│   ├── AuthLayout.jsx               # Split screen auth container
│   ├── MobileSidebar.jsx            # Touch drawer with backdrop
│   ├── Sidebar.jsx                  # Navigation hierarchy with role filters
│   └── Topbar.jsx                   # User avatar, shop indicator, breadcrumbs
├── pages/
│   ├── auth/                        # LoginPage, SignupPage, ForgotPasswordPage, VerifyOtpPage, ResetPasswordPage
│   ├── bills/                       # BillsPage, CreateBillPage, BillDetailsPage
│   ├── dashboard/                   # DashboardPage
│   ├── items/                       # ItemsPage, AddItemPage, EditItemPage
│   ├── parties/                     # PartiesPage, AddPartyPage, EditPartyPage, PartyDetailsPage
│   ├── shop/                        # ShopSettingsPage
│   ├── users/                       # UsersPage, AddUserPage, EditUserPage
│   ├── ForbiddenPage.jsx            # 403 Access Restricted view
│   └── NotFoundPage.jsx             # 404 Page Not Found view
├── routes/
│   ├── AppRouter.jsx                # Full declarative routing tree
│   ├── ProtectedRoute.jsx           # Resolves /api/auth/me before rendering
│   ├── PublicRoute.jsx              # Redirects authenticated users to dashboard
│   └── RoleRoute.jsx                # Role-based route guard
├── services/
│   ├── auth.service.js              # Auth endpoints
│   ├── bill.service.js              # Invoices, PDF download, Email dispatch
│   ├── dashboard.service.js         # Summary, sales trends, tax stats
│   ├── item.service.js              # Catalog CRUD
│   ├── party.service.js             # Customer CRUD & ledger
│   ├── shop.service.js              # Shop profile & settings
│   └── user.service.js              # Team user management
├── utils/
│   ├── formatCurrency.js            # ₹ INR formatter
│   ├── formatDate.js                # Date formatter
│   └── gstCalculator.js             # Pure GST intra/inter-state computation engine
└── validations/
    ├── auth.schema.js               # Zod auth schemas
    ├── bill.schema.js               # Zod bill & line item schema
    ├── item.schema.js               # Zod item schema
    ├── party.schema.js              # Zod customer schema
    ├── shop.schema.js               # Zod shop settings schema
    └── user.schema.js               # Zod user creation/update schema
```

---

## Route & Capability Matrix

| Route | Page / Module | Allowed Roles | Description |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Email & password login with session cookie |
| `/signup` | `SignupPage` | Public | Enterprise registration with password strength meter |
| `/forgot-password` | `ForgotPasswordPage` | Public | Request OTP email dispatch |
| `/verify-otp` | `VerifyOtpPage` | Public | 6-digit OTP verification with timer |
| `/reset-password` | `ResetPasswordPage` | Public | New password setup |
| `/dashboard` | `DashboardPage` | OWNER, ADMIN | KPI summary cards, Recharts sales curve, recent invoices |
| `/parties` | `PartiesPage` | All Authenticated | Customer registry with search & pagination |
| `/parties/new` | `AddPartyPage` | All Authenticated | Register new party with state & GSTIN |
| `/parties/:id` | `PartyDetailsPage` | All Authenticated | Profile & historical billing ledger |
| `/parties/:id/edit` | `EditPartyPage` | OWNER, ADMIN | Update customer profile |
| `/items` | `ItemsPage` | All Authenticated | Product & service catalog with GST slab filters |
| `/items/new` | `AddItemPage` | OWNER, ADMIN | Add catalog item with HSN code & GST % |
| `/items/:id/edit` | `EditItemPage` | OWNER, ADMIN | Edit catalog item pricing and slabs |
| `/bills` | `BillsPage` | All Authenticated | Historical invoices with PDF download & email triggers |
| `/bills/new` | `CreateBillPage` | All Authenticated | 2-column live GST bill builder |
| `/bills/:id` | `BillDetailsPage` | All Authenticated | Formal paper invoice layout, print styles & actions |
| `/users` | `UsersPage` | OWNER | Team member management & active status toggle |
| `/users/new` | `AddUserPage` | OWNER | Invite Admin or Staff member |
| `/users/:id/edit` | `EditUserPage` | OWNER | Modify team member credentials & roles |
| `/shop-settings` | `ShopSettingsPage` | OWNER | Enterprise name, GSTIN, state jurisdiction & invoice prefix |
| `/403` | `ForbiddenPage` | All | Access restricted screen |
| `*` | `NotFoundPage` | Public | 404 Page Not Found |

---

## GST Tax Calculation Engine (`src/utils/gstCalculator.js`)
- **Intra-State Rule**: When Buyer State equals Seller State:
  - $\text{CGST Rate} = \frac{\text{GST Rate}}{2}$
  - $\text{SGST Rate} = \frac{\text{GST Rate}}{2}$
  - $\text{IGST} = ₹ 0.00$
- **Inter-State Rule**: When Buyer State differs from Seller State:
  - $\text{IGST Rate} = \text{GST Rate}$
  - $\text{CGST} = ₹ 0.00$
  - $\text{SGST} = ₹ 0.00$
- **Live Updating**: Real-time feedback without page reloading; dynamic comparison with `shop.state`.

---

## Verification & Build Results
- **Production Build**: Executed `npm run build` with Vite 8.3:
  - Modules transformed: 2,669
  - Build time: 552ms
  - Output: `dist/index.html`, `dist/assets/index.css` (40.43 kB), `dist/assets/index.js` (991.99 kB)
  - Result: **0 errors, 0 failed imports**
- **Dev Server**: Active on `http://localhost:5173` returning HTTP 200 OK.
