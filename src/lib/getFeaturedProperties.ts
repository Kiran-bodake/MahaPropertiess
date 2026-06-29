import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyPricing from "@/models/PropertyPricing";
import PropertyArea from "@/models/PropertyArea";
import PropertyImage from "@/models/PropertyImage";

export async function getFeaturedProperties(city: string, limit = 12) {
  await connectDB();

  const locations = await PropertyLocation.find({
    city: {
      $regex: new RegExp(`^${city}$`, "i"),
    },
  });

  const propertyIds = locations.map((location: any) => location.propertyId);

  const properties = await Property.find({
    propertyId: {
      $in: propertyIds,
    },
    approvalStatus: "approved",
  })
    .select("-agentPhone -agentName -postedBy -email -ownerPhone -ownerEmail")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const images = await PropertyImage.find({
    propertyId: {
      $in: propertyIds,
    },
  }).lean();

  const pricings = await PropertyPricing.find({
    propertyId: {
      $in: propertyIds,
    },
  }).lean();

  const pricingMap = new Map(
    pricings.map((pricing: any) => [pricing.propertyId, pricing]),
  );

  const imageMap = new Map(images.map((img: any) => [img.propertyId, img]));

  const locationMap = new Map(
    locations.map((loc: any) => [loc.propertyId, loc]),
  );
  const areas = await PropertyArea.find({
    propertyId: {
      $in: propertyIds,
    },
  }).lean();

  const areaMap = new Map(areas.map((area: any) => [area.propertyId, area]));

  const enriched = properties.map((property: any) => ({
    ...property,

    image:
      imageMap.get(property.propertyId)?.images?.find((x: any) => x.isPrimary)
        ?.url ||
      imageMap.get(property.propertyId)?.images?.[0]?.url ||
      "/maha.png",

    price:
      pricingMap.get(property.propertyId)?.price ||
      pricingMap.get(property.propertyId)?.expectedPrice ||
      null,

    area: areaMap.get(property.propertyId)?.area,

    areaUnit: areaMap.get(property.propertyId)?.areaUnit,

    locality: locationMap.get(property.propertyId)?.locality || "",

    city: locationMap.get(property.propertyId)?.city || "",
  }));

  return JSON.parse(JSON.stringify(enriched));
}
