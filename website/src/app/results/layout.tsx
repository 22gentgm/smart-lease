import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Matches — SmartLease",
  description: "Your personalized apartment matches based on your quiz preferences.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
