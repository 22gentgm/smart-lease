import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartment Map",
  description: "Interactive map of all UT Knoxville student apartments. See locations, prices, and amenities at a glance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
