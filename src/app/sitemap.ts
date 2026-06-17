import { MetadataRoute } from "next";
import Property from "@/models/Property";
import { connectDB } from "@/lib/mongodb";
import PropertyLocation from "@/models/PropertyLocation";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function slugify(value: string) {
  return value
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [properties, locations] = await Promise.all([
    Property.find({
      approvalStatus: "approved",
    })
      .select("propertyId slug updatedAt category")
      .lean(),

    PropertyLocation.find({}).select("propertyId city locality state").lean(),
  ]);

  const propertyLocationMap = new Map();

  locations.forEach((location: any) => {
    propertyLocationMap.set(location.propertyId, location);
  });

  const cityCategorySet = new Set();

  properties.forEach((property: any) => {
    const location = propertyLocationMap.get(property.propertyId);

    if (!location?.city || !property.category) return;

    cityCategorySet.add(
      `${slugify(location.city)}|${slugify(property.category)}`,
    );
  });

  // =====================
  // Static Pages
  // =====================

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      priority: 1,
    },
    {
<<<<<<< HEAD
      url: `${BASE_URL}/about`,
=======
      url: `${BASE_URL}/about-us`,
>>>>>>> 2011411 (updated code)
      lastModified: new Date(),
      priority: 0.8,
    },
    {
<<<<<<< HEAD
      url: `${BASE_URL}/contact`,
=======
      url: `${BASE_URL}/contact-us`,
>>>>>>> 2011411 (updated code)
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/list-property`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];

  // =====================
  // Property URLs
  // =====================

  const propertyUrls = properties.map((property: any) => ({
    url: `${BASE_URL}/properties/${property.slug}`,
    lastModified: property.updatedAt,
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // =====================
  // Unique Cities
  // =====================

  const uniqueCities = [
    ...new Set(locations.map((l: any) => l.city).filter(Boolean)),
  ];

  const cityUrls = uniqueCities.map((city: any) => ({
    url: `${BASE_URL}/properties/city/${slugify(city)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // =====================
  // Locality URLs
  // =====================
  const uniqueLocalities = [
    ...new Set(locations.map((l: any) => l.locality).filter(Boolean)),
  ];

  const localityUrls = uniqueLocalities.map((locality: any) => ({
    url: `${BASE_URL}/localities/${slugify(locality)}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  // =====================
  // Category URLs
  // =====================

  const categoryUrls: MetadataRoute.Sitemap = [];

  cityCategorySet.forEach((item: any) => {
    const [city, category] = item.split("|");

    categoryUrls.push({
      url: `${BASE_URL}/properties/city/${city}/${category}`,
      lastModified: new Date(),
      priority: 0.8,
    });
  });

  // =====================
  // Pillar Pages
  // =====================

  const pillarUrls = uniqueCities.map((city: any) => ({
    url: `${BASE_URL}/invest-in/${slugify(city)}`,
    lastModified: new Date(),
    priority: 0.9,
  }));

  return [
    ...staticUrls,
    ...cityUrls,
    ...localityUrls,
    ...categoryUrls,
    ...pillarUrls,
    ...propertyUrls,
  ];
}
