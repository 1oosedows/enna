#!/usr/bin/env python3
"""
Validate tools.json for required fields, bidirectional alternatives,
and slug consistency. Run in CI or locally before commits.

Exit 0 = all checks pass
Exit 1 = validation errors found
"""

import json
import os
import sys

TOOLS_FILE = os.path.join(os.path.dirname(__file__), "..", "src", "data", "tools.json")

REQUIRED_FIELDS = ["slug", "name", "description", "category", "language", "platform", "tags"]

VALID_CATEGORIES = [
    "network-recon", "subdomain-enum", "web-scanning", "osint-social",
    "osint-general", "vulnerability", "wireless", "forensics",
    "crypto-tracing", "password-attack", "exploitation", "phishing",
    "cloud-recon", "mobile", "dual-use", "offensive-ops",
    "threat-intel", "container-security", "reverse-engineering",
]

errors = []
warnings = []


def error(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def main():
    with open(TOOLS_FILE) as f:
        tools = json.load(f)

    slugs = set()
    slug_to_tool = {}

    print(f"Validating {len(tools)} tools...\n")

    for i, tool in enumerate(tools):
        slug = tool.get("slug", f"<missing-slug-at-index-{i}>")

        # Required fields
        for field in REQUIRED_FIELDS:
            if field not in tool or not tool[field]:
                error(f"[{slug}] Missing required field: {field}")

        # Duplicate slugs
        if slug in slugs:
            error(f"[{slug}] Duplicate slug")
        slugs.add(slug)
        slug_to_tool[slug] = tool

        # Valid category
        if tool.get("category") and tool["category"] not in VALID_CATEGORIES:
            error(f"[{slug}] Invalid category: {tool['category']}")

        # Platform should be a list
        if "platform" in tool and not isinstance(tool["platform"], list):
            error(f"[{slug}] platform must be an array")

        # Tags should be a list with at least 1 entry
        if "tags" in tool:
            if not isinstance(tool["tags"], list):
                error(f"[{slug}] tags must be an array")
            elif len(tool["tags"]) == 0:
                warn(f"[{slug}] No tags defined")

        # GitHub field format
        if tool.get("github"):
            parts = tool["github"].split("/")
            if len(parts) != 2 or not parts[0] or not parts[1]:
                error(f"[{slug}] Invalid github format: {tool['github']} (expected owner/repo)")

        # Description length
        if tool.get("description") and len(tool["description"]) > 200:
            warn(f"[{slug}] Description is {len(tool['description'])} chars (keep under 200)")

    # Bidirectional alternatives check
    non_bidirectional = []
    for slug, tool in slug_to_tool.items():
        for alt_slug in tool.get("alternatives", []):
            if alt_slug not in slug_to_tool:
                warn(f"[{slug}] Alternative '{alt_slug}' does not exist in tools.json")
                continue
            alt_tool = slug_to_tool[alt_slug]
            alt_alternatives = alt_tool.get("alternatives", [])
            if slug not in alt_alternatives:
                non_bidirectional.append((slug, alt_slug))

    if non_bidirectional:
        print(f"Non-bidirectional alternatives ({len(non_bidirectional)}):")
        for a, b in non_bidirectional:
            warn(f"  {a} -> {b} (but {b} does not list {a})")

    # Report
    print(f"\nResults: {len(tools)} tools checked")
    if warnings:
        print(f"\nWarnings ({len(warnings)}):")
        for w in warnings:
            print(f"  WARN: {w}")

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors:
            print(f"  ERROR: {e}")
        sys.exit(1)
    else:
        print("\nAll checks passed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
