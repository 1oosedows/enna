"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";
import { categories } from "@/data/categories";

type PackageManager = "apt" | "brew" | "go" | "pip" | "docker";

export default function InstallPage() {
  const tools = toolsData as Tool[];
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [pm, setPm] = useState<PackageManager>("brew");

  const installableTools = useMemo(() => {
    return tools.filter(
      (t) => t.installCommand || (t.installCommands && Object.keys(t.installCommands).length > 0)
    );
  }, [tools]);

  const filtered = useMemo(() => {
    let result = installableTools;
    if (filterCat) result = result.filter((t) => t.category === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [installableTools, filterCat, search]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(filtered.map((t) => t.slug)));
  };

  const clearAll = () => setSelected(new Set());

  const script = useMemo(() => {
    const lines: string[] = ["#!/bin/bash", `# ENNA Install Script — ${selected.size} tools`, `# Generated from https://www.en-na.com/install`, ""];

    const selectedTools = tools.filter((t) => selected.has(t.slug));

    for (const tool of selectedTools) {
      const cmds = tool.installCommands || {};
      const singleCmd = tool.installCommand || "";

      let cmd = "";
      if (pm === "brew" && cmds["brew"]) cmd = cmds["brew"];
      else if (pm === "apt" && cmds["apt"]) cmd = cmds["apt"];
      else if (pm === "go" && cmds["go install"]) cmd = cmds["go install"];
      else if (pm === "pip" && (cmds["pip"] || cmds["pipx"])) cmd = cmds["pip"] || cmds["pipx"];
      else if (pm === "docker" && cmds["docker"]) cmd = cmds["docker"];
      else if (singleCmd) cmd = singleCmd;
      else {
        // Try to find any matching key
        const key = Object.keys(cmds).find((k) =>
          k.toLowerCase().includes(pm)
        );
        if (key) cmd = cmds[key];
      }

      if (cmd) {
        lines.push(`# ${tool.name}`);
        lines.push(cmd);
        lines.push("");
      } else {
        lines.push(`# ${tool.name} — no ${pm} install command available`);
        if (tool.github) lines.push(`# See: https://github.com/${tool.github}`);
        lines.push("");
      }
    }

    return lines.join("\n");
  }, [selected, tools, pm]);

  return (
    <>
      <title>Install Script Generator - ENNA</title>
      <meta
        name="description"
        content="Select OSINT and security tools and generate a single install script for your platform."
      />
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Setup Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Install Script Generator</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Select the tools you need, pick your package manager, and get a
            single script to install them all.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: tool picker */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter tools..."
                className="input-field flex-1"
              />
              <select
                value={filterCat || ""}
                onChange={(e) => setFilterCat(e.target.value || null)}
                className="input-field w-auto"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-muted">
                {selected.size} selected of {filtered.length} installable tools
              </span>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs font-mono text-brand-400 hover:text-brand-300"
                >
                  Select all
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs font-mono text-text-muted hover:text-text-secondary"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="glass rounded-xl max-h-[60vh] overflow-y-auto">
              {filtered.map((tool) => (
                <label
                  key={tool.slug}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary transition-colors cursor-pointer border-b border-border last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(tool.slug)}
                    onChange={() => toggle(tool.slug)}
                    className="rounded border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-mono text-text-primary">
                      {tool.name}
                    </span>
                    <span className="text-xs font-mono text-text-muted ml-2">
                      {tool.language}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    {tool.installCommands
                      ? Object.keys(tool.installCommands).join(", ")
                      : "single"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Right: script output */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono text-text-muted">
                Package manager
              </span>
              {(["brew", "apt", "pip", "go", "docker"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPm(opt)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    pm === opt
                      ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="glass rounded-xl relative">
              <div className="absolute top-3 right-3">
                <CopyButton text={script} />
              </div>
              <pre className="p-6 text-sm font-mono text-text-secondary overflow-x-auto max-h-[60vh] overflow-y-auto whitespace-pre-wrap">
                {selected.size === 0
                  ? "# Select tools from the left to generate a script"
                  : script}
              </pre>
            </div>

            {selected.size > 0 && (
              <p className="text-xs font-mono text-text-muted mt-3">
                {selected.size} tools selected. Copy the script or save as{" "}
                <code className="text-brand-400">install.sh</code> and run with{" "}
                <code className="text-brand-400">bash install.sh</code>
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
