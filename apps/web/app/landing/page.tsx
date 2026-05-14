import Link from "next/link";
import {
  Users,
  Wallet,
  Receipt,
  Megaphone,
  CalendarHeart,
  ClipboardList,
  LayoutDashboard,
  Smartphone,
  Shield,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Package,
  UserCog,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Users,
    title: "Data Kependudukan",
    desc: "Kelola data warga & Kartu Keluarga. Pencarian cepat, statistik otomatis.",
  },
  {
    icon: Wallet,
    title: "Keuangan RT",
    desc: "Catat pemasukan & pengeluaran. Running balance, laporan per periode.",
  },
  {
    icon: Receipt,
    title: "Iuran Warga",
    desc: "Generate tagihan otomatis, bayar satuan atau batch. Lacak yang nunggak.",
  },
  {
    icon: Megaphone,
    title: "Pengumuman",
    desc: "Buat & bagikan info penting ke seluruh warga. Kategori & status publish.",
  },
  {
    icon: CalendarHeart,
    title: "Kegiatan Warga",
    desc: "Voting kegiatan, RSVP, jadwalkan & kelola sampai selesai.",
  },
  {
    icon: ClipboardList,
    title: "Layanan Warga",
    desc: "Surat keterangan, laporan kerusakan, komplain — semua bisa dilacak statusnya.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Admin",
    desc: "Ringkasan lengkap: jumlah warga, saldo kas, iuran bulan ini, semua real-time.",
  },
  {
    icon: Smartphone,
    title: "Portal Warga",
    desc: "Warga cek tagihan, baca pengumuman, ikut kegiatan — langsung dari HP.",
  },
  {
    icon: BarChart3,
    title: "Laporan",
    desc: "Laporan keuangan & kependudukan otomatis. Filter tanggal, langsung tampil.",
  },
  {
    icon: UserCog,
    title: "Kelola Pengguna",
    desc: "Warga daftar online, admin approve. Kontrol siapa yang bisa akses.",
  },
  {
    icon: Package,
    title: "Inventaris RT",
    desc: "Tracking aset & inventaris milik RT. Sistem peminjaman terintegrasi.",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    desc: "Login JWT, role-based access, data terenkripsi. Hanya yang berhak bisa akses.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Hubungi Kami",
    desc: "Konsultasi gratis via WhatsApp. Kami jelaskan fitur & cara kerjanya.",
  },
  {
    num: "02",
    title: "Setup & Input Data",
    desc: "Kami bantu setup sistem dan input data warga awal dari data RT yang sudah ada.",
  },
  {
    num: "03",
    title: "Training Pengurus",
    desc: "Demo langsung cara pakai dashboard admin. Cuma butuh 30 menit.",
  },
  {
    num: "04",
    title: "Go Live!",
    desc: "Sistem aktif, warga bisa akses portal. Sosialisasi via grup WA RT.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-emerald-200">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 z-50 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/landing" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-extrabold text-white">
              R
            </div>
            <span className="text-lg font-bold tracking-tight">Rukunin</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
            <a href="#fitur" className="transition hover:text-neutral-900">
              Fitur
            </a>
            <a href="#cara-kerja" className="transition hover:text-neutral-900">
              Cara Kerja
            </a>
            <a href="#harga" className="transition hover:text-neutral-900">
              Harga
            </a>
            <a href="#kontak" className="transition hover:text-neutral-900">
              Kontak
            </a>
          </div>

          <Link
            href="/auth/login"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Masuk
          </Link>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden pt-16">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-20 pt-24 md:pb-28 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              Sistem RT Digital #1
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-neutral-900 md:text-6xl">
              Kelola RT Anda
              <br />
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                 Nyaman, Aman & Transparan
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-500 md:text-xl">
              Data warga, keuangan, iuran, pengumuman & kegiatan — semua dalam
              satu platform. Warga bisa akses langsung dari HP.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#kontak"
                className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 hover:shadow-emerald-600/30"
              >
                Coba Gratis 1 Bulan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#fitur"
                className="flex items-center gap-2 rounded-xl border border-neutral-300 px-7 py-3.5 text-base font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                Lihat Fitur
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-14 flex flex-col items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "bg-emerald-500",
                  "bg-blue-500",
                  "bg-amber-500",
                  "bg-rose-500",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} text-xs font-bold text-white ring-2 ring-white`}
                  >
                    {["RT", "04", "W", "A"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-500">
                Dipercaya oleh pengurus RT untuk mengelola{" "}
                <span className="font-semibold text-neutral-700">
                  200+ warga
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="fitur" className="border-t border-neutral-100 bg-neutral-50/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Fitur Lengkap
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Semua yang Dibutuhkan RT, Ada di Sini
            </h2>
            <p className="mt-4 text-neutral-500">
              16 modul terintegrasi untuk administrasi RT yang modern dan
              efisien.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="cara-kerja" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Cara Kerja
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              4 Langkah Mudah untuk Mulai
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num} className="relative">
                <div className="text-5xl font-black text-emerald-100">
                  {s.num}
                </div>
                <h3 className="-mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="harga" className="border-t border-neutral-100 bg-neutral-50/50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Harga
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Pilih Paket Sesuai Kebutuhan RT Anda
            </h2>
            <p className="mt-4 text-neutral-500">
              Semua paket termasuk hosting, maintenance & support. Bayar dari kas RT.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
            {/* PAKET STARTER */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                Starter
              </p>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-black tracking-tight">Rp 150</span>
                <span className="mb-0.5 text-xl font-bold text-neutral-400">rb</span>
                <span className="mb-1 text-sm text-neutral-400">/bulan</span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Untuk RT kecil ≤ 50 KK
              </p>

              <div className="my-6 h-px bg-neutral-100" />

              <ul className="flex-1 space-y-3">
                {[
                  "10 modul inti",
                  "Maks 50 Kepala Keluarga",
                  "Portal warga self-service",
                  "Dashboard admin",
                  "Hosting & SSL included",
                  "Support via WhatsApp",
                  "Backup data harian",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#kontak"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                Hubungi Kami
              </a>
            </div>

            {/* PAKET PROFESIONAL — POPULAR */}
            <div className="relative flex flex-col rounded-2xl border-2 border-emerald-600 bg-white p-7 shadow-xl shadow-emerald-100/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white">
                Paling Populer
              </div>

              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                Profesional
              </p>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-black tracking-tight">Rp 250</span>
                <span className="mb-0.5 text-xl font-bold text-neutral-400">rb</span>
                <span className="mb-1 text-sm text-neutral-400">/bulan</span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Untuk RT sedang 51-100 KK
              </p>

              <div className="my-6 h-px bg-neutral-100" />

              <ul className="flex-1 space-y-3">
                {[
                  "Semua 16 modul aktif",
                  "Maks 100 Kepala Keluarga",
                  "Portal warga self-service",
                  "Dashboard admin real-time",
                  "Laporan keuangan & kependudukan",
                  "Hosting & SSL included",
                  "Support prioritas WhatsApp",
                  "Backup data harian",
                  "Update fitur gratis",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#kontak"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Mulai Sekarang
                <ChevronRight className="h-4 w-4" />
              </a>

              <p className="mt-3 text-center text-xs text-neutral-400">
                Gratis 1 bulan pertama
              </p>
            </div>

            {/* PAKET PREMIUM */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">
                Premium
              </p>
              <div className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-black tracking-tight">Rp 350</span>
                <span className="mb-0.5 text-xl font-bold text-neutral-400">rb</span>
                <span className="mb-1 text-sm text-neutral-400">/bulan</span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Untuk RT besar &gt; 100 KK
              </p>

              <div className="my-6 h-px bg-neutral-100" />

              <ul className="flex-1 space-y-3">
                {[
                  "Semua 16 modul aktif",
                  "Unlimited Kepala Keluarga",
                  "Portal warga self-service",
                  "Dashboard admin real-time",
                  "Laporan keuangan & kependudukan",
                  "Hosting & SSL included",
                  "Support prioritas WhatsApp",
                  "Backup data harian",
                  "Update fitur gratis",
                  "Custom branding logo RT",
                  "Bantuan input data awal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#kontak"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-300 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                Hubungi Kami
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-neutral-400">
            Semua paket: gratis 1 bulan pertama. Bisa cancel kapan saja. Bayar via transfer bank.
          </p>
        </div>
      </section>

      {/* ========== COMPARISON ========== */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Sebelum vs Sesudah Rukunin
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Before */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                Sebelum
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Catat iuran di buku tulis",
                  "Warga harus tanya langsung ke RT",
                  "Laporan keuangan ribet bikin manual",
                  "Pengumuman hanya via grup WA",
                  "Data warga tercecer di kertas",
                  "Tidak tahu siapa yang nunggak",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-neutral-600"
                  >
                    <span className="mt-1 text-red-400">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                Sesudah
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Iuran otomatis di-generate & dilacak",
                  "Warga cek tagihan sendiri dari HP",
                  "Laporan keuangan otomatis real-time",
                  "Pengumuman di portal + kategori",
                  "Data warga tersimpan rapi & searchable",
                  "Dashboard tahu persis siapa yang nunggak",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-neutral-800"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA / KONTAK ========== */}
      <section id="kontak" className="border-t border-neutral-100 bg-neutral-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Siap Digitalisasi RT Anda?
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Gratis 1 bulan pertama. Hubungi kami untuk demo & setup.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20Rukunin%20untuk%20RT%20kami"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl bg-emerald-600 px-7 py-4 text-base font-semibold text-white transition hover:bg-emerald-500"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hubungi via WhatsApp
              </a>
              <Link
                href="/auth/login"
                className="rounded-xl border border-neutral-700 px-7 py-4 text-base font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white"
              >
                Login Dashboard
              </Link>
            </div>

            <div className="mt-14 grid gap-8 text-center sm:grid-cols-3">
              <div>
                <p className="text-3xl font-black text-emerald-400">16</p>
                <p className="mt-1 text-sm text-neutral-500">Modul Fitur</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">200+</p>
                <p className="mt-1 text-sm text-neutral-500">Warga Terlayani</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">24/7</p>
                <p className="mt-1 text-sm text-neutral-500">Akses Online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-neutral-800 bg-neutral-900 py-10 text-neutral-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[10px] font-extrabold text-white">
              R
            </div>
            <span className="font-semibold text-neutral-400">Rukunin</span>
          </div>
          <p>© 2026 Rukunin. Sistem Manajemen RT Digital.</p>
        </div>
      </footer>
    </div>
  );
}
