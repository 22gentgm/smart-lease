"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Building2,
  Users,
  Star,
  Search,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quiz", label: "Quiz", icon: ClipboardList },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/roommates", label: "Roommates", icon: Users },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop / Tablet — sticky top bar */}
      <nav className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md hidden md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-ink"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Smart<span className="text-ut-orange">Lease</span>
          </Link>
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-ut-orange/10 text-ut-orange"
                      : "text-smokey-gray hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile — sticky top bar (simplified) */}
      <nav className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md md:hidden">
        <div className="flex h-14 items-center justify-center px-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-ink"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Smart<span className="text-ut-orange">Lease</span>
          </Link>
        </div>
      </nav>

      {/* Mobile — fixed bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/5 bg-white/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                  active ? "text-ut-orange" : "text-smokey-gray"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
        {/* Safe area spacer for phones with home indicators */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
