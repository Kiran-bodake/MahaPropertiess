import type { Metadata } from "next";

import PropertiesClient from "@/components/property/PropertiesClient";

export const metadata: Metadata = {
  title: "Browse Properties | MahaProperties",

  description:
    "Explore verified residential, commercial and agricultural properties across Maharashtra.",
};

export default function PropertiesPage() {
  return <PropertiesClient />;
}
