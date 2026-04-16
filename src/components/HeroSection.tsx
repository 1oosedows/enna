"use client";

import { useEffect, useRef } from "react";

interface HeroSectionProps {
  toolCount?: number;
  categoryCount?: number;
  languageCount?: number;
}

export default function HeroSection({
  toolCount = 300,
  categoryCount = 19,
  languageCount = 12,
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = 60;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };

    const init = () => {
      resize();
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const draw = () => {
      const glowRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-glow-rgb').trim();
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${glowRgb}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glowRgb}, 0.5)`;
        ctx.fill();

        // Move
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.offsetWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.offsetHeight) node.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated network graph background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, var(--surface-base) 70%)",
        }}
      />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Radar rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[200, 350, 500].map((size) => (
          <div
            key={size}
            className="radar-ring animate-pulse-slow"
            style={{
              width: size,
              height: size,
              left: `calc(50% - ${size / 2}px)`,
              top: `calc(50% - ${size / 2}px)`,
              animationDelay: `${size * 2}ms`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Open-Source Intelligence Tool Index
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold tracking-tighter mb-6">
          <span className="brand-gradient-text">ENNA</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-4 font-light leading-relaxed">
          Discover, compare, and deploy the best open-source OSINT and
          reconnaissance tools. Curated. Categorized. Live stats.
        </p>

        <p className="text-sm text-text-muted font-mono mb-10">
          en-na.com
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tools"
            className="px-8 py-3 rounded-lg brand-gradient text-white font-mono font-medium text-sm hover:opacity-90 transition-opacity animate-glow"
          >
            Browse Tools →
          </a>
          <a
            href="#categories"
            className="px-8 py-3 rounded-lg glass glass-hover text-text-secondary font-mono text-sm"
          >
            View Categories
          </a>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-8 mt-16 font-mono text-sm">
          {[
            { label: "Tools", value: `${toolCount}+` },
            { label: "Categories", value: String(categoryCount) },
            { label: "Languages", value: String(languageCount) },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold brand-gradient-text">
                {stat.value}
              </div>
              <div className="text-text-muted text-xs uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
