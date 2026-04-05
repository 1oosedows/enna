import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ToolGrid from "@/components/ToolGrid";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import RecentlyUpdated from "@/components/RecentlyUpdated";
import { categories } from "@/data/categories";
import { enrichTools } from "@/lib/github";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

export default async function Home() {
  const tools = await enrichTools(toolsData as Tool[]);

  const recentTools = tools
    .filter((t) => t.lastCommit)
    .sort((a, b) => new Date(b.lastCommit!).getTime() - new Date(a.lastCommit!).getTime())
    .slice(0, 8);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AdSlot provider="custom" placement="hero" />
        {recentTools.length > 0 && <RecentlyUpdated tools={recentTools} />}
        <Suspense>
          <ToolGrid tools={tools} categories={categories} />
        </Suspense>
        <AdSlot provider="custom" placement="footer" />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
