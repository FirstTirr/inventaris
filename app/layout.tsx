import type { Metadata, Viewport } from "next"; // Tambahkan Viewport di sini
import { Roboto } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: true,
});

const montserrat = Roboto({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Inventaris Labor - Management System",
  description:
    "Sistem Web Manajemen Fasilitas dan Inventaris Labor yang Modern dan Efisien",
  keywords: ["inventaris", "labor", "management", "fasilitas", "sekolah"],
  authors: [{ name: "Inventaris Team" }],
  // ❌ viewport: "width=device-width, initial-scale=1", (SUDAH DIHAPUS DARI SINI)
  robots: "index, follow",
  openGraph: {
    title: "Inventaris Labor",
    description: "Sistem Web Manajemen Fasilitas dan Inventaris Labor",
    type: "website",
  },
  manifest: "/manifest.json",
};

// ✅ INI KODE BARUNYA: Pisahkan viewport dan themeColor ke export sendiri
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#377DFF",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${roboto.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* meta theme-color sudah dipindah ke export viewport di atas agar lebih rapi */}
        <meta name="msapplication-TileColor" content="#377DFF" />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}