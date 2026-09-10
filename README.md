# SALANKARIK Admin Dashboard

SALANKARIK is a production-ready internal administration dashboard for managing a jewellery business.

## Current Progress & Features Implemented

**Phase 1 & 2: Project Initialization**
- Monorepo structure established.
- `frontend/`: Angular 19 scaffolded (Standalone Components, Signals, RxJS, Reactive Forms, SCSS).
- `backend/`: NestJS 11 scaffolded (TypeScript, REST APIs, pnpm).

**Phase 3: Database Design & Configuration**
- Integrated with **Neon PostgreSQL** as the production-ready database provider.
- Configured TypeORM strictly with environment variables and SSL.
- Created 15+ complex entities using UUIDs, strict relationships, and numeric types for pricing (Users, Customers, Products, Inventory, Orders, Discounts, Payments, etc.).
- Handled NestJS 11 ESM (NodeNext) quirks safely for entity relations.
- Generated and executed schema migrations.
- Implemented robust development seeding (`pnpm run seed`) creating foundational Admin, Customer, Category, Product, Inventory, and Order data.

**Phase 4: Backend API Build (Completed)**
- **Module 1: Authentication** - Fully implemented and verified.
  - Setup `@nestjs/passport` and `@nestjs/jwt`.
  - Secure `/auth/login`, `/auth/me` and `/auth/admin-only` utilizing `JwtAuthGuard` and custom `RolesGuard` for RBAC.
- **Module 2: Products** - Fully implemented and verified.
  - CRUD for Products with pagination and comprehensive filtering.
  - Cloudinary integration via Multer `FileInterceptor` for secure product image uploads.
  - Atomic generation of `Inventory` rows upon product creation.
- **Module 3: Inventory** - Fully implemented and verified.
  - Stock retrieval endpoints (`GET /inventory`).
  - Stock adjustment (`PATCH /inventory/:productId`) utilizing strict `pessimistic_write` TypeORM lock transactions.
  - Automatic historical auditing written to `inventory_history`.
- **Module 4: Customers** - Fully implemented and verified.
  - Paginated customer listings with `ILIKE` searching.
  - Detailed relational fetches joining `Customer` -> `Address` and `Order` objects safely.
- **Module 5: Orders** - Fully implemented and verified.
  - Paginated order listings with dynamic status and payment filtering.
  - Robust detail retrieval unpacking `OrderItem`, `Product`, `Payment`, and `Shipment` relations.
  - Validation-backed endpoints to transition `OrderStatus` strings.
- **Module 6: Discounts** - Fully implemented and verified.
  - Comprehensive CRUD for Discount management (`POST`, `GET`, `PATCH`, `DELETE`).
  - Validation-backed `class-validator` restrictions for discount criteria and types (`percentage`, `fixed_amount`, `free_shipping`).
- **Module 7: Payments** - Fully implemented and verified.
  - Paginated payment listings securely restricted to `ADMIN` and `STAFF`.
  - Nested resolution bringing in associated `Order` and `Customer` details per payment record.
- **Module 8: Dashboard / Analytics** - Fully implemented and verified.
  - Generates top-level aggregated SQL KPIs: Total Revenue, Total Orders, Today's Sales, and Low Stock Alerts dynamically without heavy database overhead.
- **Module 9: Activity Logging** - Fully implemented and verified.
  - Implemented `ActivityLogInterceptor` dynamically intercepting all `POST`, `PATCH`, and `DELETE` requests globally across the backend.
  - Maps mutation logs to `admin_id` directly through JWT extraction.
  - Provides a `/activity-logs` endpoint with strict access control allowing administrators to audit the system efficiently.
- **Postman Documentation** - Iteratively updated `postman_collection.json` containing tests for all the above endpoints.

**Phase 5: Frontend Build (In Progress)**
- **Step 1: Authentication** - Fully implemented. Configured Tailwind v4, environments, `AuthService` with Signals, login view, and HTTP interceptors.
- **Step 2: Application Shell** - Fully implemented. Built layout architecture (`SidebarComponent`, `TopbarComponent`, `ShellComponent`) leveraging `lucide-angular` standalone icons and router outlets.
- **Step 3: Dashboard** - Fully implemented. Developed analytical KPI cards, `Chart.js` financial trajectory graphics, boutique top performers list, and stock reorder alerts dynamically fetching from NestJS.
- **Step 4: Products** - Fully implemented. Engineered the Products Catalog datagrid and a comprehensive Reactive Form for New/Edit modes, including direct frontend integration for Cloudinary image uploads.

## Project Architecture

- `frontend/`: Angular 19 application
- `backend/`: NestJS REST API

## Prerequisites

- Node.js (v24+)
- pnpm (Package Manager)
- Neon PostgreSQL Account / Connection String

## Installation

Install dependencies for both frontend and backend:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

## Running the Application

### 1. Database Configuration

The application uses Neon PostgreSQL. You must create a `.env` file in the `backend` directory based on the `.env.example` structure.

```bash
cd backend
cp .env.example .env
```
Ensure your `DATABASE_URL` is pointing to your Neon connection string.

### 2. Backend API

The backend runs on http://localhost:3000.

Start the NestJS backend:

```bash
cd backend
pnpm start:dev
```

You can check if the API is running by visiting: http://localhost:3000/health

### 3. Frontend Dashboard

The frontend runs on http://localhost:4200.

```bash
cd frontend
pnpm start
```
