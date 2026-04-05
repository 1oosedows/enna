import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { categories } from "@/data/categories";
import { enrichTools } from "@/lib/github";
import { getCategoryColorScheme } from "@/lib/category-colors";
import toolsData from "@/data/tools.json";
import { Tool } from "@/types";

export const revalidate = 3600;

const categoryDescriptions: Record<string, string> = {
  "network-recon":
    "Network reconnaissance tools for port scanning, host discovery, service enumeration, and network mapping. These tools form the foundation of any security assessment, helping identify live hosts, open ports, running services, and potential attack surfaces across local networks and the internet.",
  "subdomain-enum":
    "Subdomain enumeration and DNS discovery tools for mapping an organization's external attack surface. These tools use passive sources like certificate transparency logs, search engines, and DNS aggregators, as well as active brute-forcing techniques to find subdomains that may host vulnerable services.",
  "web-scanning":
    "Web application scanning tools for directory brute-forcing, technology fingerprinting, vulnerability detection, and crawling. These scanners probe web applications for common misconfigurations, exposed files, known CVEs, and injection points that could lead to compromise.",
  "osint-social":
    "Social media OSINT tools for username enumeration, profile analysis, and social network mapping across platforms. Useful for building target profiles during reconnaissance, investigating fraud, or verifying identities across the social web.",
  "osint-general":
    "General-purpose OSINT tools for email lookup, phone number research, people search, metadata extraction, and data correlation. These tools aggregate publicly available information from multiple sources to build comprehensive intelligence profiles.",
  vulnerability:
    "Vulnerability scanning and security auditing tools that detect CVEs, misconfigurations, outdated software, and security weaknesses across networks, web applications, containers, and code. Essential for both offensive assessments and defensive security posture management.",
  wireless:
    "Wireless security tools for WiFi auditing, WPA/WPA2 cracking, Bluetooth analysis, RF signal capture, and rogue access point detection. These tools assess the security of wireless networks and radio frequency communications.",
  forensics:
    "Digital forensics tools for disk imaging, memory analysis, file carving, log timeline reconstruction, and evidence preservation. Used by incident responders, law enforcement, and security analysts to investigate breaches and recover digital evidence.",
  "crypto-tracing":
    "Blockchain analysis and cryptocurrency tracing tools for wallet clustering, transaction graph mapping, mixer detection, DeFi exploit analysis, and entity attribution. Essential for investigating crypto fraud, ransomware payments, and money laundering across multiple chains.",
  "password-attack":
    "Password cracking and credential attack tools including hash crackers, brute-force utilities, wordlist generators, and hash identification tools. Used in penetration testing to evaluate password policies and recover credentials from captured hashes.",
  exploitation:
    "Exploitation frameworks, payload generators, post-exploitation tools, and privilege escalation utilities. These tools are used in penetration testing and red team operations to demonstrate the real-world impact of discovered vulnerabilities.",
  phishing:
    "Phishing analysis and simulation tools for creating awareness campaigns, analyzing phishing URLs, dissecting email headers, and testing organizational resilience against social engineering attacks.",
  "cloud-recon":
    "Cloud security assessment tools for auditing AWS, Azure, and GCP environments. These tools scan for misconfigured S3 buckets, overly permissive IAM policies, exposed cloud resources, and compliance violations across cloud infrastructure.",
  mobile:
    "Mobile security tools for Android and iOS application analysis, APK reverse engineering, dynamic instrumentation, and mobile penetration testing. These tools help identify vulnerabilities in mobile applications and their backend APIs.",
  "dual-use":
    "Legitimate security and networking tools with well-known offensive applications. These dual-use tools serve both defensive and offensive purposes — useful for system administration, network diagnostics, and security testing.",
  "offensive-ops":
    "Red team and offensive operations tooling including C2 frameworks, evasion techniques, lateral movement utilities, and specialized attack tools. Built for authorized penetration testing and adversary simulation exercises.",
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ id: cat.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) return { title: "Category Not Found" };

  const toolCount = (toolsData as Tool[]).filter(
    (t) => t.category === id
  ).length;
  const pageTitle = `${category.name} Tools (${toolCount}) — ENNA`;
  const pageDescription = categoryDescriptions[id] || category.description;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/category/${id}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const categoryTools = (toolsData as Tool[]).filter(
    (t) => t.category === id
  );
  const enriched = await enrichTools(categoryTools);
  const scheme = getCategoryColorScheme(id as Tool["category"]);

  const gradientClass =
    scheme === "caution"
      ? "caution-gradient"
      : scheme === "danger"
        ? "danger-gradient"
        : "brand-gradient";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Tools`,
    description: categoryDescriptions[id] || category.description,
    url: `https://www.en-na.com/category/${id}`,
    numberOfItems: enriched.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: enriched.length,
      itemListElement: enriched.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.en-na.com/tool/${tool.slug}`,
        name: tool.name,
      })),
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
            <a href="/" className="hover:text-brand-400 transition-colors">
              ENNA
            </a>
            <span className="text-border">/</span>
            <a
              href="/#tools"
              className="hover:text-brand-400 transition-colors"
            >
              Categories
            </a>
            <span className="text-border">/</span>
            <span className="text-text-secondary">{category.name}</span>
          </nav>

          {/* Hero */}
          <div className="glass rounded-2xl p-8 md:p-10 mb-10 relative overflow-hidden">
            <div
              className={
                scheme === "caution"
                  ? "scan-line-caution"
                  : scheme === "danger"
                    ? "scan-line-danger"
                    : "scan-line"
              }
            />
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-xl ${gradientClass} flex items-center justify-center`}
              >
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
                  {category.name}
                </h1>
                <p className="text-sm font-mono text-text-muted mt-1">
                  {enriched.length} tools indexed
                </p>
              </div>
            </div>
            <p className="text-base text-text-secondary leading-relaxed max-w-3xl">
              {categoryDescriptions[id] || category.description}
            </p>
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enriched.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
