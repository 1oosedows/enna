export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 brand-gradient rounded flex items-center justify-center">
            <span className="text-white font-mono text-[10px] font-bold">
              EN
            </span>
          </div>
          <span className="font-mono text-sm text-text-secondary">
            ENNA — OSINT & Recon Tool Index
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
