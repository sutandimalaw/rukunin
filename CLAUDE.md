# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rukunin** is a Community Management System (Sistem RT) for neighborhood administration in Indonesia. It handles resident management, financial transactions, and community announcements.

## Monorepo Structure

This is a monorepo using npm workspaces:

```
rukunin/
  apps/
    web/    → Next.js 15 frontend (port 3000)
    api/    → NestJS backend (port 3001)
```

## Commands

```bash
# Start PostgreSQL (Docker required)
docker compose up -d

# Frontend dev server (Turbopack)
npm run dev:web

# Backend dev server (watch mode)
npm run dev:api

# Production builds
npm run build:web
npm run build:api

# Lint
npm run lint:web
npm run lint:api
```

## Frontend (`apps/web/`)

### Stack
- **Next.js 15** (App Router) with TypeScript
- **React Query** (`@tanstack/react-query`) for data fetching
- **TanStack Form** + **Zod** for forms and validation
- **TanStack Table** for data tables
- **Tailwind CSS v4** + **shadcn/ui** (New York style) + Radix UI primitives

### Directory Layout

```
apps/web/
  app/                  → Next.js App Router pages (auth, residents, finance, announcements, report, account)
  components/
    ui/                 → shadcn/ui primitives (Button, Dialog, Input, etc.)
    shared/             → Business-level shared components (StatCard, DataTable, forms)
    app-sidebar.tsx     → Main navigation sidebar
  lib/api/              → API client layer (fetch wrapper for NestJS backend)
  provider/             → AuthProvider context (exposes current user via useAuth())
  hooks/                → Custom React hooks (useAuth, useValidation, use-mobile)
  middleware.ts         → Route protection: validates JWT and redirects unauthenticated users
```

### Component Conventions

- Use `"use client"` only for interactive components (forms, tables with state, modals).
- Shared reusable components go in `/components/shared/`; shadcn/ui primitives live in `/components/ui/`.
- Forms use TanStack Form with Zod schemas colocated in a `schema.ts` or `formSchema.ts` file next to the feature page.
- Tables use TanStack React Table with column definitions colocated with the feature.
- Domain types (e.g. `PAYMENT`, `PAYMENT_STATUS`) live in `app/utils/data-type.ts`.

#### DataTable (`components/shared/DataTable.tsx`)

Accepts a pre-built TanStack Table instance — not raw data. Callers call `useReactTable()` themselves and pass the resulting `table` object plus `columnsLength`. Built-in pagination controls (Previous/Next).

```tsx
const table = useReactTable({ data, columns, ... })
<DataTable table={table} columnsLength={columns.length} />
```

#### Modal (`components/shared/modal/Modal.tsx`)

Wrapper around Radix Dialog. Supports controlled open state, optional trigger element, size variants (`sm`, `md`, `lg`), and optional footer slot.

#### Form Field pattern

Use `Field`, `FieldLabel`, `FieldError` from `components/ui/field` inside `form.Field` render props. Mark fields invalid only when touched.

### Styling

- Tailwind CSS v4 with CSS variables; use design tokens rather than hardcoded colors.
- Path alias `@/*` maps to `apps/web/`.
- `components.json` configures shadcn/ui — use the CLI (`npx shadcn@latest add <component>`) to add new UI primitives.

## Backend (`apps/api/`)

### Stack
- **NestJS 11** with TypeScript
- **Prisma** ORM with PostgreSQL
- **Passport.js** + JWT for authentication
- **class-validator** + **class-transformer** for DTO validation
- **Swagger** for API documentation (available at `/api/docs`)

### Directory Layout

```
apps/api/src/
  main.ts               → Bootstrap (CORS, Swagger, ValidationPipe, global prefix /api/v1)
  app.module.ts          → Root module importing all feature modules
  prisma/                → Prisma schema, service, module
  common/                → Guards, decorators, filters, interceptors
  auth/                  → JWT auth (login, register, logout, refresh, password reset)
  residents/             → Resident CRUD
  finance/               → Transaction CRUD + balance calculation + summary
  profiles/              → User profile read/update
  announcements/         → Announcements CRUD
  reports/               → Financial reports with date filtering
```

### API Conventions

- All endpoints prefixed with `/api/v1`
- Protected routes use `@UseGuards(JwtAuthGuard)`
- Current user extracted via `@CurrentUser()` decorator
- DTOs validated with `class-validator` decorators
- Prisma service injected via dependency injection

### Database

- PostgreSQL 16 via Docker Compose
- Prisma manages schema and migrations
- Tables: `users`, `profiles`, `residents`, `transactions`, `announcements`

### Environment

**`apps/api/.env`:**
```
DATABASE_URL="postgresql://rukunin:rukunin_dev@localhost:5432/rukunin"
JWT_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**`apps/web/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```
