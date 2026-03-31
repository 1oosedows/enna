export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: Category;
  subcategory?: string;
  language: string;
  platform: string[];
  installCommand?: string;
  installCommands?: Record<string, string>;
  website?: string;
  documentation?: string;
  downloadUrl?: string;
  github: string;
  tags: string[];
  featured?: boolean;
  useCases?: string[];
  alternatives?: string[];
  affiliateUrl?: string;
  affiliateLabel?: string;
  // GitHub enrichment (populated at build time)
  stars?: number;
  forks?: number;
  lastCommit?: string;
  openIssues?: number;
  license?: string;
  avatarUrl?: string;
  githubDescription?: string;
  githubTopics?: string[];
  homepageUrl?: string;
}

export type Category =
  | "network-recon"
  | "subdomain-enum"
  | "web-scanning"
  | "osint-social"
  | "osint-general"
  | "vulnerability"
  | "wireless"
  | "forensics"
  | "crypto-tracing"
  | "password-attack"
  | "exploitation"
  | "phishing"
  | "cloud-recon"
  | "mobile"
  | "dual-use"
  | "offensive-ops";

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
  count?: number;
}

export interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  license: { spdx_id: string } | null;
  owner: { avatar_url: string };
  description: string | null;
  topics: string[];
  homepage: string | null;
}
