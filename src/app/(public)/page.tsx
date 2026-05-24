// ─── HOME PAGE ───────────────────────────────────────────────────────────────
// Single source of truth. MahaHome contains: Navbar, all sections, Footer, WA.
// ─────────────────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import MahaHome from "@/components/home/MahaHome";

export const metadata: Metadata = {
  metadataBase: new URL("https://mahaproperties.in"),

  title:
    "MahaProperties — Nashik's #1 Property Portal | NA Plots, Agriculture Land",

  description:
    "2,500+ verified NA plots, agriculture land, collector NA, warehouse & commercial properties in Nashik. RERA compliant listings, transparent pricing.",

  openGraph: {
    title: "MahaProperties — Nashik's #1 Property Portal",

    description:
      "Explore verified NA plots, agriculture land, warehouse and commercial properties in Nashik.",

    url: "https://mahaproperties.in",

    siteName: "MahaProperties",

    images: [
      {
        url: "/maha.png",

        width: 1200,

        height: 630,

        alt: "MahaProperties",
      },
    ],

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "MahaProperties — Nashik's #1 Property Portal",

    description: "Explore verified properties in Nashik.",

    images: ["/maha.png"],
  },
};

export default function HomePage() {
  return <MahaHome />;
}
