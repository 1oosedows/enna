"use client";

import { useEffect, useRef } from "react";

type AdProvider = "adsense" | "carbon" | "ethicalads" | "custom";

interface Props {
  provider?: AdProvider;
  placement?: "hero" | "sidebar" | "inline" | "footer";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdSlot({
  provider = "adsense",
  placement = "inline",
  className = "",
}: Props) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    if (provider === "adsense") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded yet or ad blocker active
      }
    }

    if (provider === "carbon") {
      const script = document.createElement("script");
      script.src =
        "//cdn.carbonads.com/carbon.js?serve=PLACEMENT_ID&placement=en-nacom";
      script.id = "_carbonads_js";
      script.async = true;
      adRef.current.appendChild(script);
    }

    if (provider === "ethicalads") {
      const script = document.createElement("script");
      script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
      script.async = true;
      adRef.current.appendChild(script);
    }
  }, [provider]);

  const placementStyles: Record<string, string> = {
    hero: "max-w-md mx-auto mt-12",
    sidebar: "w-full",
    inline: "max-w-2xl mx-auto my-8",
    footer: "max-w-lg mx-auto mt-8 mb-4",
  };

  // Fluid ad (hero, footer, inline)
  const isFluid = placement === "hero" || placement === "footer" || placement === "inline";

  return (
    <div
      ref={adRef}
      className={`${placementStyles[placement]} ${className}`}
    >
      {provider === "adsense" && isFluid && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-fn-2n+ez-8x-u9"
          data-ad-client="ca-pub-9655416932369069"
          data-ad-slot="1359808615"
        />
      )}
      {provider === "adsense" && !isFluid && (
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: 300, height: 800 }}
          data-ad-client="ca-pub-9655416932369069"
          data-ad-slot="5698074107"
        />
      )}
      {provider === "carbon" && (
        <div id="carbonads" />
      )}
      {provider === "ethicalads" && (
        <div
          className="loaded"
          data-ea-publisher="PUBLISHER_ID"
          data-ea-type="image"
        />
      )}
      {provider === "custom" && (
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
            Sponsored
          </p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block"
          >
            <div className="bg-surface-secondary rounded-lg p-6 border border-border hover:border-brand-500/30 transition-colors">
              <p className="text-sm font-mono text-text-primary mb-1">
                Your ad here
              </p>
              <p className="text-xs text-text-muted">
                Reach security professionals and developers - ads@en-na.com
              </p>
            </div>
          </a>
        </div>
      )}

      <style jsx global>{`
        .adsbygoogle {
          background: transparent !important;
        }

        #carbonads {
          font-family: "JetBrains Mono", monospace;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(28, 32, 48, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(42, 47, 62, 0.5);
          border-radius: 12px;
          max-width: 330px;
          margin: 0 auto;
        }

        #carbonads a {
          color: #e8eaed;
          text-decoration: none;
        }

        #carbonads a:hover {
          color: #f25c6e;
        }

        #carbonads .carbon-img img {
          border-radius: 8px;
          width: 130px;
          height: auto;
        }

        #carbonads .carbon-text {
          font-size: 12px;
          line-height: 1.5;
          color: #9ca3af;
        }

        #carbonads .carbon-poweredby {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 8px;
          display: block;
        }

        .ea-content {
          font-family: "JetBrains Mono", monospace !important;
          background: rgba(28, 32, 48, 0.6) !important;
          border: 1px solid rgba(42, 47, 62, 0.5) !important;
          border-radius: 12px !important;
          padding: 16px !important;
        }

        .ea-callout a {
          color: #9ca3af !important;
          font-size: 12px !important;
        }

        .ea-callout a:hover {
          color: #f25c6e !important;
        }
      `}</style>
    </div>
  );
}
