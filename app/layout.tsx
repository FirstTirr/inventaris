import type { Metadata } from "next";
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
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Inventaris Labor",
    description: "Sistem Web Manajemen Fasilitas dan Inventaris Labor",
    type: "website",
  },
  manifest: "/manifest.json",
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
        <meta name="theme-color" content="#377DFF" />
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
