"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Footprints,
  Bike,
  Car,
} from "lucide-react";

const BEDROOM_OPTIONS = ["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed", "5 Bed"];

const AMENITY_OPTIONS = [
  "Pool",
  "Gym",
  "Study Room",
  "Laundry",
  "Parking",
  "Pet Friendly",
  "Furnished",
  "Game Room",
];

const DISTANCE_OPTIONS = [
  { label: "Walking", subtitle: "Under 10 min", icon: Footprints },
  { label: "Biking", subtitle: "10–20 min", icon: Bike },
  { label: "Driving", subtitle: "No limit", icon: Car },
] as const;

const PRIORITY_OPTIONS = ["Price", "Location", "Amenities", "Reviews"];

const TOTAL_STEPS = 5;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);

  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(2500);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);

  const transition = useCallback(
    (nextStep: number, dir: "forward" | "backward") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 250);
    },
    [animating]
  );

  const next = () => transition(step + 1, "forward");
  const back = () => transition(step - 1, "backward");

  const toggleAmenity = (a: string) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const togglePriority = (p: string) => {
    setPriorities((prev) => {
      if (prev.includes(p)) return prev.filter((x) => x !== p);
      if (prev.length >= 4) return prev;
      return [...prev, p];
    });
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (bedrooms) params.set("bedrooms", bedrooms);
    params.set("budgetMin", String(budgetMin));
    params.set("budgetMax", String(budgetMax));
    if (amenities.length) params.set("amenities", amenities.join(","));
    if (distance) params.set("distance", distance.toLowerCase());
    if (priorities.length) params.set("priorities", priorities.join(","));
    router.push(`/results?${params.toString()}`);
  };

  const canProceed = (): boolean => {
    if (step === 0) return bedrooms !== null;
    if (step === 1) return budgetMin < budgetMax;
    if (step === 3) return distance !== null;
    return true;
  };

  const slideClass = animating
    ? direction === "forward"
      ? "opacity-0 translate-x-8"
      : "opacity-0 -translate-x-8"
    : "opacity-100 translate-x-0";

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-cream-dark">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-smokey-gray font-sans">
            {step + 1} / {TOTAL_STEPS}
          </span>
          <div className="flex-1 mx-4 h-2 bg-cream-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-ut-orange rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-smokey-gray font-sans">
            Smart Match
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-10">
        <div
          className={`transition-all duration-250 ease-out ${slideClass}`}
        >
          {step === 0 && (
            <StepBedrooms value={bedrooms} onChange={setBedrooms} />
          )}
          {step === 1 && (
            <StepBudget
              min={budgetMin}
              max={budgetMax}
              onMinChange={setBudgetMin}
              onMaxChange={setBudgetMax}
            />
          )}
          {step === 2 && (
            <StepAmenities selected={amenities} onToggle={toggleAmenity} />
          )}
          {step === 3 && (
            <StepDistance value={distance} onChange={setDistance} />
          )}
          {step === 4 && (
            <StepPriority ranked={priorities} onToggle={togglePriority} />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-10 flex items-center gap-4">
          {step > 0 && (
            <button
              onClick={back}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-smokey-gray/20 text-smokey-gray hover:border-smokey-gray/40 transition-colors font-sans cursor-pointer"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}

          <div className="flex-1" />

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ut-orange text-white font-semibold hover:bg-ut-orange-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-sans cursor-pointer"
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ut-orange text-white font-semibold hover:bg-ut-orange-light transition-colors font-sans cursor-pointer"
            >
              See My Matches
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

/* ─── Step 1: Bedrooms ──────────────────────────────────────────────── */

function StepBedrooms({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <section>
      <h1
        className="text-3xl sm:text-4xl font-bold text-ink mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        How many bedrooms?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {BEDROOM_OPTIONS.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`relative px-4 py-6 rounded-2xl border-2 text-center font-semibold text-lg transition-all cursor-pointer font-sans ${
                selected
                  ? "border-ut-orange bg-ut-orange/10 text-ut-orange"
                  : "border-cream-dark bg-white text-ink hover:border-smokey-gray/30"
              }`}
            >
              {opt}
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-ut-orange flex items-center justify-center">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Step 2: Budget ─────────────────────────────────────────────────── */

function StepBudget({
  min,
  max,
  onMinChange,
  onMaxChange,
}: {
  min: number;
  max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  const SLIDER_MIN = 500;
  const SLIDER_MAX = 2500;
  const STEP = 50;

  const minPercent = ((min - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const maxPercent = ((max - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  return (
    <section>
      <h1
        className="text-3xl sm:text-4xl font-bold text-ink mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        What&apos;s your monthly budget?
      </h1>
      <p className="text-smokey-gray mb-10 font-sans">
        Drag to set your price range
      </p>

      {/* Value display */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <span className="text-sm text-smokey-gray font-sans">Min</span>
          <p className="text-2xl font-bold text-ink font-sans">
            ${min.toLocaleString()}
          </p>
        </div>
        <div className="h-px flex-1 mx-6 bg-cream-dark" />
        <div className="text-center">
          <span className="text-sm text-smokey-gray font-sans">Max</span>
          <p className="text-2xl font-bold text-ink font-sans">
            ${max.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Dual range slider */}
      <div className="relative h-10 mb-4">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-cream-dark rounded-full" />
        {/* Active track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-ut-orange rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={STEP}
          value={min}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < max) onMinChange(v);
          }}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-ut-orange [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-ut-orange [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: min > SLIDER_MAX - 100 ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step={STEP}
          value={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > min) onMaxChange(v);
          }}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-ut-orange [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-ut-orange [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-smokey-light font-sans">
        <span>$500</span>
        <span>$1,000</span>
        <span>$1,500</span>
        <span>$2,000</span>
        <span>$2,500</span>
      </div>
    </section>
  );
}

/* ─── Step 3: Amenities ──────────────────────────────────────────────── */

function StepAmenities({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (a: string) => void;
}) {
  return (
    <section>
      <h1
        className="text-3xl sm:text-4xl font-bold text-ink mb-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Must-have amenities?
      </h1>
      <p className="text-smokey-gray mb-8 font-sans">Select all that apply</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AMENITY_OPTIONS.map((amenity) => {
          const checked = selected.includes(amenity);
          return (
            <button
              key={amenity}
              onClick={() => onToggle(amenity)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition-all cursor-pointer font-sans ${
                checked
                  ? "border-ut-orange bg-ut-orange/10"
                  : "border-cream-dark bg-white hover:border-smokey-gray/30"
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  checked
                    ? "bg-ut-orange border-ut-orange"
                    : "border-smokey-gray/30 bg-white"
                }`}
              >
                {checked && (
                  <Check size={14} className="text-white" strokeWidth={3} />
                )}
              </span>
              <span
                className={`font-medium ${checked ? "text-ut-orange" : "text-ink"}`}
              >
                {amenity}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Step 4: Distance ───────────────────────────────────────────────── */

function StepDistance({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <section>
      <h1
        className="text-3xl sm:text-4xl font-bold text-ink mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        How far from campus?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DISTANCE_OPTIONS.map(({ label, subtitle, icon: Icon }) => {
          const selected = value === label;
          return (
            <button
              key={label}
              onClick={() => onChange(label)}
              className={`relative flex flex-col items-center gap-3 px-6 py-8 rounded-2xl border-2 transition-all cursor-pointer font-sans ${
                selected
                  ? "border-ut-orange bg-ut-orange/10"
                  : "border-cream-dark bg-white hover:border-smokey-gray/30"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  selected ? "bg-ut-orange" : "bg-cream-dark"
                }`}
              >
                <Icon
                  size={26}
                  className={selected ? "text-white" : "text-smokey-gray"}
                />
              </div>
              <div className="text-center">
                <p
                  className={`font-semibold text-lg ${selected ? "text-ut-orange" : "text-ink"}`}
                >
                  {label}
                </p>
                <p className="text-sm text-smokey-gray">{subtitle}</p>
              </div>
              {selected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-ut-orange flex items-center justify-center">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Step 5: Priority Ranking ───────────────────────────────────────── */

function StepPriority({
  ranked,
  onToggle,
}: {
  ranked: string[];
  onToggle: (p: string) => void;
}) {
  return (
    <section>
      <h1
        className="text-3xl sm:text-4xl font-bold text-ink mb-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        What matters most?
      </h1>
      <p className="text-smokey-gray mb-8 font-sans">Tap to rank 1–4</p>

      <div className="flex flex-col gap-3">
        {PRIORITY_OPTIONS.map((item) => {
          const rank = ranked.indexOf(item);
          const isRanked = rank !== -1;
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`flex items-center gap-4 px-5 py-5 rounded-xl border-2 transition-all cursor-pointer font-sans ${
                isRanked
                  ? "border-ut-orange bg-ut-orange/10"
                  : "border-cream-dark bg-white hover:border-smokey-gray/30"
              }`}
            >
              <span
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isRanked
                    ? "bg-ut-orange text-white"
                    : "bg-cream-dark text-smokey-gray"
                }`}
              >
                {isRanked ? rank + 1 : "—"}
              </span>
              <span
                className={`font-semibold text-lg ${isRanked ? "text-ut-orange" : "text-ink"}`}
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-smokey-light font-sans text-center">
        {ranked.length < 4
          ? `${4 - ranked.length} remaining — tap to assign rank`
          : "All ranked! Tap an item to remove its rank."}
      </p>
    </section>
  );
}
