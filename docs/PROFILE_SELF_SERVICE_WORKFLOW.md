# Workflow — Profil Warga Mandiri (Create & Update)

Dokumen ini menjelaskan alur **warga self-service** untuk melengkapi dan memperbarui data kependudukan/KK, sehingga admin tidak perlu input manual ratusan warga.

## Diagram (Mermaid)

```mermaid
flowchart TD
  A[Warga daftar akun] --> B[Status user = PENDING]
  B --> C[Admin approve di /kelola-pengguna]
  C --> D[Status user = ACTIVE]

  D --> E[Warga login]
  E --> F{isProfileComplete?\n(cek Resident.email == user.email)}

  F -- Tidak --> G[Redirect paksa ke /account/profile]
  G --> H[Warga isi data KK + data diri]
  H --> I[PUT /residents/my-profile]
  I --> I1{Household kkNumber ada?}
  I1 -- Tidak --> J[Buat Household baru]
  I1 -- Ada --> K[Update Household]
  J --> L[Upsert Resident by email]
  K --> L
  L --> M[GET /auth/me refresh state]
  M --> N[Redirect ke /portal]

  F -- Ya --> N

  N --> O[Update tahunan / sewaktu-waktu]
  O --> G
```

## Catatan penting

- `isProfileComplete` dihitung dengan cara yang konsisten dengan Portal Warga/Iuran: **berdasarkan `Resident.email`**.
- Endpoint self-service menggunakan **`kkNumber`** sebagai kunci untuk Household (unik) dan **`user.email`** sebagai kunci untuk Resident.
- Admin approval tetap diperlukan untuk mencegah spam registrasi.
