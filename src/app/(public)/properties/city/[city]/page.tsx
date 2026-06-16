import type { Metadata } from "next";
import PropertiesClient from "@/components/property/PropertiesClient";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;

  const cityName = city
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Properties in ${cityName} | MahaProperties`,
    description: `Browse verified residential, commercial, agricultural land, NA plots and investment properties in ${cityName}. Explore latest listings on MahaProperties.`,
    keywords: [
      `properties in ${cityName}`,
      `${cityName} real estate`,
      `plots in ${cityName}`,
      `land in ${cityName}`,
      `property for sale in ${cityName}`,
    ],
    alternates: {
      canonical: `https://mahaproperties.com/properties/city/${city}`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;

  return <PropertiesClient initialCity={decodeURIComponent(city)} />;
}
