import { Tool, GitHubRepo } from "@/types";

const GITHUB_API = "https://api.github.com/repos";
const CACHE_TTL = 3600 * 1000; // 1 hour

const cache = new Map<string, { data: GitHubRepo; ts: number }>();

export async function enrichTool(tool: Tool): Promise<Tool> {
  if (!tool.github) return tool;

  const cached = cache.get(tool.github);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return applyGitHubData(tool, cached.data);
  }

  try {
    const res = await fetch(`${GITHUB_API}/${tool.github}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[GitHub] ${res.status} for ${tool.github}${res.status === 403 ? ' (rate limited)' : ''}`);
      return tool;
    }

    const data: GitHubRepo = await res.json();
    cache.set(tool.github, { data, ts: Date.now() });
    return applyGitHubData(tool, data);
  } catch {
    return tool;
  }
}

function applyGitHubData(tool: Tool, data: GitHubRepo): Tool {
  return {
    ...tool,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    lastCommit: data.pushed_at,
    license: data.license?.spdx_id ?? undefined,
    avatarUrl: data.owner?.avatar_url,
    githubDescription: data.description ?? undefined,
    githubTopics: data.topics?.length ? data.topics : undefined,
    homepageUrl: data.homepage || undefined,
  };
}

export async function enrichTools(tools: Tool[]): Promise<Tool[]> {
  const BATCH_SIZE = 20;
  const enriched: Tool[] = [];

  for (let i = 0; i < tools.length; i += BATCH_SIZE) {
    const batch = tools.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(enrichTool));
    enriched.push(
      ...results.map((r, j) =>
        r.status === "fulfilled" ? r.value : batch[j]
      )
    );
  }

  return enriched;
}

export function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
