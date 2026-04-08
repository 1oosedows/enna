"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    // Store subscriber in localStorage for now
    // Replace with actual email service (Buttondown, ConvertKit, etc.) later
    try {
      const existing = JSON.parse(
        localStorage.getItem("enna-subscribers") || "[]"
      );
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem("enna-subscribers", JSON.stringify(existing));
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="glass rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="font-mono font-semibold text-lg text-text-primary mb-1">
            Weekly Newsletter
          </h3>
          <p className="text-sm text-text-secondary">
            New tools, updates, and changes delivered every Monday morning.
          </p>
        </div>

        {status === "success" ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm font-mono text-emerald-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Subscribed
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-field w-48 md:w-64"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-lg brand-gradient text-white text-sm font-mono font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {status === "error" && (
        <p className="text-xs font-mono text-red-400 mt-2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
