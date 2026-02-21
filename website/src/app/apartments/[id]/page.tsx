import Link from "next/link";
import Image from "next/image";
import { APARTMENTS } from "@/data/apartments";
import SelectButton from "@/components/SelectButton";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  MapPin,
  Car,
  Tag,
  Quote,
  Dumbbell,
  Waves,
  Sofa,
  Dog,
  Bike,
  Zap,
  Coffee,
  Gamepad2,
  Shirt,
  Sun,
  Trees,
  Music,
  Package,
  Wrench,
  Clapperboard,
  BookOpen,
  Flame,
  ShowerHead,
  Sparkles,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  Pool: Waves,
  "Infinity Pool": Waves,
  "Lazy River": Waves,
  Gym: Dumbbell,
  "Fitness Center": Dumbbell,
  "Yoga Studio": Dumbbell,
  "Pet Friendly": Dog,
  "Pet Spa": Dog,
  "Dog Park": Dog,
  "Bike Storage": Bike,
  "Bike Racks": Bike,
  "EV Charging": Zap,
  "Coffee Bar": Coffee,
  "Game Room": Gamepad2,
  "Gaming Lounge": Gamepad2,
  "DJ Booth": Music,
  Tanning: Sun,
  "Tanning Beds": Sun,
  "Hammock Garden": Trees,
  "Trail Access": Trees,
  Furnished: Sofa,
  "Dry Cleaning": Shirt,
  "Package Lockers": Package,
  "Package Room": Package,
  "On-Site Maintenance": Wrench,
  "Theater Room": Clapperboard,
  "Study Lounge": BookOpen,
  "Study Rooms": BookOpen,
  "Study Room": BookOpen,
  "Coworking Space": BookOpen,
  "Fire Pit": Flame,
  "Grilling Area": Flame,
  "Grilling Stations": Flame,
  Sauna: ShowerHead,
  "Sky Lounge": Sparkles,
  Clubhouse: Building2,
  Concierge: Sparkles,
  Courtyard: Trees,
  "Sand Volleyball": Sun,
  "Basketball Court": Gamepad2,
  "River Views": Waves,
  "Kayak Launch": Waves,
  "In-Unit Washer/Dryer": Shirt,
  "Laundry Room": Shirt,
  "Shuttle Service": Car,
  "Rooftop Deck": Sparkles,
};

function getAmenityIcon(amenity: string): LucideIcon {
  return AMENITY_ICONS[amenity] || Tag;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
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

export default async function ApartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const index = parseInt(id, 10);
  const apartment = APARTMENTS[index];

  if (!apartment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <h1
            className="text-3xl font-bold text-ink"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Apartment Not Found
          </h1>
          <p className="mt-2 text-smokey-gray">
            The apartment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/results"
            className="mt-6 inline-block rounded-xl bg-ut-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-ut-orange-light"
          >
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Back Button */}
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/results"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-smokey-gray transition-colors hover:text-ut-orange"
        >
          <ArrowLeft size={16} />
          Back to Results
        </Link>
      </div>

      {/* Hero Image */}
      <div className="mx-auto mt-4 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={apartment.images[0]}
            alt={apartment.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Name & Meta */}
        <div className="mt-8">
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {apartment.name}
          </h1>
          <p className="mt-2 text-lg text-smokey-gray">{apartment.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating rating={apartment.rating} />
              <span className="text-sm font-medium text-ink">
                {apartment.rating}
              </span>
              <span className="text-sm text-smokey-gray">
                ({apartment.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-smokey-gray shadow-sm">
              <MapPin size={14} className="text-ut-orange" />
              {apartment.distanceMiles} miles from campus
            </div>
          </div>
        </div>

        {/* Special Offer */}
        {apartment.special && (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-success/10 p-4">
            <Tag size={20} className="mt-0.5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-bold text-success">Special Offer</p>
              <p className="mt-0.5 text-sm text-success/80">
                {apartment.special}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Floor Plans & Pricing */}
            <section>
              <h2
                className="text-2xl font-bold text-ink"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Floor Plans &amp; Pricing
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-ink/5 bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ink/5 bg-cream/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-smokey-gray">
                        Bedrooms
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-smokey-gray">
                        Bathrooms
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-smokey-gray">
                        Price/mo
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-smokey-gray">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {apartment.bedTypes.map((bed, i) => (
                      <tr
                        key={i}
                        className={`border-b border-ink/5 last:border-0 ${
                          bed.soldOut ? "bg-ink/[0.02]" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 text-sm font-medium text-ink">
                          {bed.beds}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-smokey-gray">
                          {bed.baths} Bath
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right text-sm font-semibold ${
                            bed.soldOut ? "text-smokey-light line-through" : "text-ink"
                          }`}
                        >
                          ${bed.price}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {bed.soldOut ? (
                            <span className="inline-block rounded-full bg-ink/10 px-2.5 py-1 text-xs font-semibold text-smokey-gray">
                              Sold Out
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2
                className="text-2xl font-bold text-ink"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Amenities
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {apartment.amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-sm"
                    >
                      <Icon size={18} className="shrink-0 text-ut-orange" />
                      <span className="text-sm font-medium text-ink">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Parking */}
            {apartment.parking && (
              <section>
                <h2
                  className="text-2xl font-bold text-ink"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Parking
                </h2>
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <Car size={20} className="shrink-0 text-ut-orange" />
                  <span className="text-sm font-medium text-ink">
                    {apartment.parking}
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
              <p className="text-sm text-smokey-gray">Starting from</p>
              <p className="mt-1 text-3xl font-bold text-ink">
                ${Math.min(...apartment.bedTypes.filter((b) => !b.soldOut).map((b) => b.price))}
                <span className="text-base font-normal text-smokey-gray">
                  /mo
                </span>
              </p>

              <div className="mt-5">
                <SelectButton
                  apartmentName={apartment.name}
                  price={Math.min(...apartment.bedTypes.filter((b) => !b.soldOut).map((b) => b.price))}
                  distance={apartment.distanceMiles}
                />
              </div>

              <a
                href={apartment.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 px-4 py-3 text-sm font-medium text-smokey-gray transition-colors hover:border-ut-orange hover:text-ut-orange"
              >
                <ExternalLink size={16} />
                Visit Website
              </a>

              <Link
                href="/results"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 px-4 py-3 text-sm font-medium text-smokey-gray transition-colors hover:border-ut-orange hover:text-ut-orange"
              >
                <ArrowLeft size={16} />
                Back to Results
              </Link>
            </div>

            {/* Review Card */}
            <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Quote size={20} className="text-ut-orange" />
                <h3
                  className="text-lg font-bold text-ink"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Resident Review
                </h3>
              </div>
              <div className="mt-4">
                <StarRating rating={apartment.review.stars} size={14} />
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-smokey-gray italic">
                &ldquo;{apartment.review.quote}&rdquo;
              </blockquote>
              <div className="mt-4 border-t border-ink/5 pt-3">
                <p className="text-sm font-semibold text-ink">
                  {apartment.review.author}
                </p>
                <p className="text-xs text-smokey-gray">
                  {apartment.review.classYear}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {apartment.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-ut-orange/10 px-3 py-1.5 text-xs font-medium capitalize text-ut-orange"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
