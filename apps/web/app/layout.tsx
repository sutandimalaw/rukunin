import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/provider/auth-provider";
import Providers from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <SidebarProvider>
            <AppSidebar />
            <Providers>
              {children}
            </Providers>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
