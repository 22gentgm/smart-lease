import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  title: {
    default: "SmartLease — UT Knoxville Student Housing",
    template: "%s — SmartLease",
  },
  description:
    "Find your perfect student apartment near UT Knoxville. Compare prices, amenities, and locations across 20+ properties — matched to what matters most to you.",
  manifest: "/manifest.json",
  themeColor: "#FF8200",
  verification: {
    google: "mqpvtKxSXHoyJeQyCeWovGY46T0UbGaZWHhetxjkcfs",
  },
  metadataBase: new URL("https://smartlease-sage.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "SmartLease",
    title: "SmartLease — UT Knoxville Student Housing",
    description:
      "Find your perfect student apartment near UT Knoxville. Compare prices, read reviews, find roommates, and get matched in 30 seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartLease — Find Your Perfect Student Apartment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLease — UT Knoxville Student Housing",
    description:
      "Find your perfect student apartment near UT Knoxville. Quiz match, reviews, roommate finder & more.",
    images: ["/og-image.png"],
  },
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
          <Footer />
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
