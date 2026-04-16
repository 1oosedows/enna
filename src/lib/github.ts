import { Tool, GitHubRepo } from "@/types";

const GITHUB_API = "https://api.github.com/repos";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const CACHE_TTL = 3600 * 1000; // 1 hour

const cache = new Map<string, { data: GitHubRepo; ts: number }>();

export async function enrichTool(tool: Tool): Promise<Tool> {
  if (!tool.github) return tool;

  // If stats are already baked into tools.json, skip the API call
  if (tool.stars !== undefined) return tool;

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
  // Try GraphQL batch first (much fewer API calls), fall back to REST
  const needEnrichment = tools.filter(
    (t) => t.github && t.stars === undefined
  );

  if (needEnrichment.length === 0) return tools;

  if (process.env.GITHUB_TOKEN && needEnrichment.length > 5) {
    const enriched = await enrichToolsGraphQL(tools);
    if (enriched) return enriched;
  }

  // REST fallback: batch in groups of 20
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

async function enrichToolsGraphQL(tools: Tool[]): Promise<Tool[] | null> {
  const needEnrichment = tools.filter(
    (t) => t.github && t.stars === undefined
  );

  if (needEnrichment.length === 0) return tools;

  // GraphQL can handle ~100 repos per query
  const GRAPHQL_BATCH = 100;
  const repoDataMap = new Map<string, GitHubRepo>();

  try {
    for (let i = 0; i < needEnrichment.length; i += GRAPHQL_BATCH) {
      const batch = needEnrichment.slice(i, i + GRAPHQL_BATCH);
      const fragments = batch.map((tool, idx) => {
        const [owner, name] = tool.github!.split("/");
        return `repo${idx}: repository(owner: "${owner}", name: "${name}") {
          stargazerCount
          forkCount
          issues(states: OPEN) { totalCount }
          pushedAt
          licenseInfo { spdxId }
          owner { avatarUrl }
          description
          repositoryTopics(first: 10) { nodes { topic { name } } }
          homepageUrl
        }`;
      });

      const query = `query { ${fragments.join("\n")} }`;

      const res = await fetch(GITHUB_GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 },
      });

      if (!res.ok) return null; // Fall back to REST

      const json = await res.json();
      if (json.errors && !json.data) return null;

      batch.forEach((tool, idx) => {
        const data = json.data?.[`repo${idx}`];
        if (!data) return;

        const mapped: GitHubRepo = {
          stargazers_count: data.stargazerCount,
          forks_count: data.forkCount,
          open_issues_count: data.issues?.totalCount ?? 0,
          pushed_at: data.pushedAt,
          license: data.licenseInfo?.spdxId
            ? { spdx_id: data.licenseInfo.spdxId }
            : null,
          owner: { avatar_url: data.owner?.avatarUrl ?? "" },
          description: data.description,
          topics:
            data.repositoryTopics?.nodes?.map(
              (n: { topic: { name: string } }) => n.topic.name
            ) ?? [],
          homepage: data.homepageUrl || null,
        };

        repoDataMap.set(tool.github!, mapped);
        cache.set(tool.github!, { data: mapped, ts: Date.now() });
      });
    }
  } catch {
    return null; // Fall back to REST
  }

  return tools.map((tool) => {
    if (!tool.github || tool.stars !== undefined) return tool;
    const data = repoDataMap.get(tool.github);
    return data ? applyGitHubData(tool, data) : tool;
  });
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
