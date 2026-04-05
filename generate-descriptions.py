#!/usr/bin/env python3
"""
Batch-generate longDescription for tools missing them in tools.json.
Uses OpenAI API. Processes in batches of 15, saves after each batch.
Re-run safely — skips tools that already have longDescription.
"""

import json
import os
import sys
import time
import urllib.request

TOOLS_FILE = os.path.join(os.path.dirname(__file__), "src", "data", "tools.json")
API_KEY = os.environ.get("OPENAI_API_KEY")
MODEL = "gpt-4o"
BATCH_SIZE = 15
SLEEP_BETWEEN = 1  # seconds between API calls

# Style examples baked in so the LLM matches tone
STYLE_EXAMPLES = """
Example 1 (Nmap):
"Nmap (Network Mapper) is a free and open-source utility for network discovery and security auditing. It uses raw IP packets to determine available hosts, services, operating systems, packet filters/firewalls, and dozens of other characteristics. It was designed to rapidly scan large networks but works fine against single hosts. Nmap's scripting engine (NSE) allows users to write and share scripts to automate networking tasks, from vulnerability detection to backdoor discovery. It's used by security professionals, system administrators, and researchers worldwide."

Example 2 (Subfinder):
"Subfinder is a subdomain discovery tool that returns valid subdomains for websites using passive online sources. It has a simple modular architecture and is optimized for speed. Subfinder uses multiple sources including certificate transparency logs, search engines, DNS aggregators, and more to find subdomains without ever touching the target directly. This makes it ideal for stealthy reconnaissance."
"""

SYSTEM_PROMPT = f"""You write concise, factual tool descriptions for a cybersecurity/hacking tool library website.

Style rules:
- 3-5 sentences, 350-600 characters
- Factual and technical, no marketing fluff
- Describe what the tool does, how it works, what makes it notable
- Plain text only, no markdown or HTML
- Do not start with "The" if avoidable
- Match the tone of these examples:
{STYLE_EXAMPLES}

Return ONLY a JSON object mapping tool slugs to their longDescription strings. No markdown fences, no explanation."""


def generate_descriptions(tools_batch):
    """Call OpenAI API for a batch of tools."""
    tool_summaries = []
    for t in tools_batch:
        summary = {
            "slug": t["slug"],
            "name": t["name"],
            "description": t["description"],
            "category": t["category"],
            "language": t.get("language", "unknown"),
            "tags": t.get("tags", []),
            "github": t.get("github", ""),
        }
        tool_summaries.append(summary)

    user_prompt = (
        "Generate longDescription for each of these tools. "
        "Return a JSON object mapping slug -> longDescription string.\n\n"
        + json.dumps(tool_summaries, indent=2)
    )

    body = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 4000,
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
    )

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read())
            content = result["choices"][0]["message"]["content"]
            # Strip markdown fences if present
            content = content.strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()
            return json.loads(content)
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            if attempt < 2:
                time.sleep(5)
    return {}


def main():
    if not API_KEY:
        print("Error: OPENAI_API_KEY not set")
        sys.exit(1)

    with open(TOOLS_FILE) as f:
        tools = json.load(f)

    missing = [t for t in tools if not t.get("longDescription")]
    print(f"Total tools: {len(tools)}")
    print(f"Already have longDescription: {len(tools) - len(missing)}")
    print(f"Missing: {len(missing)}")

    if not missing:
        print("Nothing to do!")
        return

    # Optional: resume from a specific offset
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    missing = missing[start:]
    print(f"Starting from offset {start}, processing {len(missing)} tools")

    # Build slug->index lookup for fast updates
    slug_to_idx = {t["slug"]: i for i, t in enumerate(tools)}

    written = 0
    for batch_num in range(0, len(missing), BATCH_SIZE):
        batch = missing[batch_num:batch_num + BATCH_SIZE]
        batch_names = [t["name"] for t in batch]
        print(f"\nBatch {batch_num // BATCH_SIZE + 1}: {', '.join(batch_names)}")

        descriptions = generate_descriptions(batch)

        if not descriptions:
            print("  FAILED - skipping batch")
            continue

        # Apply descriptions
        batch_written = 0
        for slug, desc in descriptions.items():
            if slug in slug_to_idx and desc and len(desc) > 50:
                tools[slug_to_idx[slug]]["longDescription"] = desc
                batch_written += 1

        written += batch_written
        print(f"  Wrote {batch_written}/{len(batch)} descriptions")

        # Save after every batch
        with open(TOOLS_FILE, "w") as f:
            json.dump(tools, f, indent=2)
        print(f"  Saved. Total written so far: {written}")

        if batch_num + BATCH_SIZE < len(missing):
            time.sleep(SLEEP_BETWEEN)

    print(f"\nDone. Wrote {written} descriptions total.")


if __name__ == "__main__":
    main()
