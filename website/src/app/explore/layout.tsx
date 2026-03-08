import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Apartments",
  description: "Browse all 21 UT Knoxville student apartments. Compare prices, amenities, ratings, and distance to campus.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
