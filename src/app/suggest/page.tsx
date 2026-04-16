"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";

// metadata can't be exported from client components, so we set the title via head
// The page title comes from the root layout template: "%s - ENNA"

export default function SuggestToolPage() {
  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const issueUrl = `https://github.com/1oosedows/enna/issues/new?${new URLSearchParams({
    template: "add-tool.md",
    title: `[Tool Suggestion] ${name || "New Tool"}`,
    body: [
      `**Tool Name:** ${name}`,
      github ? `**GitHub:** https://github.com/${github}` : "",
      category ? `**Category:** ${category}` : "",
      description ? `\n**Why add this tool:**\n${description}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }).toString()}`;

  return (
    <>
      <title>Suggest a Tool - ENNA</title>
      <meta name="description" content="Suggest an OSINT or security tool to be added to the ENNA index." />
      <Header />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Community
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Suggest a Tool</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Know an OSINT or security tool that should be listed? Fill in what
            you know and we&apos;ll open a GitHub issue.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Tool Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amass"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              GitHub Repository
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-text-muted">github.com/</span>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="owner/repo"
                className="input-field flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
              Why should we add this?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this tool useful? What does it do that alternatives don't?"
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <a
            href={name.trim() ? issueUrl : "#"}
            target={name.trim() ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`block w-full px-6 py-3 rounded-lg brand-gradient text-white font-mono text-sm font-medium text-center transition-opacity ${
              name.trim() ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (!name.trim()) e.preventDefault();
            }}
          >
            Open GitHub Issue
          </a>

          <p className="text-xs text-text-muted font-mono text-center">
            This opens a pre-filled issue on GitHub. You&apos;ll need a GitHub account.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
