import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p
              className="text-lg font-bold text-ink"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Smart<span className="text-ut-orange">Lease</span>
            </p>
            <p className="mt-2 text-sm text-smokey-gray leading-relaxed">
              Helping UT Knoxville students find their perfect apartment.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-smokey-gray">
              <li><Link href="/quiz" className="hover:text-ut-orange transition-colors">Quiz</Link></li>
              <li><Link href="/explore" className="hover:text-ut-orange transition-colors">Apartments</Link></li>
              <li><Link href="/map" className="hover:text-ut-orange transition-colors">Map</Link></li>
              <li><Link href="/reviews" className="hover:text-ut-orange transition-colors">Reviews</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-smokey-gray">
              <li><Link href="/roommates" className="hover:text-ut-orange transition-colors">Roommates</Link></li>
              <li><Link href="/subleases" className="hover:text-ut-orange transition-colors">Subleases</Link></li>
              <li><Link href="/lease-help" className="hover:text-ut-orange transition-colors">Lease Help</Link></li>
              <li><Link href="/blog" className="hover:text-ut-orange transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-smokey-gray">
              <li><Link href="/privacy" className="hover:text-ut-orange transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-ut-orange transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ink/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-smokey-light">
            &copy; {currentYear} SmartLease. Not affiliated with the University of Tennessee.
          </p>
          <p className="text-xs text-smokey-light">
            Made for Vols, by Vols.
          </p>
        </div>
      </div>
    </footer>
  );
}
