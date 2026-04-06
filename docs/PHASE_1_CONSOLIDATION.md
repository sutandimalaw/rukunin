# Phase 1: Consolidation Guide

**Duration:** 1-2 days  
**Goal:** Remove technical debt, standardize Supabase client, fix cache issues  
**Impact:** Foundation for all future work

---

## Task 1: Consolidate Supabase Client (rm `/utils/supabase/`)

### Current State
Two identical Supabase client directories with different patterns:

```
/lib/supabase/
  ├── client.ts     (uses getClaims(), modern pattern)
  ├── server.ts
  └── middleware.ts

/utils/supabase/
  ├── client.ts     (uses getUser(), legacy pattern)
  ├── server.ts
  └── middleware.ts
```

Different env vars:
- `/lib/supabase/` expects `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- `/utils/supabase/` expects `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Solution

**Step 1: Identify all imports of `/utils/supabase/`**

```bash
grep -r "@/utils/supabase" --include="*.tsx" --include="*.ts" /app
grep -r "@/utils/supabase" --include="*.tsx" --include="*.ts" /components
```

**Expected results:**
- `app/residents/hooks/useGetResidents.tsx`
- `app/finance/hooks/useGetSummary.tsx`
- `app/finance/hooks/useGetTransaction.tsx`
- `app/account/account-form.tsx`

**Step 2: For each file, replace imports**

Example for `app/residents/hooks/useGetResidents.tsx`:
```tsx
// Before
import { createClient } from "@/utils/supabase/client"

// After
import { createClient } from "@/lib/supabase/client"
```

**Step 3: Verify `.env.local` has correct variable name**

```bash
# Should have:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# OR (if using PUBLISHABLE_OR_ANON_KEY):
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=...
```

Check which one `/lib/supabase/client.ts` actually expects:
```bash
grep "NEXT_PUBLIC_SUPABASE" lib/supabase/client.ts
```

Update `.env.local` if needed.

**Step 4: Delete `/utils/supabase/` directory**

```bash
rm -rf utils/supabase/
```

**Step 5: Verify build still works**

```bash
npm run build
```

If errors, they'll point to remaining imports of `/utils/supabase/` that need fixing.

**Step 6: Test locally**

```bash
npm run dev
```

Verify:
- [ ] Login page loads
- [ ] Can log in
- [ ] Dashboard loads
- [ ] Residents page loads and displays data
- [ ] Finance page loads
- [ ] No console errors

### Validation Checklist

- [ ] No more `@/utils/supabase` imports in codebase
- [ ] `/utils/supabase/` folder deleted
- [ ] Build passes (`npm run build`)
- [ ] Dev server runs without errors
- [ ] All pages still work after login

---

## Task 2: Fix Query Key Collision

### Current State

In React Query/TanStack Query, query keys are used to identify cached data. Two hooks have the same key:

```tsx
// /app/finance/hooks/useGetTransaction.tsx
useQuery({
  queryKey: ['transactions'],  // ❌ WRONG
  queryFn: async () => { ... }
})

// /app/finance/hooks/useGetSummary.tsx
useQuery({
  queryKey: ['transactions'],  // ❌ WRONG - COLLISION!
  queryFn: async () => { ... }
})
```

When both hooks are used in the same component, they share the same cache. Invalidating one can accidentally invalidate or overwrite the other.

### Solution

**Step 1: Locate the files**

```bash
find . -name "useGetTransaction*" -o -name "useGetSummary*"
```

**Step 2: Update query keys**

#### For `useGetTransaction`:
```tsx
// Before
useQuery({
  queryKey: ['transactions'],
  queryFn: async () => { ... }
})

// After
useQuery({
  queryKey: ['transactions', 'list'],
  queryFn: async () => { ... }
})
```

#### For `useGetSummary`:
```tsx
// Before
useQuery({
  queryKey: ['transactions'],
  queryFn: async () => { ... }
})

// After
useQuery({
  queryKey: ['transactions', 'summary'],
  queryFn: async () => { ... }
})
```

**Step 3: Check for invalidations**

Search for places where these queries are invalidated:

```bash
grep -r "queryClient.invalidateQueries" --include="*.tsx" --include="*.ts"
grep -r "queryKey: \['transactions'\]" --include="*.tsx" --include="*.ts"
```

Update any invalidations to use the new keys:

```tsx
// Before
queryClient.invalidateQueries({ queryKey: ['transactions'] })

// After
queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] })
queryClient.invalidateQueries({ queryKey: ['transactions', 'summary'] })
// Or invalidate both together:
queryClient.invalidateQueries({ queryKey: ['transactions'] })
```

**Step 4: Test**

```bash
npm run dev
```

Verify:
- [ ] Finance page loads
- [ ] Both transaction list and summary display correctly
- [ ] Refreshing one doesn't break the other
- [ ] No console errors

### Validation Checklist

- [ ] `useGetTransaction` uses `['transactions', 'list']`
- [ ] `useGetSummary` uses `['transactions', 'summary']`
- [ ] All invalidations updated
- [ ] Build passes
- [ ] Dev server works, no console errors

---

## Task 3: Generate Supabase Types

### Current State

Types are manually defined:
- `PAYMENT` type in `app/utils/data-type.ts`
- Types don't automatically sync with database schema
- Risk of drift between code and actual DB

### Solution

**Step 1: Install Supabase CLI locally** (if not already installed)

```bash
npm install -D supabase
```

**Step 2: Generate types from your Supabase project**

```bash
# Method 1: Using Supabase CLI
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts

# Method 2: If you have supabase access token
SUPABASE_ACCESS_TOKEN=your_token npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

**If you don't have project ID:**
- Go to https://app.supabase.com → your project → Settings → General
- Copy "Project ID"

**Step 3: Add to `.gitignore`** (optional, usually you commit generated types)

Most teams commit generated types so everyone has the same definitions.

**Step 4: Verify file was created**

```bash
cat lib/database.types.ts | head -20
```

Should see something like:
```ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      residents: {
        Row: { ... }
        Insert: { ... }
        Update: { ... }
      }
      transactions: {
        Row: { ... }
        ...
      }
      ...
    }
    ...
  }
}
```

**Step 5: Update types in codebase**

Replace manual type definitions with generated ones:

```tsx
// Before
export type PAYMENT = {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  // ...
}

// After
import { Database } from "@/lib/database.types"

export type PAYMENT = Database['public']['Tables']['transactions']['Row']
```

**Step 6: Update column definitions to use generated types**

```tsx
// /app/residents/components/table/config.tsx
// Before
import { ColumnDef } from "@tanstack/react-table"
import { PAYMENT } from "@/app/utils/data-type"

export const columns: ColumnDef<PAYMENT>[] = [...]

// After
import { ColumnDef } from "@tanstack/react-table"
import { Database } from "@/lib/database.types"

type PAYMENT = Database['public']['Tables']['transactions']['Row']

export const columns: ColumnDef<PAYMENT>[] = [...]
```

**Step 7: Update Supabase queries to use typed results**

```tsx
// Before
const { data } = await supabase.from('transactions').select('*')
// data is unknown/any

// After (with generated types)
const { data } = await supabase.from('transactions').select('*')
// data is automatically Transaction[] with correct types
```

**Step 8: Test**

```bash
npm run build
npm run dev
```

Verify:
- [ ] TypeScript compilation succeeds
- [ ] No type errors
- [ ] App still works
- [ ] IDE autocomplete shows correct types

**Step 9: Add to CI/CD (if available)**

Consider regenerating types in CI so they stay in sync:

```bash
# In your CI workflow
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

### Validation Checklist

- [ ] `lib/database.types.ts` created and not empty
- [ ] Types imported from generated file instead of manual definitions
- [ ] TypeScript build succeeds with no errors
- [ ] App works locally
- [ ] Column definitions use generated types

---

## After Phase 1: Commit & Create PR

Once all three tasks are done:

```bash
git add -A
git commit -m "Phase 1: Consolidate Supabase client, fix query keys, generate types

- Remove /utils/supabase/ duplicate directory
- Migrate all imports to /lib/supabase/ as single source of truth
- Fix query key collision between useGetTransaction and useGetSummary
- Generate TypeScript types from Supabase schema (lib/database.types.ts)
- Update column definitions to use generated types

Relates to: SaaS Architecture Roadmap"
```

Then create PR:
```bash
gh pr create \
  --title "Phase 1: Consolidate Supabase client & fix query keys" \
  --body "Implements Phase 1 of SaaS Architecture Roadmap

## Changes
- [ ] Consolidated Supabase client (removed /utils/supabase/)
- [ ] Fixed query key collision
- [ ] Generated Supabase types

## Testing
- [x] Build passes
- [x] Dev server runs
- [x] All pages load
- [x] No console errors

See docs/SAAS_ARCHITECTURE_ROADMAP.md for full context"
```

---

## Troubleshooting

### Build fails after consolidation
**Check:** Are there any remaining imports of `@/utils/supabase/`?
```bash
grep -r "@/utils/supabase" .
```

### Dev server crashes with Supabase error
**Check:** Is `.env.local` using correct env variable name?
```bash
cat .env.local | grep SUPABASE
```

### Query key collision not fixed
**Check:** Are you invalidating the right keys?
```bash
grep -r "invalidateQueries" app/
```

### Generated types file is empty
**Check:** 
1. Did you provide the correct PROJECT_ID?
2. Do you have internet access to Supabase?
3. Are your Supabase credentials valid?

---

## Done! 🎉

Once Phase 1 passes validation, you're ready for **Phase 2: Multi-Tenancy** (RLS, organization_id).
