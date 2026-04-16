const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface Embed {
  title: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  thumbnail?: { url: string };
  footer?: { text: string };
  timestamp?: string;
}

export async function sendDiscordNotification(content: string, embed?: Embed) {
  if (!WEBHOOK_URL) return;

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ...(embed ? { embeds: [embed] } : {}),
      }),
    });
  } catch {
    // Fire and forget — don't break the main flow
  }
}

export function notifyNewReview(
  username: string,
  toolSlug: string,
  toolName: string,
  rating: number,
  comment: string
) {
  return sendDiscordNotification("", {
    title: `⭐ New Review: ${toolName}`,
    description: comment,
    url: `https://www.en-na.com/tool/${toolSlug}`,
    color: 0xff5a6e, // brand coral
    fields: [
      { name: "Rating", value: "★".repeat(rating) + "☆".repeat(5 - rating), inline: true },
      { name: "Reviewer", value: `[${username}](https://www.en-na.com/u/${username})`, inline: true },
    ],
    footer: { text: "ENNA Community" },
    timestamp: new Date().toISOString(),
  });
}

export function notifyToolkitAdd(
  username: string,
  toolSlug: string,
  toolName: string
) {
  return sendDiscordNotification("", {
    title: `🔧 Toolkit Update`,
    description: `**${username}** added **${toolName}** to their toolkit`,
    url: `https://www.en-na.com/tool/${toolSlug}`,
    color: 0x8dcae8, // brand sky blue
    footer: { text: "ENNA Community" },
    timestamp: new Date().toISOString(),
  });
}

export function notifyNewTool(
  toolName: string,
  toolSlug: string,
  category: string,
  language: string,
  description: string
) {
  return sendDiscordNotification("", {
    title: `🆕 New Tool Added: ${toolName}`,
    description,
    url: `https://www.en-na.com/tool/${toolSlug}`,
    color: 0x22c55e, // green
    fields: [
      { name: "Category", value: category, inline: true },
      { name: "Language", value: language, inline: true },
    ],
    footer: { text: "ENNA Tool Index" },
    timestamp: new Date().toISOString(),
  });
}
