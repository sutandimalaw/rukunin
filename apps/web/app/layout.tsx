import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/provider/auth-provider";
import Providers from "./providers"
import { LayoutShell } from "@/components/layout-shell";

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
      <body className="antialiased">
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
