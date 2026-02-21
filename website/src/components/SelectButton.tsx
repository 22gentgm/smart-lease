"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import SelectApartmentModal from "./SelectApartmentModal";

interface Props {
  apartmentName: string;
  price: number;
  matchScore?: number;
  bedrooms?: string;
  distance?: number;
  variant?: "primary" | "outline";
}

export default function SelectButton({
  apartmentName,
  price,
  matchScore,
  bedrooms,
  distance,
  variant = "primary",
}: Props) {
  const [open, setOpen] = useState(false);

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
        <Heart size={16} />
        {variant === "primary" ? "Select This Apartment" : "Select"}
      </button>

      {open && (
        <SelectApartmentModal
          apartmentName={apartmentName}
          price={price}
          matchScore={matchScore}
          bedrooms={bedrooms}
          distance={distance}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
