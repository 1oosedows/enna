import { Category } from "@/types";

export type ColorScheme = "brand" | "caution" | "danger";

export function getCategoryColorScheme(category: Category): ColorScheme {
  if (category === "dual-use") return "caution";
  if (category === "offensive-ops" || category === "container-security") return "danger";
  return "brand";
}

export const colorVars: Record<
  ColorScheme,
  {
    text: string;
    textHover: string;
    bg: string;
    bgHover: string;
    border: string;
    gradient: string;
    gradientText: string;
    glow: string;
    tagBg: string;
    tagBorder: string;
    scanLine: string;
  }
> = {
  brand: {
    text: "text-brand-400",
    textHover: "hover:text-brand-400",
    bg: "bg-brand-500",
    bgHover: "hover:bg-brand-600",
    border: "border-brand-500/30",
    gradient: "from-brand-500 to-accent-500",
    gradientText: "from-brand-400 to-accent-400",
    glow: "rgba(255, 90, 110, 0.08)",
    tagBg: "rgba(255, 90, 110, 0.1)",
    tagBorder: "rgba(255, 90, 110, 0.2)",
    scanLine: "rgba(255, 90, 110, 0.6)",
  },
  caution: {
    text: "text-caution-400",
    textHover: "hover:text-caution-400",
    bg: "bg-caution-500",
    bgHover: "hover:bg-caution-600",
    border: "border-caution-500/30",
    gradient: "from-caution-500 to-caution-700",
    gradientText: "from-caution-400 to-caution-600",
    glow: "rgba(232, 160, 173, 0.08)",
    tagBg: "rgba(232, 160, 173, 0.1)",
    tagBorder: "rgba(232, 160, 173, 0.2)",
    scanLine: "rgba(232, 160, 173, 0.6)",
  },
  danger: {
    text: "text-danger-400",
    textHover: "hover:text-danger-400",
    bg: "bg-danger-500",
    bgHover: "hover:bg-danger-600",
    border: "border-danger-500/30",
    gradient: "from-danger-500 to-danger-700",
    gradientText: "from-danger-400 to-danger-600",
    glow: "rgba(196, 160, 185, 0.08)",
    tagBg: "rgba(196, 160, 185, 0.1)",
    tagBorder: "rgba(196, 160, 185, 0.2)",
    scanLine: "rgba(196, 160, 185, 0.6)",
  },
};
