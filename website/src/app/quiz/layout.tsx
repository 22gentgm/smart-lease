import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartment Quiz",
  description: "Answer 5 quick questions to get matched with the best UT Knoxville apartments for your budget, lifestyle, and preferences.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
