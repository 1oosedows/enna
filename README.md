<p align="center">
  <img src="https://img.shields.io/badge/tools-138-e63950?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/categories-12-a855a0?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/badge/crypto%20tracing-42-f25c6e?style=flat-square&labelColor=0f1117" />
  <img src="https://img.shields.io/github/last-commit/1oosedows/enna?style=flat-square&color=6b7280&labelColor=0f1117" />
</p>

# ENNA

**Open-source OSINT and reconnaissance tool index.**

Discover, compare, and deploy the best open-source security tools. Curated directory with live GitHub stats, multi-platform install commands, use cases, and alternatives.

**[en-na.com](https://en-na.com)**

## What is this

ENNA is a curated, searchable directory of 138 open-source OSINT, reconnaissance, and security tools across 12 categories. Every tool page includes:

- Full description and use cases
- Multi-method install commands (apt, brew, cargo, docker, etc.)
- Links to GitHub, official site, documentation, downloads, releases, and issues
- Live stats pulled from the GitHub API (stars, forks, last commit)
- Alternative tools for comparison
- Related tools in the same category

## Categories

| Category | Tools | Examples |
|----------|-------|---------|
| Network Recon | 10 | Nmap, Masscan, Wireshark, Shodan |
| Subdomain Enumeration | 9 | Subfinder, Amass, dnsx, Altdns |
| Web Scanning | 12 | ffuf, Feroxbuster, Burp Suite, Katana |
| OSINT (Social) | 7 | Sherlock, Maigret, Instaloader |
| OSINT (General) | 9 | SpiderFoot, TruffleHog, Recon-ng |
| Vulnerability Scanning | 7 | Nuclei, OpenVAS, SQLMap, XSStrike |
| Wireless | 5 | Aircrack-ng, Bettercap, Flipper Zero |
| Digital Forensics | 9 | Volatility 3, Ghidra, YARA, Velociraptor |
| Crypto Tracing | 42 | GraphSense, Cast, Cryo, Web3.py, Slither |
| Password Attacks | 8 | Hashcat, Hydra, Mimikatz, SecLists |
| Exploitation | 13 | Metasploit, Sliver, BloodHound, LinPEAS |
| Phishing Analysis | 5 | GoPhish, Evilginx2, Modlishka |

## Stack

- **Next.js 14** (App Router, static generation)
- **TypeScript**
- **Tailwind CSS** with custom dark theme
- **GitHub API** for live repo enrichment

## Run locally

```bash
git clone https://github.com/1oosedows/enna.git
cd enna
npm install
npm run dev
```

Runs on `localhost:3000` by default. Set `GITHUB_TOKEN` env var to avoid API rate limits.

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

## License

MIT
