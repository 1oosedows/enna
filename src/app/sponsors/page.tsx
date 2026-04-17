import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sponsors - ENNA",
  description:
    "Support ENNA and get access to pre-configured Docker stacks, automation scripts, curated configs, and priority tool submissions.",
};

const tiers = [
  {
    name: "Supporter",
    price: "$3/mo",
    color: "border-text-muted/30",
    features: [
      "Name on the supporters page",
      "Sponsor badge on your GitHub profile",
    ],
  },
  {
    name: "Recon Operator",
    price: "$7/mo",
    color: "border-brand-500/30",
    features: [
      "Everything in Supporter",
      "Early access to new tools and features",
      "Sponsors-only Discord channel",
    ],
  },
  {
    name: "Red Team Backer",
    price: "$15/mo",
    highlight: true,
    color: "border-brand-500/60",
    features: [
      "Everything in Recon Operator",
      "Priority tool submissions (48hr turnaround)",
      "Your suggestions credited on tool pages",
    ],
  },
  {
    name: "Core Contributor",
    price: "$25/mo",
    color: "border-yellow-500/40",
    features: [
      "Everything in Red Team Backer",
      "Access to ENNA Arsenal (private repo)",
      "Avatar on the ENNA homepage",
      "Direct input on the feature roadmap",
      "Name in the project README",
    ],
  },
];

const arsenalHighlights = [
  {
    icon: "🐳",
    title: "6 Docker Stacks",
    description:
      "One command spins up a full toolkit. Bug Bounty, Red Team, OSINT, SOC Analyst, Crypto Investigator, Mobile Pentester.",
  },
  {
    icon: "⚡",
    title: "Automation Scripts",
    description:
      "Recon pipeline, AD attack chain, crypto tracing, and log hunting. Chained tools with real output.",
  },
  {
    icon: "⚙️",
    title: "Curated Configs",
    description:
      "Custom Nuclei templates, ffuf wordlists, Hashcat rules, and Sigma detection rules. Tuned for signal over noise.",
  },
  {
    icon: "📊",
    title: "Monthly Reports",
    description:
      "Trending tools, notable releases, new CVE tooling, and config updates. Delivered to the repo every month.",
  },
];

export default function SponsorsPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-mono text-text-secondary mb-6">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            Support Open Source
          </div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-4">
            <span className="brand-gradient-text">Sponsor ENNA</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            ENNA is free and open source. Sponsorship keeps it that way —
            funding weekly tool additions, server costs, and new features.
            Every tier gives you something back.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass rounded-xl p-6 flex flex-col border-2 ${tier.color} ${
                tier.highlight ? "ring-1 ring-brand-500/20" : ""
              }`}
            >
              {tier.highlight && (
                <span className="self-start px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider brand-gradient text-white mb-3">
                  Popular
                </span>
              )}
              <h3 className="font-mono font-semibold text-lg text-text-primary mb-1">
                {tier.name}
              </h3>
              <p className="text-2xl font-mono font-bold brand-gradient-text mb-4">
                {tier.price}
              </p>
              <ul className="space-y-2 flex-1 mb-6">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="text-brand-400 mt-0.5 flex-shrink-0">
                      +
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://github.com/sponsors/1oosedows"
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center px-4 py-2.5 rounded-lg text-sm font-mono font-medium transition-opacity hover:opacity-90 ${
                  tier.highlight
                    ? "brand-gradient text-white"
                    : "bg-surface-secondary border border-border text-text-secondary hover:text-brand-400 hover:border-brand-500/40"
                }`}
              >
                Sponsor
              </a>
            </div>
          ))}
        </div>

        {/* Arsenal teaser */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-mono font-bold tracking-tight mb-3">
              <span className="brand-gradient-text">ENNA Arsenal</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Exclusive to Core Contributors. Pre-configured environments,
              automation scripts, and curated configs that save you hours
              of setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arsenalHighlights.map((item) => (
              <div key={item.title} className="glass rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-mono font-semibold text-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="glass rounded-xl p-8 inline-block">
              <pre className="text-sm font-mono text-brand-400 text-left mb-4">
{`# One command. Fully loaded.
cd stacks/bug-bounty
docker compose up -d

# Full recon pipeline
./scripts/recon-pipeline.sh target.com`}
              </pre>
              <p className="text-xs font-mono text-text-muted">
                Available to Core Contributors ($25/mo)
              </p>
            </div>
          </div>
        </section>

        {/* Why sponsor */}
        <section className="mb-16">
          <div className="glass rounded-2xl p-8 md:p-10">
            <h2 className="font-mono font-semibold text-xl text-text-primary mb-6">
              Where your money goes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl mb-2">🔧</div>
                <h3 className="font-mono font-semibold text-sm text-text-primary mb-1">
                  Weekly maintenance
                </h3>
                <p className="text-sm text-text-secondary">
                  New tools added every week, GitHub stats refreshed,
                  broken links fixed, descriptions updated.
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🖥️</div>
                <h3 className="font-mono font-semibold text-sm text-text-primary mb-1">
                  Infrastructure
                </h3>
                <p className="text-sm text-text-secondary">
                  Vercel hosting, Neon database, domain, and API
                  costs. Keeps the site fast and the reviews system running.
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🆕</div>
                <h3 className="font-mono font-semibold text-sm text-text-primary mb-1">
                  New features
                </h3>
                <p className="text-sm text-text-secondary">
                  Cheat sheets, starter kits, tool chains, install
                  generator — all built with sponsor support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://github.com/sponsors/1oosedows"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl brand-gradient text-white font-mono font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Become a Sponsor
          </a>
          <p className="text-xs font-mono text-text-muted mt-4">
            via GitHub Sponsors — cancel anytime
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
