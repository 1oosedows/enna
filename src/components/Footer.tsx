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
          <a href="/sponsors" className="hover:text-brand-400 transition-colors">
            Sponsors
          </a>
          <span className="text-border">|</span>
          <a href="/feed.xml" className="hover:text-brand-400 transition-colors">
            RSS
          </a>
          <span className="text-border">|</span>
          <a href="https://github.com/1oosedows/enna" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors">
            GitHub
          </a>
          <span className="text-border">|</span>
          <span>Data from GitHub API</span>
        </div>
      </div>
    </footer>
  );
}
