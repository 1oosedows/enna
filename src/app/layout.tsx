import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CustomAnalytics from "@/components/Analytics";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://www.en-na.com";
const title = "ENNA — OSINT & Recon Tool Index";
const description =
  "Discover, compare, and deploy open-source OSINT and reconnaissance tools. Curated directory with live GitHub stats for 250+ tools across 16 categories.";

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
    <html lang="en" className={`dark ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.remove("dark")}}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N6SRX25F');`,
          }}
        />
      </head>
      <body className="min-h-screen bg-surface-base text-text-primary font-sans antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6SRX25F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ENNA",
              url: siteUrl,
              description:
                "Curated directory of 250+ open-source OSINT and reconnaissance tools with live GitHub stats.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <CustomAnalytics />
        <div className="noise-overlay" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
