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

**Phase 4: Backend API Build (In Progress)**
- **Module 1: Authentication** - Fully implemented and verified.
  - Setup `@nestjs/passport` and `@nestjs/jwt`.
  - Created `LoginDto` validated by global `class-validator` pipes.
  - Secure `/auth/login` endpoint issuing JWTs.
  - Secure `/auth/me` and `/auth/admin-only` utilizing `JwtAuthGuard` and custom `RolesGuard` for RBAC.
  - Created a Postman Collection (`postman_collection.json`) documenting API endpoints.

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
