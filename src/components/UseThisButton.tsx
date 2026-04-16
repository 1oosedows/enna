"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

interface Props {
  toolSlug: string;
}

export default function UseThisButton({ toolSlug }: Props) {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [userUses, setUserUses] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/toolkit?tool=${toolSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setUserUses(data.userUses);
      })
      .catch(() => {});
  }, [toolSlug]);

  const handleClick = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/toolkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug }),
      });
      const data = await res.json();
      setUserUses(data.added);
      setCount((c) => c + (data.added ? 1 : -1));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all ${
        userUses
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-surface-secondary border border-border text-text-muted hover:border-emerald-500/30 hover:text-emerald-400"
      }`}
    >
      <span>{userUses ? "✓" : "+"}</span>
      <span>I use this</span>
      {count > 0 && (
        <span className="text-xs opacity-70">({count})</span>
      )}
    </button>
  );
}
