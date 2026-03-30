import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ToolGrid from "@/components/ToolGrid";
import AdSlot from "@/components/AdSlot";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";
import { enrichTools } from "@/lib/github";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

export default async function Home() {
  const tools = await enrichTools(toolsData as Tool[]);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AdSlot provider="custom" placement="hero" />
        <ToolGrid tools={tools} categories={categories} />
        <AdSlot provider="custom" placement="footer" />
      </main>
      <Footer />
    </>
  );
}
