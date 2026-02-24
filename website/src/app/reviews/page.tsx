"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  Search,
  ChevronDown,
  MessageSquarePlus,
  CheckCircle2,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { APARTMENTS } from "@/data/apartments";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ReviewItem {
  id: string;
  apartmentIndex: number;
  stars: number;
  text: string;
  author: string;
  classYear: string;
  createdAt: string;
  isSeed?: boolean;
}

function buildSeedReviews(): ReviewItem[] {
  return APARTMENTS.map((apt, idx) => ({
    id: `seed-${idx}`,
    apartmentIndex: idx,
    stars: apt.review.stars,
    text: apt.review.quote,
    author: apt.review.author,
    classYear: apt.review.classYear,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    isSeed: true,
  }));
}

function StarRating({
  rating,
  size = 16,
  interactive,
  onRate,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (star: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = interactive
          ? i < (hovered || rating)
          : i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={`${filled ? "fill-ut-orange text-ut-orange" : "fill-none text-smokey-light"} ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
            onMouseEnter={interactive ? () => setHovered(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
          />
        );
      })}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReviewsPage() {
  const [supabaseReviews, setSupabaseReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null,
  );
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formApartment, setFormApartment] = useState<number | null>(null);
  const [formStars, setFormStars] = useState(0);
  const [formAuthor, setFormAuthor] = useState("");
  const [formClassYear, setFormClassYear] = useState("");
  const [formText, setFormText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchErr } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      const mapped: ReviewItem[] = (data ?? []).map((r) => ({
        id: r.id,
        apartmentIndex: r.apartment_index,
        stars: r.stars,
        text: r.text,
        author: r.author_name,
        classYear: r.class_year,
        createdAt: r.created_at,
      }));

      setSupabaseReviews(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const allReviews = useMemo(() => {
    const seed = buildSeedReviews();
    return [...supabaseReviews, ...seed].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [supabaseReviews]);

  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      if (selectedApartment !== null && r.apartmentIndex !== selectedApartment)
        return false;
      if (starFilter !== null && r.stars !== starFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const aptName =
          APARTMENTS[r.apartmentIndex]?.name.toLowerCase() ?? "";
        return (
          aptName.includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allReviews, selectedApartment, starFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = allReviews.length;
    const avg =
      total > 0
        ? allReviews.reduce((sum, r) => sum + r.stars, 0) / total
        : 0;
    const distribution = [0, 0, 0, 0, 0];
    allReviews.forEach((r) => {
      distribution[r.stars - 1]++;
    });
    return { total, avg, distribution };
  }, [allReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      formApartment === null ||
      formStars === 0 ||
      !formText.trim() ||
      !formAuthor.trim() ||
      !formClassYear.trim()
    )
      return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const { error: insertErr } = await supabase.from("reviews").insert({
        apartment_index: formApartment,
        stars: formStars,
        text: formText.trim(),
        author_name: formAuthor.trim(),
        class_year: formClassYear.trim(),
      });

      if (insertErr) throw insertErr;

      setSubmitted(true);
      setFormApartment(null);
      setFormStars(0);
      setFormAuthor("");
      setFormClassYear("");
      setFormText("");

      await fetchReviews();

      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const hasActiveFilters =
    selectedApartment !== null || starFilter !== null || searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Verified Reviews
          </h1>
          <p className="mt-3 text-base text-smokey-gray sm:text-lg">
            Honest reviews from real UT student tenants
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-ut-orange" />
            <p className="mt-4 text-sm text-smokey-gray">Loading reviews…</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                <AlertCircle size={20} className="shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
                <span className="text-4xl font-bold text-ink">
                  {stats.avg.toFixed(1)}
                </span>
                <StarRating rating={stats.avg} size={20} />
                <span className="mt-1 text-sm text-smokey-light">
                  Average Rating
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
                <span className="text-4xl font-bold text-ink">
                  {stats.total}
                </span>
                <span className="mt-1 text-sm text-smokey-light">
                  Total Reviews
                </span>
              </div>
              <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-ink">
                  Rating Distribution
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.distribution[star - 1];
                    const pct =
                      stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-4 text-right text-smokey-gray">
                          {star}
                        </span>
                        <Star
                          size={12}
                          className="shrink-0 fill-ut-orange text-ut-orange"
                        />
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                          <div
                            className="h-full rounded-full bg-ut-orange transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs text-smokey-light">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light"
                  />
                  <input
                    type="text"
                    placeholder="Search reviews…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-ink/10 bg-cream py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                  />
                </div>

                {/* Apartment dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink sm:w-56"
                  >
                    <Filter
                      size={16}
                      className="shrink-0 text-smokey-light"
                    />
                    <span className="truncate">
                      {selectedApartment !== null
                        ? APARTMENTS[selectedApartment].name
                        : "All Apartments"}
                    </span>
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-smokey-light"
                    />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-ink/5 bg-white py-1 shadow-lg sm:w-56">
                      <button
                        onClick={() => {
                          setSelectedApartment(null);
                          setShowDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-cream ${selectedApartment === null ? "font-semibold text-ut-orange" : "text-ink"}`}
                      >
                        All Apartments
                      </button>
                      {APARTMENTS.map((apt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedApartment(idx);
                            setShowDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-cream ${selectedApartment === idx ? "font-semibold text-ut-orange" : "text-ink"}`}
                        >
                          {apt.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Star filter */}
                <div className="flex items-center gap-1.5">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setStarFilter(starFilter === s ? null : s)
                      }
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        starFilter === s
                          ? "bg-ut-orange text-white"
                          : "border border-ink/10 bg-cream text-smokey-gray hover:border-ut-orange hover:text-ut-orange"
                      }`}
                    >
                      {s}
                      <Star
                        size={12}
                        className={
                          starFilter === s
                            ? "fill-white text-white"
                            : "fill-ut-orange text-ut-orange"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Count + Clear */}
            <div className="mb-6 flex items-center justify-between">
              <h2
                className="text-xl font-bold text-ink sm:text-2xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {filteredReviews.length} Review
                {filteredReviews.length !== 1 ? "s" : ""}
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedApartment(null);
                    setStarFilter(null);
                    setSearchQuery("");
                  }}
                  className="text-sm font-semibold text-ut-orange hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length === 0 ? (
              <div className="rounded-2xl border border-ink/5 bg-white py-16 text-center shadow-sm">
                <MessageSquarePlus
                  size={40}
                  className="mx-auto mb-3 text-smokey-light/50"
                />
                <p className="font-semibold text-smokey-gray">
                  No reviews match your filters
                </p>
                <p className="mt-1 text-sm text-smokey-light">
                  Try adjusting your search or be the first to share your
                  experience below!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredReviews.map((review) => {
                  const apt = APARTMENTS[review.apartmentIndex];
                  return (
                    <div
                      key={review.id}
                      className="flex flex-col justify-between rounded-2xl border border-ink/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <StarRating rating={review.stars} size={16} />
                          <span className="text-xs text-smokey-light">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="mb-4 text-sm leading-relaxed text-smokey-gray">
                          &ldquo;{review.text}&rdquo;
                        </p>
                      </div>
                      <div className="border-t border-ink/5 pt-3">
                        <p className="text-sm font-semibold text-ink">
                          {review.author}
                        </p>
                        <p className="text-xs text-smokey-light">
                          {review.classYear}
                        </p>
                        <Link
                          href={`/apartments/${review.apartmentIndex}`}
                          className="mt-1 inline-block text-xs font-semibold text-ut-orange hover:underline"
                        >
                          {apt?.name ?? "Unknown"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Write a Review */}
            <div className="mt-16">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ut-orange/10">
                  <MessageSquarePlus size={24} className="text-ut-orange" />
                </div>
                <h2
                  className="text-2xl font-bold text-ink sm:text-3xl"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Write a Review
                </h2>
                <p className="mt-2 text-sm text-smokey-gray">
                  Share your experience to help fellow Vols find their perfect
                  home
                </p>
              </div>

              {submitted ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-success/20 bg-success/5 p-8 text-center">
                  <CheckCircle2
                    size={48}
                    className="mx-auto mb-3 text-success"
                  />
                  <h3 className="text-lg font-semibold text-ink">
                    Thanks for your review!
                  </h3>
                  <p className="mt-1 text-sm text-smokey-gray">
                    Your feedback helps other UT students make better housing
                    decisions.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-xl rounded-2xl border border-ink/5 bg-white p-6 shadow-sm sm:p-8"
                >
                  {submitError && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <AlertCircle
                        size={18}
                        className="shrink-0 text-red-500"
                      />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}

                  {/* Apartment selector */}
                  <div className="mb-5">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Apartment
                    </label>
                    <select
                      value={formApartment ?? ""}
                      onChange={(e) =>
                        setFormApartment(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                    >
                      <option value="">Select an apartment…</option>
                      {APARTMENTS.map((apt, idx) => (
                        <option key={idx} value={idx}>
                          {apt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Star rating */}
                  <div className="mb-5">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={formStars}
                        size={28}
                        interactive
                        onRate={setFormStars}
                      />
                      {formStars > 0 && (
                        <span className="text-sm text-smokey-light">
                          {formStars} star{formStars !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Author name */}
                  <div className="mb-5">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Sarah M."
                      className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                    />
                  </div>

                  {/* Class year */}
                  <div className="mb-5">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Class Year
                    </label>
                    <input
                      type="text"
                      value={formClassYear}
                      onChange={(e) => setFormClassYear(e.target.value)}
                      placeholder="e.g. Class of 2027"
                      className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                    />
                  </div>

                  {/* Review text */}
                  <div className="mb-6">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Your Review
                    </label>
                    <textarea
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      rows={4}
                      placeholder="What was your experience like? Mention location, amenities, management, noise level…"
                      className="w-full resize-none rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      formApartment === null ||
                      formStars === 0 ||
                      !formText.trim() ||
                      !formAuthor.trim() ||
                      !formClassYear.trim()
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-ut-orange py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting && (
                      <Loader2 size={18} className="animate-spin" />
                    )}
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
