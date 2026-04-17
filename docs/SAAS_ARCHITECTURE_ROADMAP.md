# SaaS Architecture Roadmap untuk Rukunin

**Status:** Planning & Architecture Review  
**Date:** 2026-04-06  
**Objective:** Transform Rukunin dari single-tenant menjadi multi-tenant SaaS platform yang siap untuk puluhan RT/RW

---

## Overview

Rukunin saat ini dibangun sebagai **single-tenant application** — satu organisasi (RT/RW) per deployment. Roadmap ini menjelaskan bagaimana mentransformasi Rukunin menjadi **multi-tenant SaaS** dengan shared codebase dan database yang sama, namun data terisolasi per tenant.

### Good News: Stack Sudah Tepat ✅

Tech stack yang digunakan **sudah ideal** untuk SaaS skala kecil:

| Layer | Tech | Why It Works |
|-------|------|--------------|
| **Frontend** | Next.js 15 App Router + TypeScript | SSR, Server Components, built-in routing |
| **Auth** | Supabase Auth + JWT | Scalable, RLS support, token-based |
| **Database** | PostgreSQL via Supabase | RLS policies, strong consistency, ACID |
| **Data Fetching** | React Query (TanStack) | Client-side caching, refetch policies |
| **Forms** | TanStack Form + Zod | Type-safe validation, reactive |
| **Tables** | TanStack Table | Sorting, filtering, pagination |
| **UI** | shadcn/ui + Tailwind v4 | Consistent, accessible, themeable |

**Tidak perlu ganti tech stack.** Yang perlu dibenahi adalah **organisasi kode dan data isolation.**

---

## Problems & Solutions

### 1. 🔴 CRITICAL: Duplicate Supabase Client

**Problem:**  
Ada dua direktori Supabase client yang identical:
- `/lib/supabase/` — pattern baru pakai `getClaims()`
- `/utils/supabase/` — pattern lama pakai `getUser()`

Bahkan env var-nya beda:
- `/lib/` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- `/utils/` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Impact:** Maintenance nightmare. Hooks menggunakan kedua direktori, tidak ada single source of truth.

**Solution:**
1. Hapus `/utils/supabase/` sepenuhnya
2. Migrate semua imports ke `/lib/supabase/`
3. Standardize env variables

**Files to update:**
- `app/residents/hooks/useGetResidents.tsx` → ganti import `@/utils/` ke `@/lib/`
- `app/finance/hooks/useGetSummary.tsx` → ganti import
- `app/finance/hooks/useGetTransaction.tsx` → ganti import
- `app/account/account-form.tsx` → verify imports
- Hapus folder `/utils/supabase/`

**Effort:** Small | **Impact:** High

---

### 2. 🔴 CRITICAL: No Multi-Tenancy

**Problem:**  
Saat ini data **tidak diisolasi per RT/RW**. Untuk SaaS, setiap tenant harus hanya akses data miliknya sendiri.

**Impact:** Single-tenant only. Tidak bisa scale to multiple organizations.

**Solution - Recommended Approach:**

Implementasikan **Row Level Security (RLS) di Supabase** untuk isolasi data otomatis:

1. **Add `organization_id` column** ke setiap tabel:
   ```sql
   ALTER TABLE residents ADD COLUMN organization_id UUID NOT NULL REFERENCES organizations(id);
   ALTER TABLE transactions ADD COLUMN organization_id UUID NOT NULL REFERENCES organizations(id);
   ALTER TABLE announcements ADD COLUMN organization_id UUID NOT NULL REFERENCES organizations(id);
   -- Dan tabel lainnya...
   
   -- Create index untuk performa
   CREATE INDEX idx_residents_org_id ON residents(organization_id);
   CREATE INDEX idx_transactions_org_id ON transactions(organization_id);
   ```

2. **Link user ke organization:**
   ```sql
   -- In auth.users
   ALTER TABLE auth.users ADD COLUMN organization_id UUID REFERENCES organizations(id);
   ```

3. **Set up RLS policies** (enable RLS pada tabel):
   ```sql
   ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can only see residents in their organization"
     ON residents FOR SELECT
     USING (organization_id = auth.jwt_claim('org_id')::UUID);
   
   CREATE POLICY "Users can only modify residents in their organization"
     ON residents FOR UPDATE
     USING (organization_id = auth.jwt_claim('org_id')::UUID);
   
   CREATE POLICY "Users can insert residents in their organization"
     ON residents FOR INSERT
     WITH CHECK (organization_id = auth.jwt_claim('org_id')::UUID);
   
   -- Apply to other tables similarly...
   ```

4. **Update JWT claim** di auth trigger:
   ```sql
   -- In Supabase auth.users trigger
   ALTER TABLE auth.users ADD COLUMN organization_id UUID;
   
   -- Ensure JWT contains org_id
   ```

**Why RLS?**
- Isolasi data di **database level** (tidak bisa di-bypass dari client)
- Queries otomatis filtered — tidak perlu manual filter di setiap hook
- Shared database & codebase → cost efficient
- Scalable untuk puluhan RT

**Effort:** Medium | **Impact:** CRITICAL (Must-have for SaaS)

---

### 3. 🟡 HIGH: Query Key Collision

**Problem:**  
`useGetSummary()` dan `useGetTransaction()` keduanya pakai query key `['transactions']`.
Ini menyebabkan **cache collision** — invalidate satu bisa timpakan data yang lain.

**Impact:** Stale data, cache inconsistency, hard to debug.

**Solution:**
```tsx
// Before (WRONG)
useQuery({
  queryKey: ['transactions'],  // ❌ Collision!
  queryFn: () => getTransactions()
})

// After (CORRECT)
useQuery({
  queryKey: ['transactions', 'list'],
  queryFn: () => getTransactions()
})

useQuery({
  queryKey: ['transactions', 'summary'],
  queryFn: () => getTransactionSummary()
})
```

**Files to update:**
- `app/finance/hooks/useGetTransaction.tsx`
- `app/finance/hooks/useGetSummary.tsx`

**Effort:** Small | **Impact:** High

---

### 4. 🟡 HIGH: Missing Service Layer

**Problem:**  
Business logic tersebar di hooks. Struktur saat ini:
```
Component → useGetResidents() → supabase.from('residents').select('*')
```

Untuk SaaS yang scalable:
```
Component → useGetResidents() → residentsService.getAll() → supabase query
```

**Why service layer matters for SaaS:**
- **Isolation:** Business logic (filtering by org, formatting) terpisah dari data fetching
- **Flexibility:** Kalau ganti dari Supabase ke DB lain, cukup update service layer
- **Testability:** Service bisa di-test tanpa React Query
- **Reusability:** Service bisa dipakai di Server Components, API Routes, dan Client Hooks

**Solution:**

Create `/services/` folder:
```
/services
  residents.ts      → residentsService.getAll(), create(), update(), delete()
  transactions.ts   → transactionsService.getAll(), getSummary(), etc.
  organizations.ts  → organizationsService.getByUser(), create(), etc.
```

Example pattern:
```tsx
// /services/residents.ts
import { createClient } from "@/lib/supabase/client"

export const residentsService = {
  async getAll(orgId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('organization_id', orgId)  // Explicit filtering (or rely on RLS)
    
    if (error) throw error
    return data
  },

  async create(orgId: string, resident: CreateResidentInput) {
    const supabase = createClient()
    return await supabase
      .from('residents')
      .insert({ ...resident, organization_id: orgId })
      .single()
  },

  async update(orgId: string, id: string, resident: UpdateResidentInput) {
    // Update logic
  },

  async delete(orgId: string, id: string) {
    // Delete logic
  }
}
```

Then in hooks:
```tsx
// /app/residents/hooks/useGetResidents.tsx
import { residentsService } from "@/services/residents"

export function useGetResidents(orgId: string) {
  return useQuery({
    queryKey: ['residents', orgId],
    queryFn: () => residentsService.getAll(orgId)
  })
}
```

**Effort:** Medium | **Impact:** High (reduces tech debt)

---

### 5. 🟡 MEDIUM: Large Component (`dialog-form.tsx`)

**Problem:**  
`app/residents/create/dialog-form.tsx` adalah 540+ baris dengan 14 field repetitif.

**Solution:**
Leverage existing `FormInput` dan `FormSelect` components. Define field config sebagai array, lalu map:

```tsx
// Before: 540+ lines with repeated <FormField> blocks
<form.Field name="full_name">
  {(field) => <Input {...field} />}
</form.Field>
<form.Field name="gender">
  {(field) => <Select {...field}><Option>...</Option></Select>}
</form.Field>
// ... repeat 12 more times...

// After: Declarative field config
const fields = [
  { 
    name: 'full_name', 
    label: 'Nama Lengkap', 
    type: 'text',
    placeholder: 'Masukkan nama lengkap'
  },
  { 
    name: 'gender', 
    label: 'Gender', 
    type: 'select', 
    options: [
      { value: 'male', label: 'Laki-laki' },
      { value: 'female', label: 'Perempuan' }
    ]
  },
  { 
    name: 'blok', 
    label: 'Blok', 
    type: 'text' 
  },
  // ... define all 14 fields...
]

{fields.map(field => (
  <form.Field key={field.name} name={field.name}>
    {(fieldCtx) => {
      const isInvalid = fieldCtx.state.meta.isTouched && !fieldCtx.state.meta.isValid
      return (
        <Field data-invalid={isInvalid}>
          <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          {field.type === 'select' ? (
            <FormSelect 
              form={form} 
              field={fieldCtx}
              options={field.options}
            />
          ) : (
            <FormInput 
              form={form} 
              field={fieldCtx}
              placeholder={field.placeholder}
            />
          )}
          {isInvalid && <FieldError errors={fieldCtx.state.meta.errors} />}
        </Field>
      )
    }}
  </form.Field>
))}
```

**Effort:** Small | **Impact:** Medium (maintainability)

---

### 6. 🟡 MEDIUM: Weak Type Safety

**Problem:**
- `FormInput` dan `FormSelect` accept `form: any`
- `PAYMENT` type di `app/utils/data-type.ts` manually maintained
- No generated types dari Supabase schema → drift risk

**Solution:**

1. **Generate Supabase types:**
   ```bash
   npm install -D supabase
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
   ```

2. **Use generated types as single source of truth:**
   ```tsx
   import { Database } from "@/lib/database.types"
   
   // Now all types come from DB schema
   type Resident = Database['public']['Tables']['residents']['Row']
   type Payment = Database['public']['Tables']['transactions']['Row']
   ```

3. **Fix FormInput & FormSelect to be generic:**
   ```tsx
   interface FormInputProps<TFieldValues extends FieldValues> {
     form: UseFormReturn<TFieldValues>
     field: FieldApi<TFieldValues, string>
     placeholder?: string
   }
   
   export function FormInput<TFieldValues extends FieldValues>({
     form,
     field,
     placeholder
   }: FormInputProps<TFieldValues>) {
     return <Input {...field.getInputProps()} placeholder={placeholder} />
   }
   ```

**Effort:** Medium | **Impact:** High (type safety, DRY principle)

---

### 7. 🟢 LOW: Inconsistent Auth Forms

**Problem:**  
Auth forms (login, signup) pakai `useState` manual, sementara feature forms pakai TanStack Form + Zod.

**Solution (Long-term):**  
Standardisasi semua forms ke TanStack Form + Zod untuk consistency. Tapi ini bukan blocker untuk launch SaaS.

**Effort:** Medium | **Impact:** Low (tech debt)

---

### 8. 🟢 LOW: UX Feedback (alert → toast)

**Problem:**  
Beberapa form masih pakai `alert()` untuk feedback.

**Solution:**  
Sonner (toast library) sudah installed. Ganti semua `alert()` dengan `toast()`:

```tsx
// Before
alert('Resident created successfully!')

// After
import { toast } from 'sonner'
toast.success('Resident created successfully!')
```

**Effort:** Small | **Impact:** Low (UX improvement)

---

## Recommended Folder Structure

```
/app
  /(auth)                    ← Public routes (login, signup, etc)
    login
    signup
    forgot-password
  /(dashboard)               ← Protected routes with sidebar
    layout.tsx
    /residents
      page.tsx
      create/
      [id]/
      components/
        table/
          config.tsx
        dialog-form.tsx
    /finance
    /announcements
    /account
    /settings                ← NEW: org settings, member management, billing

/components
  /ui                        ← shadcn/ui primitives (unchanged)
  /shared                    ← Business components
    DataTable.tsx
    Modal.tsx
    FormInput.tsx
    FormSelect.tsx

/services                     ← NEW: Domain service layer
  residents.ts
  transactions.ts
  organizations.ts
  announcements.ts

/lib
  /supabase                   ← CONSOLIDATE: Single Supabase client location
    client.ts
    server.ts
    middleware.ts
  database.types.ts           ← NEW: Generated from Supabase schema
  utils.ts

/hooks                        ← Global hooks
  useAuth.ts
  useGetResidents.ts
  useGetTransactions.ts
  (etc)

/provider                     ← Context providers
  auth-provider.tsx
```

---

## Implementation Roadmap

### Phase 1: Consolidation (Week 1) - **Foundation**

| # | Task | Files | Effort | Impact |
|---|------|-------|--------|--------|
| 1 | Consolidate Supabase client (rm `/utils/supabase/`) | 5-6 files | **Small** | **High** |
| 2 | Fix query key collision | 2 hooks | **Small** | **High** |
| 3 | Generate Supabase types | 1 command | **Small** | **High** |

**Why first:** These are quick wins that remove technical debt and unblock other work.

### Phase 2: Multi-Tenancy (Week 2-3) - **Critical for SaaS**

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 4 | Add `organization_id` column to all tables | **CRITICAL** | Medium |
| 5 | Set up RLS policies | **CRITICAL** | Medium |
| 6 | Create organizations table & management | **CRITICAL** | Medium |

**Why critical:** This is what makes it multi-tenant. Without this, still single-tenant.

### Phase 3: Architecture Improvement (Week 4) - **Maintainability**

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 7 | Create `/services/` layer | High | Medium |
| 8 | Refactor dialog-form.tsx | Medium | Small |
| 9 | Improve type safety (use generated types) | High | Medium |

**Why after:** These are refactors that work better once foundation is solid.

### Phase 4: Polish (Week 5) - **Nice to Have**

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 10 | Replace alert() with toast() | Low | Small |
| 11 | Standardize auth forms | Low | Medium |
| 12 | Add route groups `/(auth)` & `/(dashboard)` | Low | Small |

---

## Testing Strategy

### Phase 1 & 2: Manual Testing
- Verify consolidated Supabase client works across all hooks
- Test RLS policies isolate data correctly (use two test organizations)
- Verify JWT claims include org_id

### Phase 3: Add Unit Tests
- Test service layer functions independently
- Test form validation (Zod schemas)

### Phase 4: E2E Tests
- Multi-org isolation scenarios
- User signup → org creation → data isolation flow

---

## Success Criteria

After implementing this roadmap, Rukunin will be:

- ✅ **Multi-tenant ready** — Each RT/RW isolated at database level (RLS)
- ✅ **Maintainable** — Single client, service layer, type-safe
- ✅ **Scalable** — Shared codebase & database, but isolated data
- ✅ **SaaS-ready** — Can onboard multiple organizations simultaneously
- ✅ **Cost-efficient** — No need for separate deployments per tenant

---

## Next Steps

1. **Review this roadmap** with the team
2. **Prioritize Phase 1 & 2** for immediate launch readiness
3. **Assign owners** to each phase
4. **Track progress** using GitHub issues/projects
5. **Update this doc** as you learn and adapt

---

## Questions?

If implementing, refer back to this document and the original analysis in the plan file.

For questions about specific implementations, check:
- CLAUDE.md — Architecture patterns and conventions
- `/docs/` — Other architectural docs
- Supabase docs — RLS policies, auth configuration
