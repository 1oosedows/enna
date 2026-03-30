import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://www.en-na.com";
const title = "ENNA — OSINT & Recon Tool Index";
const description =
  "Discover, compare, and deploy open-source OSINT and reconnaissance tools. Curated directory with live GitHub stats for 176+ tools.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — ENNA",
  },
  description,
  keywords: [
    "OSINT",
    "recon",
    "reconnaissance",
    "penetration testing",
    "security tools",
    "open source",
    "crypto tracing",
    "blockchain forensics",
    "network scanning",
    "vulnerability assessment",
  ],
  authors: [{ name: "ENNA", url: siteUrl }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ENNA",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-base text-text-primary font-sans antialiased">
        <div className="noise-overlay" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
