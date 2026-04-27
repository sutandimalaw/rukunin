import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/provider/auth-provider";
import Providers from "./providers"
import { LayoutShell } from "@/components/layout-shell";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rukunin — Sistem RT",
  description: "Sistem Manajemen RT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Providers>
            <LayoutShell>
              {children}
            </LayoutShell>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
