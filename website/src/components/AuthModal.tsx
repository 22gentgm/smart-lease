"use client";

import { useState } from "react";
import { X, Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Props {
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({ onClose, initialMode = "signup" }: Props) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      if (err) {
        setError(err);
      } else {
        setSuccess(true);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      } else {
        onClose();
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-smokey-gray hover:bg-ink/5 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <Mail size={28} className="text-success" />
            </div>
            <h2
              className="text-xl font-bold text-ink"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Check your email
            </h2>
            <p className="mt-3 text-sm text-smokey-gray leading-relaxed max-w-xs mx-auto">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <h2
              className="text-xl font-bold text-ink text-center mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-ink/10 bg-cream py-3 pl-10 pr-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-ink/10 bg-cream py-3 px-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-cream py-3 pl-10 pr-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-cream py-3 pl-10 pr-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange transition-colors"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-ut-orange py-3 text-sm font-semibold text-white hover:bg-ut-orange-light disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : mode === "signup" ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-smokey-gray">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); }}
                className="font-semibold text-ut-orange hover:underline cursor-pointer"
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
