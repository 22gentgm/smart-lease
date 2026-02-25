import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pb-24 md:pb-0">
      <div className="text-center px-6">
        <p className="text-7xl font-bold text-ut-orange mb-4">404</p>
        <h1
          className="text-2xl font-bold text-ink md:text-3xl mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Page not found
        </h1>
        <p className="text-smokey-gray mb-8 max-w-md mx-auto">
          This page doesn&apos;t exist. Maybe you were looking for an apartment?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-ink/10 px-6 py-3 text-sm font-semibold text-ink hover:border-ut-orange hover:text-ut-orange transition-colors"
          >
            <Search size={16} />
            Explore Apartments
          </Link>
        </div>
      </div>
    </div>
  );
}
