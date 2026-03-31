# Contributing to ENNA

Thanks for your interest in contributing to ENNA. This guide covers the main ways you can help.

## Adding a Tool

The most common contribution is adding a new tool to the index.

### 1. Edit `src/data/tools.json`

Add a new entry with at minimum these required fields:

```json
{
  "slug": "your-tool",
  "name": "Your Tool",
  "description": "Short one-liner description.",
  "category": "network-recon",
  "language": "Go",
  "platform": ["linux", "macos", "windows"],
  "github": "org/tool",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### 2. Optional fields

These are encouraged but not required:

```json
{
  "longDescription": "Detailed description for the tool detail page.",
  "installCommand": "go install github.com/org/tool@latest",
  "installCommands": {
    "go install": "go install github.com/org/tool@latest",
    "brew": "brew install tool",
    "docker": "docker pull org/tool"
  },
  "website": "https://tool.dev",
  "documentation": "https://docs.tool.dev",
  "downloadUrl": "https://github.com/org/tool/releases",
  "featured": false,
  "useCases": ["Use case one", "Use case two"],
  "alternatives": ["other-tool-slug"]
}
```

### 3. Valid categories

```
network-recon, subdomain-enum, web-scanning, osint-social, osint-general,
vulnerability, wireless, forensics, crypto-tracing, password-attack,
exploitation, phishing, cloud-recon, mobile, dual-use, offensive-ops
```

### 4. Guidelines

- **Slug** must be unique, lowercase, hyphenated (e.g. `my-tool`)
- **GitHub** field should be `owner/repo` format (not the full URL)
- **Platform** array should include all supported platforms: `linux`, `macos`, `windows`
- **Tags** should be 3-5 relevant keywords
- **Description** should be a single sentence, no period at the end
- Tool must be open source or have a free tier
- Tool must be related to security, OSINT, recon, forensics, or crypto tracing

### 5. Submit a PR

- Fork the repo
- Create a branch: `git checkout -b add-tool-name`
- Add your tool to `tools.json`
- Commit: `git commit -m "feat: add tool-name"`
- Push and open a PR

## Adding a Book or Hardware Item

Edit `src/data/library.json` and follow the existing format. Books need an `editions` array with format and Amazon URL. Hardware needs an `amazonUrl` field.

## Reporting Issues

- **Missing tool**: Open an issue with the tool name, GitHub URL, and category
- **Incorrect data**: Open an issue describing what's wrong
- **Bug**: Open an issue with steps to reproduce

## Development Setup

```bash
git clone https://github.com/1oosedows/enna.git
cd enna
npm install
npm run dev
```

The dev server runs on `localhost:3001`. Set `GITHUB_TOKEN` as an environment variable to avoid GitHub API rate limits during development.

## Code Style

- TypeScript throughout
- Tailwind CSS for styling (no custom CSS unless absolutely necessary)
- Follow existing patterns in the codebase
- Run `npm run build` before submitting to ensure no type errors

## Pull Request Guidelines

- Keep PRs focused on a single change
- Use descriptive commit messages starting with `feat:`, `fix:`, or `docs:`
- Update tool counts in `Header.tsx` and `HeroSection.tsx` if adding tools
- Don't modify `package-lock.json` unless adding dependencies
