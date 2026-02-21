"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  Tag,
  SlidersHorizontal,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { APARTMENTS } from "@/data/apartments";
import FavoriteButton from "@/components/FavoriteButton";

type SortOption = "closest" | "price" | "rating" | "az";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "closest", label: "Closest First" },
  { value: "price", label: "Lowest Price" },
  { value: "rating", label: "Highest Rated" },
  { value: "az", label: "A–Z" },
];

const BED_FILTERS = ["Studio", "1 Bed", "2 Bed", "3 Bed", "4+"];

const AMENITY_FILTERS = ["Pool", "Gym", "Pet Friendly", "Furnished", "Study Room"];

function matchesBedFilter(
  bedTypes: { beds: string }[],
  filter: string
): boolean {
  if (filter === "4+") {
    return bedTypes.some((bt) => {
      const num = parseInt(bt.beds);
      return !isNaN(num) && num >= 4;
    });
  }
  return bedTypes.some((bt) => bt.beds === filter);
}

function matchesAmenityFilter(amenities: string[], filter: string): boolean {
  const lower = filter.toLowerCase();
  return amenities.some((a) => a.toLowerCase().includes(lower));
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
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

export default function ExplorePage() {
  const [sort, setSort] = useState<SortOption>("closest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleBed = (bed: string) =>
    setSelectedBeds((prev) =>
      prev.includes(bed) ? prev.filter((b) => b !== bed) : [...prev, bed]
    );

  const toggleAmenity = (amenity: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedBeds([]);
    setSelectedAmenities([]);
  };

  const hasActiveFilters =
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedBeds.length > 0 ||
    selectedAmenities.length > 0;

  const filtered = useMemo(() => {
    const indexed = APARTMENTS.map((apt, i) => ({ apartment: apt, index: i }));

    return indexed
      .filter(({ apartment }) => {
        const lowestPrice = Math.min(...apartment.bedTypes.map((bt) => bt.price));
        const highestPrice = Math.max(...apartment.bedTypes.map((bt) => bt.price));

        if (minPrice && highestPrice < Number(minPrice)) return false;
        if (maxPrice && lowestPrice > Number(maxPrice)) return false;

        if (
          selectedBeds.length > 0 &&
          !selectedBeds.some((bed) => matchesBedFilter(apartment.bedTypes, bed))
        )
          return false;

        if (
          selectedAmenities.length > 0 &&
          !selectedAmenities.every((amenity) =>
            matchesAmenityFilter(apartment.amenities, amenity)
          )
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "closest":
            return a.apartment.distanceMiles - b.apartment.distanceMiles;
          case "price": {
            const aMin = Math.min(...a.apartment.bedTypes.map((bt) => bt.price));
            const bMin = Math.min(...b.apartment.bedTypes.map((bt) => bt.price));
            return aMin - bMin;
          }
          case "rating":
            return b.apartment.rating - a.apartment.rating;
          case "az":
            return a.apartment.name.localeCompare(b.apartment.name);
        }
      });
  }, [sort, minPrice, maxPrice, selectedBeds, selectedAmenities]);

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore All Apartments
          </h1>
          <p className="mt-3 text-base text-smokey-gray sm:text-lg">
            Browse all{" "}
            <span className="font-semibold text-ut-orange">
              {APARTMENTS.length}
            </span>{" "}
            UT Knoxville student apartments
          </p>
        </div>

        {/* Filter/Sort Bar */}
        <div className="mb-6 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm sm:p-5">
          {/* Top row: sort + toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="text-sm font-medium text-smokey-gray"
              >
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none rounded-xl border border-ink/10 bg-cream py-2 pl-3 pr-9 text-sm font-medium text-ink outline-none transition-colors focus:border-ut-orange"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-smokey-light"
                />
              </div>
            </div>

            {/* Filter toggle + clear */}
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-smokey-gray transition-colors hover:text-ut-orange"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
              <button
                onClick={() => setFiltersOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                  filtersOpen || hasActiveFilters
                    ? "border-ut-orange bg-ut-orange/5 text-ut-orange"
                    : "border-ink/10 text-smokey-gray hover:border-ut-orange hover:text-ut-orange"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ut-orange text-xs font-bold text-white">
                    {selectedBeds.length + selectedAmenities.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable filters */}
          {filtersOpen && (
            <div className="mt-5 space-y-5 border-t border-ink/5 pt-5">
              {/* Price range */}
              <div>
                <h3 className="mb-2.5 text-sm font-semibold text-ink">
                  Price Range (per person/mo)
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-smokey-light">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-28 rounded-xl border border-ink/10 bg-cream py-2 pl-7 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-smokey-light focus:border-ut-orange"
                    />
                  </div>
                  <span className="text-sm text-smokey-light">to</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-smokey-light">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-28 rounded-xl border border-ink/10 bg-cream py-2 pl-7 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-smokey-light focus:border-ut-orange"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="mb-2.5 text-sm font-semibold text-ink">
                  Bedrooms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {BED_FILTERS.map((bed) => (
                    <button
                      key={bed}
                      onClick={() => toggleBed(bed)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedBeds.includes(bed)
                          ? "border-ut-orange bg-ut-orange text-white"
                          : "border-ink/10 text-smokey-gray hover:border-ut-orange hover:text-ut-orange"
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="mb-2.5 text-sm font-semibold text-ink">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_FILTERS.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? "border-ut-orange bg-ut-orange text-white"
                          : "border-ink/10 text-smokey-gray hover:border-ut-orange hover:text-ut-orange"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="mb-5 text-sm text-smokey-gray">
          Showing{" "}
          <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
          {APARTMENTS.length} apartments
        </p>

        {/* Apartment grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ apartment, index }) => {
              const startingPrice = Math.min(
                ...apartment.bedTypes.map((bt) => bt.price)
              );

              return (
                <Link
                  key={index}
                  href={`/apartments/${index}`}
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
                    {/* Distance badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm">
                      <MapPin size={12} className="text-ut-orange" />
                      {apartment.distanceMiles} mi
                    </div>
                    {/* Favorite */}
                    <div className="absolute right-3 top-3">
                      <FavoriteButton apartmentIndex={index} size={18} className="shadow-md" />
                    </div>
                    {/* Special badge */}
                    {apartment.special && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                        <Tag size={12} />
                        Special Offer
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h2
                      className="text-xl font-bold text-ink"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {apartment.name}
                    </h2>
                    <p className="mt-1 text-sm text-smokey-gray">
                      {apartment.tagline}
                    </p>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <StarRating rating={apartment.rating} />
                      <span className="text-sm font-medium text-ink">
                        {apartment.rating}
                      </span>
                      <span className="text-xs text-smokey-light">
                        ({apartment.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3">
                      <span className="text-sm text-smokey-light">From </span>
                      <span className="text-2xl font-bold text-ink">
                        ${startingPrice}
                      </span>
                      <span className="text-sm text-smokey-gray">/mo</span>
                    </div>

                    {/* Amenity tags */}
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

                    {/* Special offer text */}
                    {apartment.special && (
                      <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-xs font-medium text-success">
                        {apartment.special}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink/5">
              <Search size={28} className="text-smokey-light" />
            </div>
            <h3
              className="text-xl font-bold text-ink"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No apartments found
            </h3>
            <p className="mt-2 text-sm text-smokey-gray">
              Try adjusting your filters to see more results.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 inline-block rounded-xl bg-ut-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
