"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Search,
  Star,
  Users,
  Repeat,
  Map,
  FileText,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "./AuthModal";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quiz", label: "Quiz", icon: ClipboardList },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/map", label: "Map", icon: Map },
  { href: "/subleases", label: "Subleases", icon: Repeat },
  { href: "/lease-help", label: "Lease Help", icon: FileText },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/roommates", label: "Roommates", icon: Users },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop top bar */}
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

            {/* Auth button */}
            <div className="ml-2 pl-2 border-l border-ink/10 relative">
              {user ? (
                <button
                  onClick={() => setShowMenu((p) => !p)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-smokey-gray hover:bg-ink/5 hover:text-ink transition-colors cursor-pointer"
                >
                  <UserCircle size={16} />
                  {profile?.first_name || "Account"}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-ut-orange/10 px-3 py-2 text-sm font-semibold text-ut-orange hover:bg-ut-orange/20 transition-colors cursor-pointer"
                >
                  <UserCircle size={16} />
                  Sign In
                </button>
              )}

              {showMenu && user && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-ink/5 bg-white p-1.5 shadow-lg">
                    <p className="px-3 py-2 text-xs text-smokey-light truncate">
                      {profile?.email || user.email}
                    </p>
                    <button
                      onClick={() => { signOut(); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-smokey-gray hover:bg-ink/5 hover:text-ink transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-ink"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Smart<span className="text-ut-orange">Lease</span>
          </Link>
          {user ? (
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-smokey-gray cursor-pointer"
            >
              <UserCircle size={18} />
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="rounded-lg bg-ut-orange/10 px-3 py-1.5 text-xs font-semibold text-ut-orange cursor-pointer"
            >
              Sign In
            </button>
          )}

          {showMenu && user && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-4 top-full mt-1 z-50 w-44 rounded-xl border border-ink/5 bg-white p-1.5 shadow-lg">
                <p className="px-3 py-2 text-xs text-smokey-light truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <button
                  onClick={() => { signOut(); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-smokey-gray hover:bg-ink/5 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/5 bg-white/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {links.slice(0, 6).map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium transition-colors ${
                  active ? "text-ut-orange" : "text-smokey-gray"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
