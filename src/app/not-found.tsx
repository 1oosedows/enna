import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold brand-gradient-text mb-4">404</h1>
      <p className="text-text-muted text-lg mb-8">
        Page not found. The tool you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
      >
        Back to Index
      </Link>
    </div>
  );
}
