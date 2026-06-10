import type { Metadata } from "next";

import PropertiesClient from "@/components/property/PropertiesClient";

export const metadata: Metadata = {
  title: "Properties for Sale, Rent & Lease in Maharashtra | MahaProperties",

  description:
    "Browse verified residential, commercial, agricultural land, NA plots, flats, houses and investment properties across Maharashtra.",

  keywords: [
    "properties in Maharashtra",
    "land for sale",
    "agricultural land",
    "NA plots",
    "commercial properties",
    "real estate Maharashtra",
  ],
};
export default function PropertiesPage() {
  return <PropertiesClient />;
}
