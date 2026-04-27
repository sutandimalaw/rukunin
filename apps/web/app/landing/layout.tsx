import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rukunin — Sistem Manajemen RT Digital",
  description:
    "Digitalisasi administrasi RT/RW. Kelola warga, keuangan, iuran, pengumuman & kegiatan komunitas dalam satu platform.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
