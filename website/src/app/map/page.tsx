"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Tag, ChevronDown, X } from "lucide-react";
import { APARTMENTS } from "@/data/apartments";
import FavoriteButton from "@/components/FavoriteButton";
import "leaflet/dist/leaflet.css";

const APT_COORDS: [number, number][] = [
  [35.9560, -83.9300], // Hub Knoxville
  [35.9530, -83.9350], // University Walk
  [35.9595, -83.9300], // The Knox Apartments
  [35.9555, -83.9320], // The Standard
  [35.9470, -83.9265], // Villas Knoxville
  [35.9548, -83.9350], // The Commons
  [35.9585, -83.9340], // Slate at 901
  [35.9565, -83.9280], // TENN
  [35.9578, -83.9455], // Tradition
  [35.9490, -83.9230], // 303 Flats
  [35.9488, -83.9175], // The Davy
  [35.9415, -83.9205], // The Heights
  [35.9370, -83.9250], // Knox Ridge
  [35.9340, -83.9310], // The Woodlands
  [35.9577, -83.9296], // The Mark
  [35.9540, -83.9270], // Ever
  [35.9490, -83.9255], // Livano
  [35.9440, -83.9185], // Flagship Kerns
  [35.9555, -83.9365], // Nova Knoxville
  [35.9270, -83.9245], // Quarry Trail
  [35.9541, -83.9388], // Union Knoxville
];

const UT_CAMPUS: [number, number] = [35.9544, -83.9295];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
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

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filterBed, setFilterBed] = useState("");
  const [mapReady, setMapReady] = useState(false);

  const selectedApt = selectedIndex !== null ? APARTMENTS[selectedIndex] : null;
  const availableBeds = selectedApt
    ? selectedApt.bedTypes.filter((bt) => !bt.soldOut)
    : [];
  const startingPrice = availableBeds.length > 0
    ? Math.min(...availableBeds.map((bt) => bt.price))
    : 0;

  const filteredIndices = useMemo(() => {
    if (!filterBed) return APARTMENTS.map((_, i) => i);
    return APARTMENTS.reduce<number[]>((acc, apt, i) => {
      if (
        apt.bedTypes.some(
          (bt) =>
            bt.beds === filterBed ||
            (filterBed === "4+" && parseInt(bt.beds) >= 4)
        )
      ) {
        acc.push(i);
      }
      return acc;
    }, []);
  }, [filterBed]);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([35.9460, -83.9290], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      L.circleMarker(UT_CAMPUS, {
        radius: 10,
        fillColor: "#4B4B4B",
        color: "#fff",
        weight: 2,
        fillOpacity: 0.7,
      })
        .bindTooltip("UT Campus", {
          permanent: true,
          direction: "bottom",
        })
        .addTo(map);

      leafletMap.current = map;
      markersRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !markersRef.current || !leafletMap.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      markersRef.current!.clearLayers();

      const visible = new Set(filteredIndices);

      APARTMENTS.forEach((apt, i) => {
        const coords = APT_COORDS[i];
        if (!coords) return;

        const isVisible = visible.has(i);
        const allSoldOut = apt.bedTypes.every((bt) => bt.soldOut);

        const fillColor = !isVisible
          ? "#ccc"
          : allSoldOut
            ? "#999"
            : "#FF8200";

        const marker = L.circleMarker(coords, {
          radius: 9,
          fillColor,
          color: "#fff",
          weight: 2,
          fillOpacity: isVisible ? 0.9 : 0.3,
        }).addTo(markersRef.current!);

        if (!isVisible) return;

        const available = apt.bedTypes.filter((bt) => !bt.soldOut);
        const lowestPrice =
          available.length > 0
            ? Math.min(...available.map((bt) => bt.price))
            : 0;

        marker.bindPopup(
          `<div style="font-family:'Space Grotesk',sans-serif;min-width:180px;">` +
            `<p style="font-size:15px;font-weight:600;margin:0 0 4px;">${apt.name}</p>` +
            `<p style="font-size:14px;color:${allSoldOut ? "#999" : "#FF8200"};font-weight:500;margin:0 0 4px;">${allSoldOut ? "Sold Out" : `$${lowestPrice.toLocaleString()}/mo`}</p>` +
            `<p style="font-size:12px;color:#666;margin:0 0 4px;">${apt.distanceMiles} mi · ${apt.amenities.slice(0, 3).join(", ")}</p>` +
            (apt.special
              ? `<p style="font-size:11px;color:#00b464;margin:0 0 6px;font-weight:500;">✦ ${apt.special}</p>`
              : "") +
            `</div>`,
          { maxWidth: 250 }
        );

        marker.on("click", () => setSelectedIndex(i));
      });
    })();
  }, [filteredIndices, mapReady]);

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-ut-orange mb-2">
            Interactive Map
          </p>
          <h1
            className="text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Map
          </h1>
          <p className="mt-2 text-smokey-gray">
            Tap a pin to see apartment details.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <select
              value={filterBed}
              onChange={(e) => setFilterBed(e.target.value)}
              className="appearance-none rounded-xl border border-ink/10 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-ink outline-none focus:border-ut-orange"
            >
              <option value="">All Bed Types</option>
              <option value="Studio">Studio</option>
              <option value="1 Bed">1 Bed</option>
              <option value="2 Bed">2 Bed</option>
              <option value="3 Bed">3 Bed</option>
              <option value="4+">4+ Bed</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-smokey-light"
            />
          </div>
          {filterBed && (
            <button
              onClick={() => setFilterBed("")}
              className="flex items-center gap-1 text-sm text-smokey-gray hover:text-ut-orange transition-colors cursor-pointer"
            >
              <X size={14} />
              Clear
            </button>
          )}
          <span className="ml-auto text-sm text-smokey-gray">
            {filteredIndices.length} of {APARTMENTS.length} shown
          </span>
        </div>

        {/* Map container */}
        <div
          ref={mapRef}
          className="h-[420px] sm:h-[500px] lg:h-[560px] w-full rounded-2xl overflow-hidden border border-ink/5 shadow-sm"
        />

        {/* Selected apartment card */}
        {selectedApt && selectedIndex !== null && (
          <div className="mt-5 rounded-2xl border border-ink/5 bg-white shadow-sm overflow-hidden animate-fade-in">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-56 aspect-[16/10] sm:aspect-auto shrink-0">
                <Image
                  src={selectedApt.images[0]}
                  alt={selectedApt.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 224px"
                />
                <div className="absolute right-3 top-3 sm:right-2 sm:top-2">
                  <FavoriteButton
                    apartmentIndex={selectedIndex}
                    size={16}
                    className="shadow-md"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className="text-xl font-bold text-ink"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {selectedApt.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-smokey-gray">
                      {selectedApt.tagline}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="shrink-0 rounded-lg p-1 text-smokey-light hover:text-ink transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <StarRating rating={selectedApt.rating} />
                    <span className="text-xs text-smokey-gray">
                      ({selectedApt.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-smokey-gray">
                    <MapPin size={12} className="text-ut-orange" />
                    {selectedApt.distanceMiles} mi
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-sm text-smokey-light">From </span>
                  <span className="text-2xl font-bold text-ink">
                    ${startingPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-smokey-gray">/mo</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedApt.amenities.slice(0, 4).map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-smokey-gray"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                {selectedApt.special && (
                  <p className="mt-2 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success inline-flex items-center gap-1 w-fit">
                    <Tag size={10} />
                    {selectedApt.special}
                  </p>
                )}

                <div className="mt-4">
                  <Link
                    href={`/apartments/${selectedIndex}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-ut-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-ut-orange-light transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-smokey-gray">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#FF8200]" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#999]" />
            Sold Out
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#4B4B4B]" />
            UT Campus
          </span>
        </div>
      </div>
    </div>
  );
}
