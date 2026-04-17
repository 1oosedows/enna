<p align="center">
  <a href="https://www.en-na.com"><img src="public/icon-512x512.png" width="120" alt="ENNA" /></a>
</p>

<h1 align="center">ENNA</h1>

<p align="center">
  <strong>Open-source OSINT & reconnaissance tool index</strong><br>
  Discover, compare, and deploy 325+ security tools with live GitHub stats.
</p>

<p align="center">
  <a href="https://www.en-na.com"><img src="https://img.shields.io/badge/website-en--na.com-e63950?style=flat-square&labelColor=0f1117" /></a>
  <img src="https://img.shields.io/badge/tools-325+-e63950?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/categories-19-a855a0?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/cheat%20sheets-10-8dcae8?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/starter%20kits-6-22c55e?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/github/last-commit/1oosedows/enna?style=flat-square&color=6b7280&labelColor=0f1117" />
  <img src="https://img.shields.io/github/license/1oosedows/enna?style=flat-square&color=6b7280&labelColor=0f1117" />
</p>

<p align="center">
  <a href="https://www.en-na.com">Live Site</a> ·
  <a href="https://www.en-na.com/suggest">Suggest a Tool</a> ·
  <a href="https://www.en-na.com/blog">Blog</a> ·
  <a href="https://www.en-na.com/feed.xml">RSS</a> ·
  <a href="#contributing">Contributing</a>
</p>

## What is ENNA

ENNA is a curated, searchable directory of 325+ open-source OSINT, reconnaissance, and security tools across 19 categories. Built for security professionals who are tired of scattered GitHub repos and outdated blog listicles.

**Every tool page includes:**
- Full description and use cases
- Multi-method install commands (apt, brew, cargo, docker, pip, go)
- Live GitHub stats (stars, forks, last commit, issues)
- Alternative tools and side-by-side comparisons
- Docker availability badges and video tutorial links
- Community reviews and ratings

**Beyond tools:**
- **[Cheat Sheets](https://www.en-na.com/cheatsheets)** — 10 quick-reference command cards (Nmap, Hashcat, SQLMap, ffuf, Nuclei, etc.)
- **[Starter Kits](https://www.en-na.com/kits)** — 6 curated collections (Bug Bounty, SOC Analyst, Red Team, OSINT, Crypto Investigator, Mobile Pentester)
- **[Tool Chains](https://www.en-na.com/chains)** — 12 copy-paste command pipelines for common workflows
- **[Workflows](https://www.en-na.com/workflows)** — 6 step-by-step playbooks linking tools in sequence
- **[Alternatives](https://www.en-na.com/alternatives)** — Open-source replacements for Maltego, Burp Suite, Cobalt Strike, Nessus, IDA Pro, and more
- **[Install Generator](https://www.en-na.com/install)** — Select tools and get a single bash install script
- **[Library](https://www.en-na.com/library)** — 45 curated security books
- **[Gear](https://www.en-na.com/gear)** — 15 hardware items (HackRF, Flipper Zero, Proxmark3, laptops)
- **[Changelog](https://www.en-na.com/changelog)** — Live stats and recent changes

## Categories

| Category | Tools | Examples |
|----------|-------|---------|
| Network Recon | 30+ | Nmap, Masscan, RustScan, Wireshark, Shodan |
| Subdomain Enumeration | 15+ | Subfinder, Amass, dnsx, PureDNS |
| Web Scanning | 25+ | ffuf, Feroxbuster, Nuclei, Katana, Burp Suite |
| OSINT (Social) | 10+ | Sherlock, Maigret, GHunt, Blackbird |
| OSINT (General) | 15+ | SpiderFoot, TruffleHog, Recon-ng, web-check |
| Vulnerability Scanning | 15+ | Nuclei, OpenVAS, SQLMap, Trivy, Lynis |
| Wireless | 12+ | Aircrack-ng, Bettercap, Kismet, Flipper Zero |
| Digital Forensics | 18+ | Volatility 3, Ghidra, YARA, Timesketch |
| Crypto Tracing | 25+ | GraphSense, TrueBlocks, Cryo, Slither |
| Password Attacks | 12+ | Hashcat, John, Hydra, Mimikatz, SecLists |
| Exploitation | 15+ | Metasploit, Sliver, BloodHound, LinPEAS |
| Phishing Analysis | 8+ | GoPhish, Evilginx2, Modlishka |
| Cloud Recon | 12+ | ScoutSuite, Prowler, CloudFox, Stratus Red Team |
| Mobile Security | 10+ | MobSF, Frida, MVT, APKLeaks |
| Dual Use | 15+ | CyberChef, Wireshark, PowerShell Empire |
| Offensive Ops | 20+ | Mythic, Havoc, CALDERA, ScareCrow |
| Threat Intelligence | 10+ | MISP, OpenCTI, Wazuh, IntelOwl |
| Container Security | 8+ | Falco, kube-hunter, CDK, Trivy |
| Reverse Engineering | 12+ | Ghidra, ImHex, pwndbg, Radare2, EMBA |

## Community Features

- **Sign in with GitHub** to leave reviews and ratings on tools
- **"I use this" button** — mark tools in your personal toolkit
- **Public profiles** at `/u/username` showing your toolkit and reviews
- **Leaderboard** ranking top community contributors
- **Activity feed** on the homepage showing recent reviews and toolkit updates
- **Discord notifications** for new reviews, toolkit adds, and new tools
- **Suggest a tool** directly from the site

## Embeddable Badges

Tool authors can embed ENNA badges in their READMEs:

```markdown
[![ENNA](https://www.en-na.com/api/badge/nmap)](https://www.en-na.com/tool/nmap)
```

## API

Public REST API for programmatic access:

```
GET /api/tools?q=nmap&category=network-recon&sort=stars&limit=10
GET /api/tools/nmap
```

## Stack

- **Next.js 15** (App Router, ISR, SSG)
- **TypeScript** (strict mode)
- **Tailwind CSS** with custom dark/light theme
- **Fuse.js** for fuzzy search
- **Neon Postgres** for reviews, toolkits, and user data
- **NextAuth** with GitHub OAuth
- **GitHub API** (GraphQL batch enrichment)
- **Sentry** for error tracking
- **Vercel** for deployment
- **Checkly** for synthetic monitoring

## Run locally

```bash
git clone https://github.com/1oosedows/enna.git
cd enna
npm install
cp .env.local.example .env.local  # add your tokens
npm run dev
```

Runs on `localhost:3001`. Set `GITHUB_TOKEN` to avoid API rate limits.

## Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm test             # Run tests (Vitest)
npm run typecheck    # TypeScript check
npm run validate     # Validate tools.json schema

python3 enrich-github.py              # Refresh GitHub stats
python3 scripts/validate-data.py      # Data validation
python3 scripts/fix-alternatives.py   # Fix bidirectional alternatives
python3 scripts/notify-new-tools.py   # Discord notifications for new tools
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Quick way to suggest a tool:** Use the [Suggest a Tool](https://www.en-na.com/suggest) page on the site.

**To add a tool via PR**, edit `src/data/tools.json`:

```json
{
  "slug": "your-tool",
  "name": "Your Tool",
  "description": "Short one-liner.",
  "category": "network-recon",
  "language": "Go",
  "platform": ["linux", "macos", "windows"],
  "github": "org/tool",
  "tags": ["tag1", "tag2", "tag3"]
}
```

Run `npm run validate` before submitting to check for errors.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## License

MIT
