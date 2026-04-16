#!/usr/bin/env python3
"""
Send Discord notifications for newly added tools.
Usage: python3 scripts/notify-new-tools.py [--since N]
  --since N: notify for the last N tools added (default: all tools after LAUNCH_TOOL_COUNT)
"""

import json
import os
import sys
import urllib.request

TOOLS_FILE = os.path.join(os.path.dirname(__file__), "..", "src", "data", "tools.json")
LAUNCH_TOOL_COUNT = 251
WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL", "")

def send_webhook(tool):
    if not WEBHOOK_URL:
        print("  DISCORD_WEBHOOK_URL not set, skipping")
        return

    payload = {
        "embeds": [{
            "title": f"🆕 New Tool Added: {tool['name']}",
            "description": tool.get("description", ""),
            "url": f"https://www.en-na.com/tool/{tool['slug']}",
            "color": 0x22c55e,
            "fields": [
                {"name": "Category", "value": tool.get("category", ""), "inline": True},
                {"name": "Language", "value": tool.get("language", ""), "inline": True},
            ],
            "footer": {"text": "ENNA Tool Index"},
        }]
    }

    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        urllib.request.urlopen(req, timeout=10)
        print(f"  Notified: {tool['name']}")
    except Exception as e:
        print(f"  Failed: {tool['name']} - {e}")


def main():
    with open(TOOLS_FILE) as f:
        tools = json.load(f)

    since = LAUNCH_TOOL_COUNT
    if "--since" in sys.argv:
        idx = sys.argv.index("--since")
        since = len(tools) - int(sys.argv[idx + 1])

    new_tools = tools[since:]
    print(f"Notifying Discord about {len(new_tools)} new tools...")

    for tool in new_tools:
        send_webhook(tool)

    print("Done.")


if __name__ == "__main__":
    main()
