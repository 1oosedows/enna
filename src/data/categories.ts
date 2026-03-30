import { CategoryInfo } from "@/types";

export const categories: CategoryInfo[] = [
  {
    id: "network-recon",
    name: "Network Recon",
    icon: "🌐",
    description: "Port scanning, host discovery, network mapping",
  },
  {
    id: "subdomain-enum",
    name: "Subdomain Enumeration",
    icon: "🔍",
    description: "DNS enumeration, subdomain discovery, asset mapping",
  },
  {
    id: "web-scanning",
    name: "Web Scanning",
    icon: "🕸",
    description: "Web application scanners, directory bruting, tech fingerprinting",
  },
  {
    id: "osint-social",
    name: "Social Media OSINT",
    icon: "👤",
    description: "Username lookup, profile analysis, social network mapping",
  },
  {
    id: "osint-general",
    name: "General OSINT",
    icon: "🔎",
    description: "Email lookup, phone lookup, people search, metadata extraction",
  },
  {
    id: "vulnerability",
    name: "Vulnerability Scanning",
    icon: "⚡",
    description: "CVE scanning, misconfiguration detection, security auditing",
  },
  {
    id: "wireless",
    name: "Wireless",
    icon: "📡",
    description: "WiFi auditing, Bluetooth scanning, RF analysis",
  },
  {
    id: "forensics",
    name: "Digital Forensics",
    icon: "🔬",
    description: "Disk forensics, memory analysis, file carving",
  },
  {
    id: "crypto-tracing",
    name: "Crypto Tracing",
    icon: "₿",
    description: "Blockchain analysis, wallet tracing, transaction graph mapping",
  },
  {
    id: "password-attack",
    name: "Password Attacks",
    icon: "🔑",
    description: "Hash cracking, brute force, credential stuffing",
  },
  {
    id: "exploitation",
    name: "Exploitation",
    icon: "💥",
    description: "Exploit frameworks, payload generation, post-exploitation",
  },
  {
    id: "phishing",
    name: "Phishing Analysis",
    icon: "🎣",
    description: "Phishing kits, URL analysis, email header analysis",
  },
];
