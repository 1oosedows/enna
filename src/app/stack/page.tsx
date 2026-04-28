import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StackBuilder from "./StackBuilder";

export const metadata: Metadata = {
  title: "Build Stack | ENNA",
  description: "Build a custom security tool stack and share it with your team.",
};

export default function StackPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-mono font-bold">
              <span className="brand-gradient-text">Build Your Stack</span>
            </h1>
            <p className="text-text-secondary mt-2 max-w-2xl">
              Select tools to build a shareable security stack. Share the generated URL with your team or bookmark it for later.
            </p>
          </div>
          <Suspense fallback={<div className="text-text-muted font-mono text-sm">Loading builder...</div>}>
            <StackBuilder />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
