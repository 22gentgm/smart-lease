import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Reviews",
  description: "Read honest reviews from UT Knoxville students about their apartment experiences. Share your own review.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
