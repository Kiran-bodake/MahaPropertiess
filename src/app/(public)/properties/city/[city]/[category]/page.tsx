import type { Metadata } from "next";
import PropertiesClient from "@/components/property/PropertiesClient";

type Props = {
  params: Promise<{
    city: string;
    category: string;
  }>;
};

function formatText(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category } = await params;

  const cityName = formatText(city);
  const categoryName = formatText(category);

  return {
    title: `${categoryName} in ${cityName} | MahaProperties`,

    description: `Browse verified ${categoryName.toLowerCase()} properties in ${cityName}. Compare locations, prices, amenities and investment opportunities on MahaProperties.`,

    keywords: [
      `${categoryName} in ${cityName}`,
      `${categoryName} property ${cityName}`,
      `${cityName} real estate`,
      `${categoryName.toLowerCase()} for sale`,
      `${categoryName.toLowerCase()} in Maharashtra`,
    ],

    alternates: {
      canonical: `https://mahaproperties.com/properties/city/${city}/${category}`,
    },

    openGraph: {
      title: `${categoryName} in ${cityName} | MahaProperties`,
      description: `Browse verified ${categoryName.toLowerCase()} properties in ${cityName}.`,
      url: `https://mahaproperties.com/properties/city/${city}/${category}`,
      type: "website",
    },
  };
}

export default async function CityCategoryPage({ params }: Props) {
  const { city, category } = await params;

  return (
    <PropertiesClient
      initialCity={decodeURIComponent(city)}
      initialCategory={decodeURIComponent(category)}
    />
  );
}
