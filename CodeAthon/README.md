# GSTBilling PRO — Professional GST Invoicing & Business SaaS

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4.1-38BDF8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-HTTP--Only_JWT-FF6C37?logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**GSTBilling PRO** is a production-grade, enterprise-ready SaaS application designed for Indian small and medium businesses (SMBs), traders, and enterprises. Built with a modular React/Vite frontend and a high-performance Express/MongoDB backend, it streamlines GST invoicing, inventory cataloging, customer ledgers, tax compliance (CGST/SGST/IGST), and role-based team management.

---

## ✨ Key Features

### 🔐 1. Multi-Tenant Architecture & Role-Based Access Control (RBAC)
- **Role Hierarchy**: Strict permission enforcement across `OWNER`, `ADMIN`, and `STAFF` roles.
  - **OWNER**: Complete business control, shop configuration, tax defaults, and user/team lifecycle management.
  - **ADMIN**: Catalog management, customer ledgers, inventory creation, invoice generation, and tax report views.
  - **STAFF**: Fast billing desk interface, customer lookups, and invoice creation with safety guards against price/catalog tampering.
- **Secure Authentication**: HTTP-only JWT cookies combined with Bearer token header fallbacks, anti-enumeration security, and password reset OTP verification.

### 🧾 2. Intelligent GST Invoicing Engine
- **State-Wise Tax Auto-Calculation**:
  - **Intra-State Transactions** (Same state as shop): Automatically splits tax evenly into **CGST** and **SGST**.
  - **Inter-State Transactions** (Different state): Automatically applies **IGST**.
- **Dynamic Multi-Item Billing**: Real-time line item math, quantity controls, unit price overrides, line-item discounts, and summary totals.
- **Invoice Customization**: Configurable invoice prefixes (e.g., `INV-2026-`), customizable notes, payment terms, and terms of service.
- **PDF Generation & Emailing**: One-click print/PDF download and automated invoice emailing directly to customer inboxes.

### 📦 3. Reusable Inventory & HSN Catalog
- **Catalog Management**: HSN/SAC code tracking, default tax slab assignment (0%, 5%, 12%, 18%, 28%), stock unit tracking (PCS, KG, LTR, BOX, etc.), and purchase/selling prices.
- **Instant Search & Filter**: Real-time search by item name or HSN code with tax slab filter toggles.

### 👥 4. Customer & Party Ledger System
- **Party Directory**: Comprehensive customer and vendor management with GSTIN tracking, state association, contact details, and billing addresses.
- **Ledger Telemetry**: Lifetime billing summary, transaction counters, and quick bill creation per party.

### 📊 5. Real-Time Telemetry & Analytics Dashboard
- **Key Performance Indicators (KPIs)**: Total sales, total tax collected, CGST/SGST/IGST breakdown, and bill counts for today and current month.
- **Recent Activity Table**: Real-time list of recent invoices with payment statuses (`PAID`, `UNPAID`, `PARTIAL`).

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries / Frameworks |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | `@tanstack/react-query`, `react-router-dom`, `react-hook-form`, `zod` |
| **Styling & UI** | Tailwind CSS + Custom Design System | `lucide-react`, `clsx`, `tailwind-merge`, `sonner` toasts |
| **Backend Runtime** | Node.js (ES Modules) | Express.js 4.x, Cors, Helmet, Express Rate Limit |
| **Database & ODM** | MongoDB | Mongoose 8.x, MongoDB Native Aggregations |
| **Authentication** | JWT & HTTP-Only Cookies | `jsonwebtoken`, `bcryptjs`, `cookie-parser` |
| **Validation & Security** | Zod + Express Middleware | Express Validator, Rate Limiters, Custom Error Handlers |

---

## 📁 Repository Structure

```
CodeAthon/
├── Backend/                   # Node.js + Express + MongoDB Server
│   ├── config/                # Environment variables & DB connection
│   ├── constants/               # Roles, permissions, and system constants
│   ├── controllers/             # Request handlers (Auth, Shop, Party, Item, Bill, Dashboard, User)
│   ├── middleware/              # Auth, RBAC role guard, validation, rate limiting, error middleware
│   ├── models/                 # Mongoose schemas (User, Shop, Party, Item, Bill)
│   ├── routes/                 # Express API routes
│   ├── services/               # Business logic (Auth, OTP, Email, Bill calculation)
│   ├── utils/                  # ApiError, ApiResponse, AsyncHandler helpers
│   ├── validators/             # Zod validation schemas
│   ├── app.js                  # Express app initialization & CORS setup
│   ├── server.js               # Entry point & HTTP server launcher
│   └── seed.js                 # Database seeder with demo accounts
│
├── Frontend/                  # React 18 + Vite Web Application
│   ├── src/
│   │   ├── api/                # Centralized Axios client & interceptors
│   │   ├── components/         # Reusable UI components (Buttons, Inputs, Cards, Tables, Badges)
│   │   ├── constants/          # Design tokens, routes, Indian states, roles
│   │   ├── context/            # Global AuthContext & ThemeContext
│   │   ├── features/           # Feature modules (Auth, Dashboard, Parties, Items, Bills, Users)
│   │   ├── hooks/              # Custom hooks (useAuth, usePermission, useTheme)
│   │   ├── layouts/            # AppShell, Topbar, Sidebar, AuthLayout
│   │   ├── pages/              # Page views matching AppRouter routes
│   │   ├── routes/             # AppRouter, ProtectedRoute, RoleRoute, PublicRoute
│   │   ├── styles/             # Global CSS tokens & Tailwind imports
│   │   ├── utils/              # Utility helpers (formatting, tax calculation, className merging)
│   │   └── validations/        # Zod frontend form validation schemas
│   ├── index.html              # HTML entry point
│   └── vite.config.js          # Vite build & dev server config
└── README.md                  # Comprehensive Project Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB server or MongoDB Atlas cluster

---

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` root directory:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/gstbillingpro
   JWT_SECRET=your_super_secret_jwt_key_gst_billing_pro_2026
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   INVOICE_PREFIX=INV-2026
   OTP_EXPIRES_MINUTES=10
   OTP_MAX_ATTEMPTS=5
   OTP_RESEND_COOLDOWN_SECONDS=60
   ```

4. (Optional) Seed the database with demo accounts:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5001`.*

---

### 2. Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Frontend` root directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client will run on `http://localhost:5173` (or `http://localhost:5174`).*

---

## 🔑 Demo Test Accounts

The database seeder provisions pre-configured demo user accounts for testing role-based access:

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **OWNER** | `anirudh@example.com` | `Password123!` | Full admin control, shop settings, user management |
| **ADMIN** | `admindemo1@example.com` | `Password123!` | Catalog, parties, invoice creation, reports |
| **STAFF** | `staffdemo1@example.com` | `Password123!` | Billing desk, customer view, invoice creation |

*(Note: The login page includes 1-click **Demo Quick Fill** buttons for all three roles).*

---

## 📡 Key API Routes

### 🔓 Auth Routes (`/api/auth`)
- `POST /api/auth/signup` — Register new owner & shop profile
- `POST /api/auth/login` — Authenticate user & receive HTTP-only JWT
- `POST /api/auth/logout` — Evict session cookie
- `GET /api/auth/me` — Retrieve active session profile
- `POST /api/auth/forgot-password` — Request password reset OTP
- `POST /api/auth/verify-otp` — Verify 6-digit OTP code
- `POST /api/auth/reset-password` — Reset password with token

### 🏬 Business & Management Routes
- `GET|PUT /api/shop` — Retrieve / Update shop settings *(OWNER only for updates)*
- `GET|POST|PUT|DELETE /api/users` — Team member management *(OWNER only)*
- `GET|POST|PUT|DELETE /api/parties` — Customer & vendor management
- `GET|POST|PUT|DELETE /api/items` — Inventory catalog management
- `GET|POST /api/bills` — Invoice generation & invoice listing
- `GET /api/bills/:id/pdf` — Stream / download invoice PDF
- `POST /api/bills/:id/email` — Email invoice directly to customer
- `GET /api/dashboard/summary` — Analytics & sales telemetry

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
