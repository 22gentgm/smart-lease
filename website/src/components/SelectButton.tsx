"use client";

import { useState } from "react";
import { FileText, CalendarDays } from "lucide-react";
import SelectApartmentModal from "./SelectApartmentModal";

interface FloorPlan {
  beds: string;
  baths: string;
  price: number;
  soldOut?: boolean;
}

interface Props {
  apartmentName: string;
  price: number;
  matchScore?: number;
  bedrooms?: string;
  distance?: number;
  variant?: "primary" | "outline";
  floorPlans?: FloorPlan[];
  requestType?: "application" | "tour";
  label?: string;
}

export default function SelectButton({
  apartmentName,
  price,
  matchScore,
  bedrooms,
  distance,
  variant = "primary",
  floorPlans,
  requestType = "application",
  label,
}: Props) {
  const [open, setOpen] = useState(false);

  const defaultLabel = requestType === "tour" ? "Request a Tour" : "Request Application";
  const Icon = requestType === "tour" ? CalendarDays : FileText;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
          variant === "primary"
            ? "w-full bg-ut-orange px-4 py-3 text-white hover:bg-ut-orange-light"
            : "border border-ut-orange/30 px-4 py-2.5 text-ut-orange hover:bg-ut-orange/10"
        }`}
      >
        <Icon size={16} />
        {label || defaultLabel}
      </button>

      {open && (
        <SelectApartmentModal
          apartmentName={apartmentName}
          price={price}
          matchScore={matchScore}
          bedrooms={bedrooms}
          distance={distance}
          floorPlans={floorPlans}
          requestType={requestType}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
