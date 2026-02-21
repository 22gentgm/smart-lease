"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";

const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwQnf8UAbarqAlCdAiZu7M-8Q7VWDVCmveFkY6Fa7KsOtLWBPiQRa8g2J2CApNRwv2A/exec";

interface SavedUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

function getSavedUser(): SavedUser | null {
  try {
    const raw = localStorage.getItem("smartlease_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: SavedUser) {
  localStorage.setItem("smartlease_user", JSON.stringify(user));
}

interface Props {
  apartmentName: string;
  price: number;
  matchScore?: number;
  bedrooms?: string;
  distance?: number;
  onClose: () => void;
}

export default function SelectApartmentModal({
  apartmentName,
  price,
  matchScore,
  bedrooms,
  distance,
  onClose,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"form" | "sending" | "success" | "error">("form");

  useEffect(() => {
    const saved = getSavedUser();
    if (saved) {
      setFirstName(saved.firstName);
      setLastName(saved.lastName);
      setEmail(saved.email);
      setPhone(saved.phone);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const canSubmit =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    email.trim().length >= 5 &&
    status === "form";

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const user: SavedUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
    saveUser(user);
    setStatus("sending");

    const payload = {
      timestamp: new Date().toISOString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      bedrooms: bedrooms || "",
      budget: "",
      apartment: apartmentName,
      price: "$" + price.toLocaleString(),
      distance: distance ? distance + " mi" : "",
      matchScore: matchScore ? matchScore + "%" : "",
    };

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-smokey-gray hover:bg-ink/5 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check size={32} className="text-success" />
            </div>
            <h2
              className="text-2xl font-bold text-ink"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              You&apos;re all set!
            </h2>
            <p className="mt-2 text-sm text-ut-orange font-semibold">{apartmentName}</p>
            <p className="mt-1 text-sm text-smokey-gray">
              ${price.toLocaleString()}/mo
            </p>
            <p className="mt-4 text-sm text-smokey-gray leading-relaxed max-w-xs mx-auto">
              Your application request has been received! We&apos;ll follow up within{" "}
              <strong>24–48 hours</strong> with next steps.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-ut-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ut-orange-light cursor-pointer"
            >
              Back to Browsing
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2
                className="text-2xl font-bold text-ink"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Request Application
              </h2>
              <p className="mt-1 text-sm text-ut-orange font-semibold">{apartmentName}</p>
              <p className="mt-0.5 text-sm text-smokey-gray">
                ${price.toLocaleString()}/mo
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-smokey-gray">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange focus:ring-1 focus:ring-ut-orange transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-smokey-gray">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange focus:ring-1 focus:ring-ut-orange transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-smokey-gray">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@vols.utk.edu"
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange focus:ring-1 focus:ring-ut-orange transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-smokey-gray">
                  Phone <span className="text-smokey-light">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(865) 555-1234"
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light outline-none focus:border-ut-orange focus:ring-1 focus:ring-ut-orange transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ut-orange px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ut-orange-light disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>

            <p className="mt-3 text-center text-xs text-smokey-light">
              Your info is only used to connect you with this apartment.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
