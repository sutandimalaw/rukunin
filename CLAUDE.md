# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rukunin** is a Community Management System (Sistem RT) for neighborhood administration in Indonesia. It handles resident management, financial transactions, and community announcements.

## Commands

```bash
# Development server (Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

There is no test framework configured in this project.

## Architecture

### Stack
- **Next.js 15** (App Router) with TypeScript
- **Supabase** (PostgreSQL + auth via `@supabase/ssr`)
- **React Query** (`@tanstack/react-query`) for data fetching
- **TanStack Form** + **Zod** for forms and validation
- **TanStack Table** for data tables
- **Tailwind CSS v4** + **shadcn/ui** (New York style) + Radix UI primitives

### Directory Layout

```
/app                  → Next.js App Router pages (auth, residents, finance, announcements, report, account)
/components
  /ui                 → shadcn/ui primitives (Button, Dialog, Input, etc.)
  /shared             → Business-level shared components (StatCard, DataTable, forms)
  app-sidebar.tsx     → Main navigation sidebar
/lib/supabase         → Supabase client factories (server.ts, client.ts, middleware.ts)
/provider             → AuthProvider context (exposes current user via useAuth())
/hooks                → Custom React hooks (useAuth, useValidation, use-mobile)
/utils                → Shared utilities
middleware.ts         → Route protection: redirects unauthenticated users to /auth/login
```

### Authentication & Data Flow

1. `middleware.ts` validates Supabase JWT on every request and redirects unauthenticated users.
2. The root layout (`/app/layout.tsx`) is a server component that fetches the session and passes the user to `AuthProvider`.
3. Client components access the current user via `useAuth()` from `/provider/auth-provider.tsx`.
4. Data fetching uses React Query hooks (e.g., `useGetResidents()`, `useGetTransaction()`) that call the Supabase client from `/lib/supabase/client.ts`.
5. Mutations use Supabase RPC functions for business logic (e.g., `add_transaction_v2`).

### Supabase Client Usage

- **Server components / Route Handlers:** `import { createClient } from "@/lib/supabase/server"`
- **Client components:** `import { createClient } from "@/lib/supabase/client"`
- **Middleware:** `import { createClient } from "@/lib/supabase/middleware"` (or use the helper in `middleware.ts`)

> **Note:** There are two parallel Supabase client directories: `/lib/supabase/` and `/utils/supabase/`. Both exist in the repo. Prefer `/lib/supabase/` for new code — it is the canonical location used in newer features.

### Component Conventions

- Use `"use client"` only for interactive components (forms, tables with state, modals).
- Shared reusable components go in `/components/shared/`; shadcn/ui primitives live in `/components/ui/`.
- Forms use TanStack Form with Zod schemas colocated in a `schema.ts` or `formSchema.ts` file next to the feature page.
- Tables use TanStack React Table with column definitions colocated with the feature.
- Domain types (e.g. `PAYMENT`, `PAYMENT_STATUS`) live in `app/utils/data-type.ts`.

#### DataTable (`/components/shared/DataTable.tsx`)

Accepts a pre-built TanStack Table instance — not raw data. Callers call `useReactTable()` themselves and pass the resulting `table` object plus `columnsLength`. Built-in pagination controls (Previous/Next).

```tsx
// caller pattern
const table = useReactTable({ data, columns, ... })
<DataTable table={table} columnsLength={columns.length} />
```

Column definitions are colocated with each feature (e.g. `app/residents/components/table/config.tsx`).

#### Modal (`/components/shared/modal/Modal.tsx`)

Wrapper around Radix Dialog. Supports controlled open state, optional trigger element, size variants (`sm`, `md`, `lg`), and optional footer slot.

```tsx
<Modal open={open} onOpenChange={setOpen} title="..." size="lg" trigger={<Button>Open</Button>} footer={<Button>Save</Button>}>
  {/* content */}
</Modal>
```

#### Form Field pattern

Use `Field`, `FieldLabel`, `FieldError` from `/components/ui/field` inside `form.Field` render props. Mark fields invalid only when touched:

```tsx
<form.Field name="full_name">
  {(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
        <Input ... />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
</form.Field>
```

### Styling

- Tailwind CSS v4 with CSS variables; use design tokens rather than hardcoded colors.
- Path alias `@/*` maps to the repo root.
- `components.json` configures shadcn/ui — use the CLI (`npx shadcn@latest add <component>`) to add new UI primitives.

### Environment

Requires a `.env.local` with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
