"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Star, Search, ChevronDown, MessageSquarePlus, CheckCircle2, Filter } from "lucide-react";
import { APARTMENTS } from "@/data/apartments";

interface MockReview {
  apartmentIndex: number;
  stars: number;
  text: string;
  author: string;
  classYear: string;
  date: string;
}

const MOCK_REVIEWS: MockReview[] = [];

function StarRating({ rating, size = 16, interactive, onRate }: {
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
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formApartment, setFormApartment] = useState<number | null>(null);
  const [formStars, setFormStars] = useState(0);
  const [formText, setFormText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const allReviews = useMemo(() => {
    return [...MOCK_REVIEWS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      if (selectedApartment !== null && r.apartmentIndex !== selectedApartment) return false;
      if (starFilter !== null && r.stars !== starFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const aptName = APARTMENTS[r.apartmentIndex]?.name.toLowerCase() ?? "";
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
    const avg = total > 0 ? allReviews.reduce((sum, r) => sum + r.stars, 0) / total : 0;
    const distribution = [0, 0, 0, 0, 0];
    allReviews.forEach((r) => {
      distribution[r.stars - 1]++;
    });
    return { total, avg, distribution };
  }, [allReviews]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formApartment === null || formStars === 0 || !formText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormApartment(null);
      setFormStars(0);
      setFormText("");
    }, 3000);
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
            Verified Reviews
          </h1>
          <p className="mt-3 text-base text-smokey-gray sm:text-lg">
            Honest reviews from real UT student tenants
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-smokey-light" />
              <input
                type="text"
                placeholder="Search reviews..."
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
                <Filter size={16} className="shrink-0 text-smokey-light" />
                <span className="truncate">
                  {selectedApartment !== null ? APARTMENTS[selectedApartment].name : "All Apartments"}
                </span>
                <ChevronDown size={16} className="shrink-0 text-smokey-light" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 z-20 mt-1 w-full rounded-xl border border-ink/5 bg-white py-1 shadow-lg sm:w-56">
                  <button
                    onClick={() => { setSelectedApartment(null); setShowDropdown(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-cream ${selectedApartment === null ? "font-semibold text-ut-orange" : "text-ink"}`}
                  >
                    All Apartments
                  </button>
                  {APARTMENTS.map((apt, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedApartment(idx); setShowDropdown(false); }}
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
                  onClick={() => setStarFilter(starFilter === s ? null : s)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    starFilter === s
                      ? "bg-ut-orange text-white"
                      : "border border-ink/10 bg-cream text-smokey-gray hover:border-ut-orange hover:text-ut-orange"
                  }`}
                >
                  {s}
                  <Star size={12} className={starFilter === s ? "fill-white text-white" : "fill-ut-orange text-ut-orange"} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
            <span className="text-4xl font-bold text-ink">{stats.avg.toFixed(1)}</span>
            <StarRating rating={stats.avg} size={20} />
            <span className="mt-1 text-sm text-smokey-light">Average Rating</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
            <span className="text-4xl font-bold text-ink">{stats.total}</span>
            <span className="mt-1 text-sm text-smokey-light">Total Reviews</span>
          </div>
          <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-ink">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star - 1];
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-right text-smokey-gray">{star}</span>
                    <Star size={12} className="shrink-0 fill-ut-orange text-ut-orange" />
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream">
                      <div
                        className="h-full rounded-full bg-ut-orange transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-smokey-light">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-xl font-bold text-ink sm:text-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {filteredReviews.length} Review{filteredReviews.length !== 1 ? "s" : ""}
          </h2>
          {(selectedApartment !== null || starFilter !== null || searchQuery) && (
            <button
              onClick={() => { setSelectedApartment(null); setStarFilter(null); setSearchQuery(""); }}
              className="text-sm font-semibold text-ut-orange hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <div className="rounded-2xl border border-ink/5 bg-white py-16 text-center shadow-sm">
            <MessageSquarePlus size={40} className="mx-auto mb-3 text-smokey-light/50" />
            <p className="text-smokey-gray font-semibold">No reviews yet</p>
            <p className="mt-1 text-sm text-smokey-light">Be the first to share your experience below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review, idx) => {
              const apt = APARTMENTS[review.apartmentIndex];
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-ink/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <StarRating rating={review.stars} size={16} />
                      <span className="text-xs text-smokey-light">{formatDate(review.date)}</span>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-smokey-gray">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                  <div className="border-t border-ink/5 pt-3">
                    <p className="text-sm font-semibold text-ink">{review.author}</p>
                    <p className="text-xs text-smokey-light">{review.classYear}</p>
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
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Write a Review
            </h2>
            <p className="mt-2 text-sm text-smokey-gray">
              Share your experience to help fellow Vols find their perfect home
            </p>
          </div>

          {submitted ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-success/20 bg-success/5 p-8 text-center">
              <CheckCircle2 size={48} className="mx-auto mb-3 text-success" />
              <h3 className="text-lg font-semibold text-ink">Thanks for your review!</h3>
              <p className="mt-1 text-sm text-smokey-gray">
                Your feedback helps other UT students make better housing decisions.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-xl rounded-2xl border border-ink/5 bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Apartment selector */}
              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  Apartment
                </label>
                <select
                  value={formApartment ?? ""}
                  onChange={(e) => setFormApartment(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                >
                  <option value="">Select an apartment...</option>
                  {APARTMENTS.map((apt, idx) => (
                    <option key={idx} value={idx}>{apt.name}</option>
                  ))}
                </select>
              </div>

              {/* Star rating */}
              <div className="mb-5">
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  Rating
                </label>
                <StarRating rating={formStars} size={28} interactive onRate={setFormStars} />
                {formStars > 0 && (
                  <span className="ml-2 text-sm text-smokey-light">
                    {formStars} star{formStars !== 1 ? "s" : ""}
                  </span>
                )}
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
                  placeholder="What was your experience like? Mention location, amenities, management, noise level..."
                  className="w-full resize-none rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-smokey-light focus:border-ut-orange focus:outline-none focus:ring-1 focus:ring-ut-orange"
                />
              </div>

              <button
                type="submit"
                disabled={formApartment === null || formStars === 0 || !formText.trim()}
                className="w-full rounded-xl bg-ut-orange py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
