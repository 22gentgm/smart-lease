import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subleases",
  description: "Find or post subleases near UT Knoxville. Browse available units from fellow students.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
