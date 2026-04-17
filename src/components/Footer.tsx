export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="ENNA" width={24} height={24} className="rounded" />
          <span className="font-mono text-sm text-text-secondary">
            ENNA - OSINT & Recon Tool Index
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-text-muted">
          <span>en-na.com</span>
          <span className="text-border">|</span>
          <span>Open source tools, curated</span>
          <span className="text-border">|</span>
          <span>Data from GitHub API</span>
        </div>
      </div>
    </footer>
  );
}
