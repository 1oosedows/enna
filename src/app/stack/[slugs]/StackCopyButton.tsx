"use client";

import { useState } from "react";

export default function StackCopyButton() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="px-4 py-2 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-mono hover:bg-brand-500/20 transition-colors"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
