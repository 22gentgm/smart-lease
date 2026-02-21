"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowLeft, Tag, Sparkles, Heart } from "lucide-react";
import { computeMatches } from "@/lib/matching";
import SelectButton from "@/components/SelectButton";
import FavoriteButton from "@/components/FavoriteButton";

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-ut-orange text-ut-orange"
              : "fill-none text-smokey-light"
          }
        />
      ))}
    </span>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const matches = computeMatches(searchParams);
  const name = searchParams.get("name");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const loadFavorites = useCallback(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("smartlease_favorites") || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favorites-changed", loadFavorites);
    return () => window.removeEventListener("favorites-changed", loadFavorites);
  }, [loadFavorites]);

  const displayed = showFavoritesOnly
    ? matches.filter((m) => favorites.includes(m.index))
    : matches;

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {name ? `${name}'s Top Matches` : "Your Top Matches"}
          </h1>
          <p className="mt-3 text-base text-smokey-gray sm:text-lg">
            We found{" "}
            <span className="font-semibold text-ut-orange">{matches.length}</span>{" "}
            apartments that match your preferences
          </p>
          <Link
            href="/quiz"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-smokey-gray transition-colors hover:text-ut-orange"
          >
            <ArrowLeft size={14} />
            Retake Quiz
          </Link>
        </div>

        {/* Favorites Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-smokey-gray">
            Showing{" "}
            <span className="font-semibold text-ink">{displayed.length}</span>{" "}
            {showFavoritesOnly ? "favorited" : ""} apartments
          </p>
          <button
            onClick={() => setShowFavoritesOnly((prev) => !prev)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              showFavoritesOnly
                ? "border-red-300 bg-red-50 text-red-500"
                : "border-ink/10 text-smokey-gray hover:border-red-300 hover:text-red-400"
            }`}
          >
            <Heart
              size={16}
              className={showFavoritesOnly ? "fill-red-500" : "fill-none"}
            />
            Favorites
            {favorites.length > 0 && (
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${
                  showFavoritesOnly ? "bg-red-500" : "bg-smokey-light"
                }`}
              >
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map(({ apartment, index, score, matchedBedType }) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={apartment.images[0]}
                  alt={apartment.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Match Badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-ut-orange px-3 py-1.5 text-sm font-bold text-white shadow-md">
                  <Sparkles size={14} />
                  {score}% Match
                </div>
                {/* Favorite Button */}
                <div className="absolute right-3 top-3">
                  <FavoriteButton apartmentIndex={index} size={18} className="shadow-md" />
                </div>
                {/* Special Badge */}
                {apartment.special && (
                  <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                    <Tag size={12} />
                    Special Offer
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h2
                  className="text-xl font-bold text-ink"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {apartment.name}
                </h2>
                <p className="mt-1 text-sm text-smokey-gray">{apartment.tagline}</p>

                {/* Rating & Distance */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={apartment.rating} />
                    <span className="text-xs text-smokey-gray">
                      ({apartment.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-smokey-gray">
                    <MapPin size={12} />
                    {apartment.distanceMiles} mi
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4">
                  <span className="text-2xl font-bold text-ink">
                    ${matchedBedType.price}
                  </span>
                  <span className="text-sm text-smokey-gray">/mo</span>
                  <span className="ml-2 text-xs text-smokey-light">
                    {matchedBedType.beds} / {matchedBedType.baths} Ba
                  </span>
                </div>

                {/* Amenity Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {apartment.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-smokey-gray"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Special Offer */}
                {apartment.special && (
                  <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
                    {apartment.special}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-2 pt-5">
                  <Link
                    href={`/apartments/${index}`}
                    className="flex-1 rounded-xl bg-ut-orange px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-ut-orange-light"
                  >
                    View Details
                  </Link>
                  <SelectButton
                    apartmentName={apartment.name}
                    price={matchedBedType.price}
                    matchScore={score}
                    bedrooms={matchedBedType.beds}
                    distance={apartment.distanceMiles}
                    variant="outline"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayed.length === 0 && (
          <div className="py-20 text-center">
            {showFavoritesOnly ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <Heart size={28} className="text-red-300" />
                </div>
                <p className="text-lg font-semibold text-ink">No favorites yet</p>
                <p className="mt-2 text-sm text-smokey-gray">
                  Tap the heart icon on apartments you like to save them here.
                </p>
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="mt-5 inline-block rounded-xl bg-ut-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light cursor-pointer"
                >
                  View All Matches
                </button>
              </>
            ) : (
              <>
                <p className="text-lg text-smokey-gray">
                  No matches found. Try adjusting your preferences.
                </p>
                <Link
                  href="/quiz"
                  className="mt-4 inline-block rounded-xl bg-ut-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light"
                >
                  Retake Quiz
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-ut-orange border-t-transparent" />
            <p className="mt-4 text-smokey-gray">Finding your matches...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
