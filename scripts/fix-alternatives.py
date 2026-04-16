#!/usr/bin/env python3
"""
Make all alternative relationships bidirectional in tools.json.
If tool A lists B as an alternative, B should also list A.
"""

import json
import os

TOOLS_FILE = os.path.join(os.path.dirname(__file__), "..", "src", "data", "tools.json")


def main():
    with open(TOOLS_FILE) as f:
        tools = json.load(f)

    slug_to_idx = {t["slug"]: i for i, t in enumerate(tools)}
    fixes = 0

    for tool in tools:
        for alt_slug in tool.get("alternatives", []):
            if alt_slug not in slug_to_idx:
                continue

            alt_idx = slug_to_idx[alt_slug]
            alt_tool = tools[alt_idx]

            if "alternatives" not in alt_tool:
                alt_tool["alternatives"] = []

            if tool["slug"] not in alt_tool["alternatives"]:
                alt_tool["alternatives"].append(tool["slug"])
                fixes += 1
                print(f"  Added {tool['slug']} -> {alt_slug} (reverse link)")

    if fixes:
        with open(TOOLS_FILE, "w") as f:
            json.dump(tools, f, indent=2)
        print(f"\nFixed {fixes} non-bidirectional alternatives.")
    else:
        print("All alternatives are already bidirectional.")


if __name__ == "__main__":
    main()
