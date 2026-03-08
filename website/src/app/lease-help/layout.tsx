import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lease Help",
  description: "Paste your lease and get an instant analysis of key clauses, fees, and red flags. Built for UT Knoxville students.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
