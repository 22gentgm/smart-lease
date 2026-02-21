import { APARTMENTS, Apartment } from "@/data/apartments";

export interface MatchResult {
  apartment: Apartment;
  index: number;
  score: number;
  matchedBedType: { beds: string; baths: string; price: number; soldOut?: boolean };
}

function distanceLabelToMiles(label: string): number {
  switch (label) {
    case "walking":
      return 0.7;
    case "biking":
      return 2.0;
    case "driving":
      return 10.0;
    default:
      return 10.0;
  }
}

export function computeMatches(params: URLSearchParams): MatchResult[] {
  const budgetMin = parseInt(params.get("budgetMin") || "500", 10);
  const budgetMax = parseInt(params.get("budgetMax") || "2500", 10);
  const bedrooms = params.get("bedrooms") || "any";
  const distanceLabel = params.get("distance") || "driving";
  const maxDistance = distanceLabelToMiles(distanceLabel);
  const wantedAmenities = (params.get("amenities") || "").split(",").filter(Boolean);
  const priorities = (params.get("priorities") || "").split(",").filter(Boolean);

  const results: MatchResult[] = [];

  APARTMENTS.forEach((apt, index) => {
    let score = 40;

    const availableBeds = apt.bedTypes.filter((bt) => {
      if (bedrooms === "any") return true;
      return bt.beds.toLowerCase().includes(bedrooms.toLowerCase());
    });

    const affordableBeds = availableBeds.filter(
      (bt) => bt.price >= budgetMin && bt.price <= budgetMax
    );
    const bestBed =
      affordableBeds.length > 0
        ? affordableBeds[0]
        : availableBeds.length > 0
          ? availableBeds[0]
          : apt.bedTypes[0];

    if (bestBed.price >= budgetMin && bestBed.price <= budgetMax) {
      score += 20;
      const savings = ((budgetMax - bestBed.price) / budgetMax) * 10;
      score += Math.min(savings, 10);
    } else if (bestBed.price < budgetMin) {
      score += 15;
    } else {
      const overBudget = ((bestBed.price - budgetMax) / budgetMax) * 30;
      score -= Math.min(overBudget, 20);
    }

    if (apt.distanceMiles <= maxDistance) {
      score += 15;
      if (apt.distanceMiles <= 0.5) score += 5;
    } else {
      score -= 10;
    }

    score += Math.min(apt.rating * 3, 15);

    if (wantedAmenities.length > 0) {
      const aptAmenitiesLower = apt.amenities.map((a) => a.toLowerCase());
      let matched = 0;
      for (const wanted of wantedAmenities) {
        const wantedLower = wanted.toLowerCase();
        if (aptAmenitiesLower.some((a) => a.includes(wantedLower) || wantedLower.includes(a))) {
          matched++;
        }
      }
      const amenityScore = (matched / wantedAmenities.length) * 15;
      score += amenityScore;
    }

    const priorityWeight: Record<string, number> = {};
    priorities.forEach((p, i) => {
      priorityWeight[p.toLowerCase()] = 4 - i;
    });

    if (priorityWeight["price"]) {
      const w = priorityWeight["price"];
      if (bestBed.price >= budgetMin && bestBed.price <= budgetMax) {
        score += w * 3;
      }
    }
    if (priorityWeight["location"]) {
      const w = priorityWeight["location"];
      if (apt.distanceMiles <= 0.5) score += w * 3;
      else if (apt.distanceMiles <= 1.0) score += w * 2;
    }
    if (priorityWeight["amenities"]) {
      const w = priorityWeight["amenities"];
      score += Math.min(apt.amenities.length * 0.5, 3) * w;
    }
    if (priorityWeight["reviews"]) {
      const w = priorityWeight["reviews"];
      score += Math.min(apt.rating - 3, 2) * w * 2;
    }

    if (apt.special) score += 3;

    score = Math.max(0, Math.min(99, Math.round(score)));

    results.push({ apartment: apt, index, score, matchedBedType: bestBed });
  });

  results.sort((a, b) => b.score - a.score);

  return results;
}
