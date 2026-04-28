import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ToolGrid from "@/components/ToolGrid";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import RecentlyUpdated from "@/components/RecentlyUpdated";
import ErrorBoundary from "@/components/ErrorBoundary";
import ActivityFeed from "@/components/ActivityFeed";
import { categories } from "@/data/categories";
import { enrichTools } from "@/lib/github";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

export default async function Home() {
  const tools = await enrichTools(toolsData as Tool[]);

  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "OSINT & Recon Tools",
    description: `Curated directory of ${tools.length}+ open-source OSINT and reconnaissance tools across ${categories.length} categories.`,
    url: "https://www.en-na.com",
    numberOfItems: tools.length,
    itemListElement: tools
      .filter((t) => t.featured)
      .map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.en-na.com/tool/${tool.slug}`,
        name: tool.name,
      })),
  };

  const recentTools = tools
    .filter((t) => t.lastCommit)
    .sort((a, b) => new Date(b.lastCommit!).getTime() - new Date(a.lastCommit!).getTime())
    .slice(0, 8);

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <main>
        <HeroSection
          toolCount={tools.length}
          categoryCount={categories.length}
          languageCount={new Set(tools.map((t) => t.language)).size}
          toolSlugs={tools.map((t) => t.slug)}
        />
        <AdSlot provider="custom" placement="hero" />
        {recentTools.length > 0 && <RecentlyUpdated tools={recentTools} />}
        <ActivityFeed />
        <ErrorBoundary>
          <Suspense>
            <ToolGrid tools={tools} categories={categories} />
          </Suspense>
        </ErrorBoundary>
        <AdSlot provider="custom" placement="footer" />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
