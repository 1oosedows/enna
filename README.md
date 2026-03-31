<p align="center">
  <img src="https://img.shields.io/badge/tools-210+-e63950?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/categories-16-a855a0?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/books%20%26%20hardware-28-f25c6e?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/github/last-commit/1oosedows/enna?style=flat-square&color=6b7280&labelColor=0f1117" />
</p>

# ENNA

**Open-source OSINT and reconnaissance tool index.**

Discover, compare, and deploy the best open-source security tools. Curated directory with live GitHub stats, multi-platform install commands, use cases, and alternatives.

**[www.en-na.com](https://www.en-na.com)**

## What is this

ENNA is a curated, searchable directory of 210+ open-source OSINT, reconnaissance, and security tools across 16 categories. Every tool page includes:

- Full description and use cases
- Multi-method install commands (apt, brew, cargo, docker, etc.)
- Links to GitHub, official site, documentation, downloads, releases, and issues
- Live stats pulled from the GitHub API (stars, forks, last commit)
- Alternative tools for comparison
- Related tools in the same category

ENNA also features a **Library** with security books and hardware, with links to purchase.

## Categories

| Category | Examples |
|----------|---------|
| Network Recon | Nmap, Masscan, Wireshark, Shodan |
| Subdomain Enumeration | Subfinder, Amass, dnsx, Altdns |
| Web Scanning | ffuf, Feroxbuster, Burp Suite, Katana |
| OSINT (Social) | Sherlock, Maigret, Instaloader |
| OSINT (General) | SpiderFoot, TruffleHog, Recon-ng |
| Vulnerability Scanning | Nuclei, OpenVAS, SQLMap, XSStrike |
| Wireless | Aircrack-ng, Bettercap, Flipper Zero |
| Digital Forensics | Volatility 3, Ghidra, YARA, Velociraptor |
| Crypto Tracing | GraphSense, Cast, Cryo, Web3.py, Slither |
| Password Attacks | Hashcat, Hydra, Mimikatz, SecLists |
| Exploitation | Metasploit, Sliver, BloodHound, LinPEAS |
| Phishing Analysis | GoPhish, Evilginx2, Modlishka |
| Cloud Recon | ScoutSuite, Prowler, CloudSploit |
| Mobile Security | MobSF, Frida, Objection |
| Dual Use | Cobalt Strike, Brute Ratel |
| Offensive Ops | Covenant, Mythic, Havoc |

## Library

The [Library](https://www.en-na.com/library) section includes curated security books and hardware with purchase links:

- **23 books** covering OSINT, penetration testing, malware analysis, blockchain forensics, and more
- **5 hardware tools** including HackRF One, Flipper Zero, Proxmark3 RDV4, and more

## Stack

- **Next.js 15** (App Router, static generation)
- **TypeScript**
- **Tailwind CSS** with custom dark theme
- **GitHub API** for live repo enrichment
- Deployed on **Vercel**

## Run locally

```bash
git clone https://github.com/1oosedows/enna.git
cd enna
npm install
npm run dev
```

Runs on `localhost:3000` by default. Set `GITHUB_TOKEN` env var to avoid API rate limits.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding tools, books, and hardware.

## Add a tool

Edit `src/data/tools.json` and add an entry:

```json
{
  "slug": "your-tool",
  "name": "Your Tool",
  "description": "Short one-liner description.",
  "longDescription": "Detailed description for the tool page.",
  "category": "network-recon",
  "language": "Go",
  "platform": ["linux", "macos", "windows"],
  "installCommand": "go install github.com/org/tool@latest",
  "installCommands": {
    "go install": "go install github.com/org/tool@latest",
    "brew": "brew install tool",
    "docker": "docker pull org/tool"
  },
  "website": "https://tool.dev",
  "documentation": "https://docs.tool.dev",
  "downloadUrl": "https://github.com/org/tool/releases",
  "github": "org/tool",
  "tags": ["tag1", "tag2", "tag3"],
  "featured": false,
  "useCases": [
    "Use case one",
    "Use case two"
  ],
  "alternatives": ["other-tool-slug"]
}
```

Only `slug`, `name`, `description`, `category`, `language`, `platform`, `github`, and `tags` are required. Everything else is optional.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## License

MIT
