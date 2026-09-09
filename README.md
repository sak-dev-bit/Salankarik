# SALANKARIK Admin Dashboard

SALANKARIK is an internal administration dashboard for managing a jewellery business.

## Project Architecture

This project is organized as a monorepo containing both the frontend application and backend API.

- `frontend/`: Angular 19 application (Standalone Components, RxJS, Reactive Forms)
- `backend/`: NestJS REST API (TypeScript, PostgreSQL, TypeORM, JWT)

## Prerequisites

- Node.js (v24+)
- pnpm (Package Manager)
- Docker Desktop (for PostgreSQL)

## Installation

Install dependencies for both frontend and backend:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

## Running the Application

### 1. Database

Start the PostgreSQL database using Docker Compose from the root directory:

```bash
docker compose up -d
```

### 2. Backend API

The backend runs on http://localhost:3000.

First, copy the environment variables template and configure them (though defaults are provided for local dev):

```bash
cd backend
cp .env.example .env
```

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
