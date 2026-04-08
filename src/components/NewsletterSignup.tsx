"use client";

export default function NewsletterSignup() {
  return (
    <div className="glass rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h3 className="font-mono font-semibold text-lg text-text-primary mb-1">
            Weekly Newsletter
          </h3>
          <p className="text-sm text-text-secondary">
            New tools, updates, and changes delivered every Monday morning.
          </p>
        </div>

        <a
          href="https://ennaosint.substack.com/subscribe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg brand-gradient text-white text-sm font-mono font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Subscribe on Substack
        </a>
      </div>
    </div>
  );
}
