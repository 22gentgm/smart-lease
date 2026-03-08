import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roommate Finder",
  description: "Find compatible roommates at UT Knoxville. Match based on sleep schedule, cleanliness, budget, and lifestyle.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
