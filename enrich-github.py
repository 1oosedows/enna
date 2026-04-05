#!/usr/bin/env python3
"""
Fetch GitHub stats for all tools and bake them into tools.json.
Run locally with GITHUB_TOKEN set. Re-run anytime to refresh.
Skips tools with no github field.
"""

import json
import os
import sys
import time
import urllib.request

TOOLS_FILE = os.path.join(os.path.dirname(__file__), "src", "data", "tools.json")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
BATCH_SIZE = 20
SLEEP_BETWEEN = 0.1  # seconds between requests (with token, 5000/hr is plenty)


def fetch_repo(owner_repo):
    """Fetch a single repo's data from GitHub API."""
    url = f"https://api.github.com/repos/{owner_repo}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "enna-enricher",
    }
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"

    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code} for {owner_repo}")
        return None
    except Exception as e:
        print(f"  Error for {owner_repo}: {e}")
        return None


def main():
    global TOKEN
    if not TOKEN:
        # Try loading from .env.local
        env_file = os.path.join(os.path.dirname(__file__), ".env.local")
        if os.path.exists(env_file):
            with open(env_file) as f:
                for line in f:
                    if line.startswith("GITHUB_TOKEN="):
                        TOKEN = line.strip().split("=", 1)[1]
                        break

    if not TOKEN:
        print("Warning: No GITHUB_TOKEN found. Rate limit will be 60/hr.")

    with open(TOOLS_FILE) as f:
        tools = json.load(f)

    need_enrichment = [t for t in tools if t.get("github")]
    print(f"Total tools: {len(tools)}")
    print(f"With GitHub repos: {len(need_enrichment)}")
    print(f"Without (skipping): {len(tools) - len(need_enrichment)}")

    slug_to_idx = {t["slug"]: i for i, t in enumerate(tools)}
    enriched = 0
    failed = 0

    for i, tool in enumerate(need_enrichment):
        repo = tool["github"]
        data = fetch_repo(repo)

        if data and "stargazers_count" in data:
            idx = slug_to_idx[tool["slug"]]
            tools[idx]["stars"] = data["stargazers_count"]
            tools[idx]["forks"] = data["forks_count"]
            tools[idx]["openIssues"] = data["open_issues_count"]
            tools[idx]["lastCommit"] = data["pushed_at"]
            if data.get("license") and data["license"].get("spdx_id") != "NOASSERTION":
                tools[idx]["license"] = data["license"]["spdx_id"]
            if data.get("owner", {}).get("avatar_url"):
                tools[idx]["avatarUrl"] = data["owner"]["avatar_url"]
            if data.get("description"):
                tools[idx]["githubDescription"] = data["description"]
            if data.get("topics"):
                tools[idx]["githubTopics"] = data["topics"]
            if data.get("homepage"):
                tools[idx]["homepageUrl"] = data["homepage"]
            enriched += 1
        else:
            failed += 1

        # Progress
        if (i + 1) % 20 == 0 or i == len(need_enrichment) - 1:
            print(f"  Progress: {i+1}/{len(need_enrichment)} (enriched: {enriched}, failed: {failed})")

        # Save every 50 tools
        if (i + 1) % 50 == 0:
            with open(TOOLS_FILE, "w") as f:
                json.dump(tools, f, indent=2)
            print(f"  Saved checkpoint at {i+1}")

        time.sleep(SLEEP_BETWEEN)

    # Final save
    with open(TOOLS_FILE, "w") as f:
        json.dump(tools, f, indent=2)

    print(f"\nDone. Enriched: {enriched}, Failed: {failed}")


if __name__ == "__main__":
    main()
