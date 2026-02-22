"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  DollarSign,
  Calendar,
  Mail,
  User,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BedDouble,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "@/components/AuthModal";
import { APARTMENTS } from "@/data/apartments";

interface Sublease {
  id: string;
  user_id: string;
  apartment_index: number;
  bed_type: string;
  price: number;
  available_from: string;
  available_until: string;
  description: string;
  contact_email: string;
  active: boolean;
  created_at: string;
  profiles?: { first_name: string } | null;
}

type SortOption = "newest" | "price_asc" | "soonest";
type Tab = "browse" | "post";

const BED_TYPES = ["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed"];

function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SubleasesPage() {
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Browse state
  const [subleases, setSubleases] = useState<Sublease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterApartment, setFilterApartment] = useState<number | "">("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterUntil, setFilterUntil] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Post form state
  const [formApartment, setFormApartment] = useState<number | "">("");
  const [formBedType, setFormBedType] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formFrom, setFormFrom] = useState("");
  const [formUntil, setFormUntil] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // My listings
  const [myListings, setMyListings] = useState<Sublease[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const fetchSubleases = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("subleases")
      .select("*, profiles(first_name)")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Failed to load subleases. Please try again.");
      setSubleases([]);
    } else {
      setSubleases((data as Sublease[]) ?? []);
    }
    setLoading(false);
  }, []);

  const fetchMyListings = useCallback(async () => {
    if (!user) return;
    setLoadingMine(true);
    const { data } = await supabase
      .from("subleases")
      .select("*, profiles(first_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMyListings((data as Sublease[]) ?? []);
    setLoadingMine(false);
  }, [user]);

  useEffect(() => {
    fetchSubleases();
  }, [fetchSubleases]);

  useEffect(() => {
    if (user) fetchMyListings();
  }, [user, fetchMyListings]);

  useEffect(() => {
    if (profile?.email && !formEmail) {
      setFormEmail(profile.email);
    }
  }, [profile, formEmail]);

  // Filtering & sorting
  const filtered = useMemo(() => {
    let result = [...subleases];

    if (filterApartment !== "") {
      result = result.filter((s) => s.apartment_index === filterApartment);
    }
    if (filterMaxPrice) {
      const max = Number(filterMaxPrice);
      if (!isNaN(max)) result = result.filter((s) => s.price <= max);
    }
    if (filterFrom) {
      result = result.filter((s) => s.available_until >= filterFrom);
    }
    if (filterUntil) {
      result = result.filter((s) => s.available_from <= filterUntil);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "soonest":
        result.sort((a, b) => new Date(a.available_from).getTime() - new Date(b.available_from).getTime());
        break;
    }

    return result;
  }, [subleases, filterApartment, filterMaxPrice, filterFrom, filterUntil, sortBy]);

  const hasFilters = filterApartment !== "" || filterMaxPrice || filterFrom || filterUntil;

  function clearFilters() {
    setFilterApartment("");
    setFilterMaxPrice("");
    setFilterFrom("");
    setFilterUntil("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || formApartment === "" || !formBedType || !formPrice || !formFrom || !formUntil || !formDescription.trim() || !formEmail.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    const { error: insertError } = await supabase.from("subleases").insert({
      user_id: user.id,
      apartment_index: formApartment,
      bed_type: formBedType,
      price: Number(formPrice),
      available_from: formFrom,
      available_until: formUntil,
      description: formDescription.trim(),
      contact_email: formEmail.trim(),
      active: true,
    });

    setSubmitting(false);

    if (insertError) {
      setSubmitError("Failed to post sublease. Please try again.");
      return;
    }

    setSubmitSuccess(true);
    setFormApartment("");
    setFormBedType("");
    setFormPrice("");
    setFormFrom("");
    setFormUntil("");
    setFormDescription("");
    setFormEmail(profile?.email ?? "");

    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab("browse");
    }, 2000);

    fetchSubleases();
    fetchMyListings();
  }

  async function handleDeactivate(id: string) {
    setDeactivating(id);
    await supabase.from("subleases").update({ active: false }).eq("id", id);
    await fetchMyListings();
    await fetchSubleases();
    setDeactivating(null);
  }

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Subleases
          </h1>
          <p className="mt-3 text-base text-smokey-gray sm:text-lg">
            Find a sublease or post yours for fellow Vols
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-ink/10 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("browse")}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "browse"
                  ? "bg-ut-orange text-white"
                  : "text-smokey-gray hover:text-ink"
              }`}
            >
              <Search size={16} />
              Browse
            </button>
            <button
              onClick={() => setActiveTab("post")}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "post"
                  ? "bg-ut-orange text-white"
                  : "text-smokey-gray hover:text-ink"
              }`}
            >
              <Plus size={16} />
              Post a Sublease
            </button>
          </div>
        </div>

        {/* ═══════════════════ BROWSE TAB ═══════════════════ */}
        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div className="mb-6 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <SlidersHorizontal size={16} className="text-smokey-light" />
                Filters
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  value={filterApartment}
                  onChange={(e) => setFilterApartment(e.target.value === "" ? "" : Number(e.target.value))}
                  className="rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                >
                  <option value="">All Apartments</option>
                  {APARTMENTS.map((apt, idx) => (
                    <option key={idx} value={idx}>{apt.name}</option>
                  ))}
                </select>

                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-ink/10 bg-cream py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                  />
                </div>

                <input
                  type="date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  title="Available from"
                  className="rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                />

                <input
                  type="date"
                  value={filterUntil}
                  onChange={(e) => setFilterUntil(e.target.value)}
                  title="Available until"
                  className="rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-smokey-light" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg border border-ink/10 bg-cream px-3 py-1.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Lowest Price</option>
                    <option value="soonest">Soonest Available</option>
                  </select>
                </div>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-ut-orange hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Count */}
            {!loading && !error && (
              <p className="mb-4 text-sm text-smokey-gray">
                Showing <span className="font-semibold text-ink">{filtered.length}</span> sublease{filtered.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-ut-orange" />
                <p className="mt-3 text-sm text-smokey-gray">Loading subleases…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
                <p className="font-semibold text-ink">{error}</p>
                <button
                  onClick={fetchSubleases}
                  className="mt-3 text-sm font-semibold text-ut-orange hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <div className="rounded-2xl border border-ink/5 bg-white py-16 text-center shadow-sm">
                <Building2 size={40} className="mx-auto mb-3 text-smokey-light/50" />
                <p className="font-semibold text-smokey-gray">No subleases posted yet.</p>
                <p className="mt-1 text-sm text-smokey-light">
                  Be the first!{" "}
                  <button
                    onClick={() => setActiveTab("post")}
                    className="font-semibold text-ut-orange hover:underline"
                  >
                    Post a sublease
                  </button>
                </p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => {
                  const apt = APARTMENTS[s.apartment_index];
                  const posterName =
                    s.profiles && typeof s.profiles === "object" && "first_name" in s.profiles
                      ? (s.profiles as { first_name: string }).first_name
                      : "Someone";
                  return (
                    <div
                      key={s.id}
                      className="flex flex-col justify-between rounded-2xl border border-ink/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div>
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <Link
                            href={`/apartments/${s.apartment_index}`}
                            className="text-base font-bold text-ink hover:text-ut-orange transition-colors"
                          >
                            {apt?.name ?? "Unknown Apartment"}
                            <ExternalLink size={12} className="ml-1 inline -translate-y-0.5" />
                          </Link>
                          <span className="shrink-0 rounded-lg bg-ut-orange/10 px-2.5 py-1 text-sm font-bold text-ut-orange">
                            ${s.price.toLocaleString()}/mo
                          </span>
                        </div>

                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-smokey-gray">
                          <span className="flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 font-medium">
                            <BedDouble size={12} />
                            {s.bed_type}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 font-medium">
                            <Calendar size={12} />
                            {formatMonthYear(s.available_from)} — {formatMonthYear(s.available_until)}
                          </span>
                        </div>

                        <p className="mb-4 text-sm leading-relaxed text-smokey-gray line-clamp-3">
                          {s.description}
                        </p>
                      </div>

                      <div className="border-t border-ink/5 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-smokey-light">
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              Posted by {posterName} · {formatFullDate(s.created_at.slice(0, 10))}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`mailto:${s.contact_email}`}
                          className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-ut-orange hover:underline"
                        >
                          <Mail size={14} />
                          {s.contact_email}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ POST TAB ═══════════════════ */}
        {activeTab === "post" && (
          <div>
            {!user ? (
              <div className="mx-auto max-w-lg rounded-2xl border border-ink/5 bg-white p-10 text-center shadow-sm">
                <User size={40} className="mx-auto mb-3 text-smokey-light/50" />
                <h2 className="text-lg font-semibold text-ink">Sign in to post a sublease</h2>
                <p className="mt-1 text-sm text-smokey-gray">
                  You need an account to list your sublease for other students.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-5 rounded-xl bg-ut-orange px-8 py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Post form */}
                <div className="mx-auto max-w-xl">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ut-orange/10">
                      <Plus size={24} className="text-ut-orange" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-ink sm:text-3xl"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Post a Sublease
                    </h2>
                    <p className="mt-2 text-sm text-smokey-gray">
                      Fill out the details and connect with fellow Vols
                    </p>
                  </div>

                  {submitSuccess ? (
                    <div className="rounded-2xl border border-success/20 bg-success/5 p-8 text-center">
                      <CheckCircle2 size={48} className="mx-auto mb-3 text-success" />
                      <h3 className="text-lg font-semibold text-ink">Sublease posted!</h3>
                      <p className="mt-1 text-sm text-smokey-gray">
                        Your listing is now live. Redirecting to Browse…
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm sm:p-8"
                    >
                      {submitError && (
                        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          <AlertCircle size={16} className="shrink-0" />
                          {submitError}
                        </div>
                      )}

                      {/* Apartment */}
                      <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-semibold text-ink">
                          Apartment <span className="text-red-400">*</span>
                        </label>
                        <select
                          required
                          value={formApartment}
                          onChange={(e) => setFormApartment(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                        >
                          <option value="">Select an apartment…</option>
                          {APARTMENTS.map((apt, idx) => (
                            <option key={idx} value={idx}>{apt.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Bed type */}
                      <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-semibold text-ink">
                          Bed Type <span className="text-red-400">*</span>
                        </label>
                        <select
                          required
                          value={formBedType}
                          onChange={(e) => setFormBedType(e.target.value)}
                          className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                        >
                          <option value="">Select bed type…</option>
                          {BED_TYPES.map((bt) => (
                            <option key={bt} value={bt}>{bt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Price */}
                      <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-semibold text-ink">
                          Monthly Price <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                          <input
                            type="number"
                            required
                            min={1}
                            placeholder="e.g. 1200"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                            className="w-full rounded-xl border border-ink/10 bg-cream py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                          />
                        </div>
                      </div>

                      {/* Date range */}
                      <div className="mb-5 grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-ink">
                            Available From <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formFrom}
                            onChange={(e) => setFormFrom(e.target.value)}
                            className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-ink">
                            Available Until <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formUntil}
                            onChange={(e) => setFormUntil(e.target.value)}
                            className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-semibold text-ink">
                          Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Describe your sublease — why you're leaving, what's included, move-in details..."
                          className="w-full resize-none rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                        />
                      </div>

                      {/* Contact email */}
                      <div className="mb-6">
                        <label className="mb-1.5 block text-sm font-semibold text-ink">
                          Contact Email <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
                          <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="w-full rounded-xl border border-ink/10 bg-cream py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ut-orange py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Posting…
                          </>
                        ) : (
                          "Post Sublease"
                        )}
                      </button>
                    </form>
                  )}

                  {/* My Listings */}
                  {user && (
                    <div className="mt-12">
                      <h3
                        className="mb-4 text-xl font-bold text-ink"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        My Listings
                      </h3>

                      {loadingMine ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 size={24} className="animate-spin text-ut-orange" />
                        </div>
                      ) : myListings.length === 0 ? (
                        <div className="rounded-2xl border border-ink/5 bg-white py-10 text-center shadow-sm">
                          <p className="text-sm text-smokey-light">You haven&apos;t posted any subleases yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {myListings.map((listing) => {
                            const apt = APARTMENTS[listing.apartment_index];
                            return (
                              <div
                                key={listing.id}
                                className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                                  listing.active ? "border-ink/5" : "border-ink/5 opacity-50"
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold text-ink">
                                    {apt?.name ?? "Unknown"}{" "}
                                    <span className="text-sm font-normal text-smokey-gray">
                                      · {listing.bed_type} · ${listing.price.toLocaleString()}/mo
                                    </span>
                                  </p>
                                  <p className="mt-0.5 text-xs text-smokey-light">
                                    {formatMonthYear(listing.available_from)} — {formatMonthYear(listing.available_until)}
                                    {!listing.active && (
                                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">
                                        <XCircle size={10} />
                                        Deactivated
                                      </span>
                                    )}
                                  </p>
                                </div>
                                {listing.active && (
                                  <button
                                    onClick={() => handleDeactivate(listing.id)}
                                    disabled={deactivating === listing.id}
                                    className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                                  >
                                    {deactivating === listing.id ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      "Deactivate"
                                    )}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
