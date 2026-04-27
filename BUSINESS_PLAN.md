# Rukunin — Business Plan

**Sistem Manajemen RT Digital**
**Versi**: 1.0 | **Tanggal**: April 2026

---

## 1. Ringkasan Eksekutif

**Rukunin** adalah aplikasi web untuk digitalisasi administrasi RT/RW di Indonesia. Mencakup manajemen kependudukan, keuangan, iuran, pengumuman, kegiatan warga, layanan warga, inventaris, dan portal self-service untuk warga.

**Posisi saat ini**: Produk sudah ~85% feature-complete, siap pilot project.

**Tujuan utama**:
- Portfolio project full-stack production-grade
- Side income dari langganan RT
- Fondasi untuk project IT berikutnya

---

## 2. Produk

### 2.1 Fitur yang Sudah Jadi (16 Modul)

| # | Modul | Deskripsi |
|---|-------|-----------|
| 1 | Auth & User Management | Register, login, JWT, approval workflow (ADMIN/WARGA) |
| 2 | Data Kependudukan | CRUD warga, search, summary statistik |
| 3 | Kartu Keluarga (KK) | CRUD household, member management |
| 4 | Keuangan | Pemasukan/pengeluaran, running balance, summary |
| 5 | Iuran Warga | Generate tagihan, bayar, batch payment, laporan nunggak |
| 6 | Pengumuman | CRUD, kategori, published toggle |
| 7 | Kegiatan Warga | Voting → schedule → RSVP → complete lifecycle |
| 8 | Layanan Warga | Surat keterangan, laporan kerusakan, komplain, tracking status |
| 9 | Laporan | Keuangan (date range) + kependudukan |
| 10 | Kelola Pengguna | Approve/reject registrasi warga |
| 11 | Profile/Account | Edit profil, password change |
| 12 | Dashboard Admin | Real-time stats (warga, keuangan, iuran, kegiatan) |
| 13 | Portal Warga | Self-service: cek iuran, pengumuman, kegiatan, layanan |
| 14 | Pengurus RT | Manajemen struktur kepengurusan |
| 15 | Penyedia Jasa | Direktori jasa warga + review |
| 16 | Inventaris | Tracking aset RT + peminjaman |

### 2.2 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React Query, TanStack Form/Table, Tailwind CSS v4, shadcn/ui |
| Backend | NestJS 11, Prisma ORM, Passport.js JWT |
| Database | PostgreSQL 16 |
| Deployment | Ubuntu 24.04, Nginx, PM2, Let's Encrypt |

### 2.3 Value Proposition

Untuk pengurus RT:
- **Hemat waktu**: Pencatatan keuangan & iuran otomatis (vs buku tulis)
- **Transparan**: Warga bisa cek tagihan sendiri via HP
- **Terorganisir**: Data warga, KK, kegiatan semua di satu tempat
- **Akses 24/7**: Dari HP/laptop, tidak perlu ketemu langsung

---

## 3. Target Market

### 3.1 Pilot Customer

| Item | Detail |
|------|--------|
| Target | RT 4 |
| Jumlah warga | ~200 jiwa |
| Jumlah KK | ~50-60 |
| Harga langganan | Rp 150.000/bulan |
| Sumber dana | Kas RT (pos administrasi) |

### 3.2 Market Selanjutnya (Setelah Pilot)

| Level | Target | Estimasi |
|-------|--------|----------|
| RT Satu RW | RT tetangga di RW yang sama | 5-10 RT |
| Antar-RW | RW lain di kelurahan | 10-30 RT |
| Antar-Kelurahan | Kelurahan sekitar | 30-100 RT |

### 3.3 Market Size (Konteks)

- Indonesia: ~82.000 kelurahan/desa
- Rata-rata 5-10 RT per RW, 5-10 RW per kelurahan
- Estimasi konservatif: 400.000+ RT di Indonesia
- Penetrasi 0.01% = 40 RT = Rp 6 juta/bulan recurring

---

## 4. Model Bisnis

### 4.1 Revenue: Langganan Bulanan (Flat)

| Paket | Harga/Bulan | Target |
|-------|-------------|--------|
| Semua fitur, semua ukuran RT | Rp 150.000 | Semua RT |

Satu harga, tidak ada tier. Simple untuk closing.

### 4.2 Revenue Tambahan (Opsional, Nanti)

| Item | Harga | Kapan |
|------|-------|-------|
| Setup & input data awal | Rp 500.000 (one-time) | Jika diminta |
| Training pengurus RT | Rp 200.000/sesi | Jika diminta |
| Custom branding (logo RT di dashboard) | Rp 50.000/bln | Fase 3+ |
| WhatsApp blast integration | Rp 100.000/bln | Fase 3+ |
| Laporan tahunan PDF | Rp 200.000/tahun | Fase 2+ |

### 4.3 Positioning

Ini **bukan** sumber pendapatan utama. Ini adalah:
1. **Portfolio** — bukti skill full-stack development
2. **Side income** — passive income dari langganan
3. **Fondasi** — codebase & skill untuk project IT lain yang lebih besar

---

## 5. Infrastruktur & Biaya

### 5.1 Biaya Operasional

| Komponen | Provider | Biaya/Bulan |
|----------|----------|-------------|
| VPS Server | IDCloudHost Basic Standard (2 Core, 2GB RAM, 20GB NVMe) | Rp 87.000 |
| Domain | `rukunin.my.id` | ~Rp 1.250 (Rp 15.000/tahun) |
| SSL | Let's Encrypt (gratis) | Rp 0 |
| Monitoring | UptimeRobot free | Rp 0 |
| Email (nanti) | Resend free tier | Rp 0 |
| GitHub | Free private repo | Rp 0 |
| **Total Operasional** | | **~Rp 88.250/bulan** |

### 5.2 Biaya Awal (One-Time)

| Item | Biaya |
|------|-------|
| Domain `rukunin.my.id` (1 tahun) | ~Rp 15.000 |
| VPS bulan pertama | Rp 87.000 |
| **Total modal awal** | **~Rp 102.000** |

### 5.3 Unit Economics

| Metric | Value |
|--------|-------|
| Revenue per RT | Rp 150.000/bulan |
| Cost per RT (1 RT) | Rp 88.250/bulan |
| **Margin (1 RT)** | **Rp 61.750/bulan (41%)** |
| Cost per RT (3 RT) | Rp 29.417/bulan (shared) |
| **Margin (3 RT)** | **Rp 120.583/RT/bulan (80%)** |
| Cost per RT (10 RT) | Rp 8.825/bulan (shared) |
| **Margin (10 RT)** | **Rp 141.175/RT/bulan (94%)** |

VPS cost fixed — setiap RT tambahan = hampir 100% profit.

---

## 6. Timeline & Milestone

### FASE 0: Finalisasi Produk (April 2026 — Minggu 1-2)

| Minggu | Task | Status |
|--------|------|--------|
| W1 | Selesaikan Dashboard Admin dinamis (data real dari API) | Belum |
| W1 | Selesaikan Portal Warga banner profil | Belum |
| W2 | Testing manual seluruh flow (admin + warga) | Belum |
| W2 | Fix bug yang ditemukan saat testing | Belum |

**Deliverable**: Produk siap demo tanpa bug kritis.

---

### FASE 1: Deployment & Pilot RT 4 (Mei 2026 — Minggu 3-6)

| Minggu | Task | Detail |
|--------|------|--------|
| W3 | Beli domain `rukunin.my.id` | Registrar lokal |
| W3 | Beli & setup VPS IDCloudHost | Ubuntu 24.04, Nginx, Node.js, PM2, PostgreSQL |
| W3 | Deploy backend (NestJS) + database | Production env, migration, seed admin |
| W3 | Deploy frontend (Next.js) | Nginx reverse proxy, SSL |
| W4 | Testing production environment | Semua flow di server production |
| W4 | Buat akun admin untuk RT 4 | Koordinasi dengan Ketua RT 4 |
| W5 | Input data awal | Data warga, KK, dari data RT existing |
| W5 | Training pengurus RT 4 | Demo dashboard admin, cara input data |
| W6 | Sosialisasi ke warga RT 4 | Share link portal, cara register/login |

**Deliverable**: Rukunin live di RT 4, pengurus bisa pakai, warga mulai register.

**KPI Fase 1**:
- [ ] Sistem online & accessible 24/7
- [ ] Pengurus RT bisa input/edit data warga
- [ ] Minimal 20% warga register di portal
- [ ] Iuran bulan pertama di-generate via sistem

---

### FASE 2: Stabilisasi & Feedback (Juni-Juli 2026 — Minggu 7-14)

| Minggu | Task | Detail |
|--------|------|--------|
| W7-8 | Monitor penggunaan, fix bugs | Berdasarkan feedback pengurus & warga |
| W9-10 | Tambah fitur berdasarkan feedback | Quick wins dari user request |
| W11-12 | Setup database backup otomatis | Cron job pg_dump harian |
| W13-14 | Kumpulkan testimoni & screenshot | Dari Ketua RT 4, bendahara |

**Deliverable**: Sistem stabil, bug minimal, testimoni didapat.

**KPI Fase 2**:
- [ ] Uptime >99% selama 2 bulan
- [ ] Minimal 50% warga aktif di portal
- [ ] Iuran 2 bulan berturut di-generate & dilacak via sistem
- [ ] 1 testimoni tertulis dari pengurus RT 4
- [ ] Zero data loss / security incident

---

### FASE 3: Ekspansi & Portfolio (Agustus-Oktober 2026 — Minggu 15-26)

| Minggu | Task | Detail |
|--------|------|--------|
| W15-16 | Buat landing page di `rukunin.my.id` | Showcase fitur, testimoni, pricing, kontak |
| W17-18 | Approach 1-2 RT tetangga | Via referral Ketua RT 4 / rapat RW |
| W19-20 | Onboard RT baru (jika ada) | Setup akun, input data, training |
| W21-22 | Update portfolio online | LinkedIn, CV, freelance profile |
| W23-26 | Cari project IT berikutnya | Pakai Rukunin sebagai bukti kapabilitas |

**Deliverable**: Portfolio live, 1-3 RT aktif, side income berjalan.

**KPI Fase 3**:
- [ ] Landing page live di `rukunin.my.id`
- [ ] Rukunin di-link di LinkedIn/portfolio
- [ ] 1-2 RT tambahan ter-onboard (nice to have)
- [ ] Identifikasi project IT berikutnya

---

### FASE 4: Passive Mode (November 2026+)

| Task | Detail |
|------|--------|
| Maintenance rutin | Update dependencies, backup, monitoring |
| Respond feedback | Fix bugs, minor improvements |
| Terima RT baru (jika ada) | Organic growth dari word-of-mouth |
| Fokus project lain | Rukunin berjalan autopilot |

**Time commitment**: ~2-4 jam/minggu untuk maintenance.

---

## 7. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| RT 4 berhenti langganan | Revenue = 0, infra rugi | Tunjukkan value terus, kunci di kontrak 6 bulan |
| VPS down | Warga tidak bisa akses | UptimeRobot alert, backup plan restart |
| Data hilang | Kehilangan semua data RT | Daily backup pg_dump, simpan di cloud gratis |
| Hacked / security breach | Reputasi rusak | JWT best practices, firewall, update rutin |
| Warga tidak mau pakai portal | Fitur portal terbuang | Fokus admin tools dulu, portal sebagai bonus |
| Tidak dapat RT baru | Stuck di 1 RT, income minim | Tidak masalah — ini side income, bukan main income |

---

## 8. Financial Projection (12 Bulan)

### Skenario Konservatif (1 RT saja)

| Bulan | RT Aktif | Revenue | Biaya | Net |
|-------|----------|---------|-------|-----|
| 1 (Mei) | 0 | Rp 0 | Rp 88.250 | -Rp 88.250 |
| 2 (Jun) | 1 | Rp 150.000 | Rp 88.250 | +Rp 61.750 |
| 3-12 | 1 | Rp 150.000 | Rp 88.250 | +Rp 61.750 |
| **Total Tahun 1** | | **Rp 1.650.000** | **Rp 1.059.000** | **+Rp 591.000** |

### Skenario Moderat (3 RT di bulan 6)

| Bulan | RT Aktif | Revenue | Biaya | Net |
|-------|----------|---------|-------|-----|
| 1 (Mei) | 0 | Rp 0 | Rp 88.250 | -Rp 88.250 |
| 2-4 | 1 | Rp 150.000 | Rp 88.250 | +Rp 61.750 |
| 5-8 | 2 | Rp 300.000 | Rp 88.250 | +Rp 211.750 |
| 9-12 | 3 | Rp 450.000 | Rp 88.250 | +Rp 361.750 |
| **Total Tahun 1** | | **Rp 3.150.000** | **Rp 1.059.000** | **+Rp 2.091.000** |

### Skenario Optimis (5 RT di bulan 9)

| Bulan | RT Aktif | Revenue | Biaya | Net |
|-------|----------|---------|-------|-----|
| 1 (Mei) | 0 | Rp 0 | Rp 88.250 | -Rp 88.250 |
| 2-3 | 1 | Rp 150.000 | Rp 88.250 | +Rp 61.750 |
| 4-6 | 2 | Rp 300.000 | Rp 88.250 | +Rp 211.750 |
| 7-9 | 4 | Rp 600.000 | Rp 88.250 | +Rp 511.750 |
| 10-12 | 5 | Rp 750.000 | Rp 88.250 | +Rp 661.750 |
| **Total Tahun 1** | | **Rp 4.800.000** | **Rp 1.059.000** | **+Rp 3.741.000** |

---

## 9. Success Metrics

### Produk
- Uptime >99%
- Zero data loss
- Response time <2 detik

### Bisnis (Tahun 1)
- Minimal 1 RT aktif (RT 4)
- Break-even di bulan 2
- Portfolio live & di-showcase

### Bonus (Nice-to-Have)
- 3+ RT aktif
- Side income >Rp 300.000/bulan
- Referral organik dari pengurus RT

---

## 10. Exit Strategy

| Skenario | Action |
|----------|--------|
| Berjalan baik, growing | Terus jalankan, tambah RT organik |
| Flat di 1-2 RT | Autopilot, fokus project lain — tetap jadi portfolio |
| Tidak ada user | Matikan VPS, hemat biaya — kode tetap jadi portfolio di GitHub |
| Ada yang mau beli/akuisisi | Jual codebase + customer base (harga nego) |

---

*Dokumen ini akan di-update sesuai perkembangan.*
