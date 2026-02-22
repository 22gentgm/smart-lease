import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/lib/auth-context";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartLease — UT Knoxville Student Housing",
  description:
    "Find your perfect student apartment near UT Knoxville. Compare prices, amenities, and locations across 20+ properties — matched to what matters most to you.",
  manifest: "/manifest.json",
  themeColor: "#FF8200",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SmartLease",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${playfair.variable} ${spaceGrotesk.variable}`}>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </body>
    </html>
  );
}
