import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENNA — OSINT & Recon Tool Index",
  description:
    "Discover, compare, and deploy open-source OSINT and reconnaissance tools. Curated directory with live GitHub stats.",
  keywords: [
    "OSINT",
    "recon",
    "reconnaissance",
    "penetration testing",
    "security tools",
    "open source",
  ],
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
      </body>
    </html>
  );
}
