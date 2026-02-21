"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

function getFavorites(): number[] {
  try {
    return JSON.parse(localStorage.getItem("smartlease_favorites") || "[]");
  } catch {
    return [];
  }
}

function setFavorites(favs: number[]) {
  localStorage.setItem("smartlease_favorites", JSON.stringify(favs));
  window.dispatchEvent(new Event("favorites-changed"));
}

interface Props {
  apartmentIndex: number;
  size?: number;
  className?: string;
}

export default function FavoriteButton({
  apartmentIndex,
  size = 20,
  className = "",
}: Props) {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setLiked(getFavorites().includes(apartmentIndex));
  }, [apartmentIndex]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favs = getFavorites();
    if (favs.includes(apartmentIndex)) {
      setFavorites(favs.filter((i) => i !== apartmentIndex));
      setLiked(false);
    } else {
      setFavorites([...favs, apartmentIndex]);
      setLiked(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center justify-center rounded-full p-2 transition-all cursor-pointer ${
        liked
          ? "bg-red-50 text-red-500"
          : "bg-white/80 text-smokey-gray hover:text-red-400 backdrop-blur-sm"
      } ${animate ? "scale-125" : "scale-100"} ${className}`}
      title={liked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={`transition-all ${liked ? "fill-red-500" : "fill-none"}`}
      />
    </button>
  );
}

export { getFavorites };
