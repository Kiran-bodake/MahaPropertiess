import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyPricing from "@/models/PropertyPricing";
import PropertyArea from "@/models/PropertyArea";
import PropertyFlags from "@/models/PropertyFlags";
import PropertyImage from "@/models/PropertyImage";
import PropertyAmenity from "@/models/PropertyAmenity";
import PropertyHighlight from "@/models/PropertyHighlight";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { slug } = await params;

    /* Find main property */
    const property = await Property.findOne({
      $or: [
        {
          slug: slug,
        },

        {
          propertyId: slug,
        },
      ],
    });

    if (!property) {
      return NextResponse.json(
        {
          error: "Property not found",
        },
        {
          status: 404,
        },
      );
    }

    const propertyId = property.propertyId;

    /* Related collections */
    const location = await PropertyLocation.findOne({
      propertyId,
    });

    const pricing = await PropertyPricing.findOne({
      propertyId,
    });

    const area = await PropertyArea.findOne({
      propertyId,
    });

    const flags = await PropertyFlags.findOne({
      propertyId,
    });

    const images = await PropertyImage.findOne({
      propertyId,
    });

    const amenities = await PropertyAmenity.findOne({
      propertyId,
    });

    const highlights = await PropertyHighlight.findOne({
      propertyId,
    });

    /* Final UI response */
    const result = {
      id: property._id,

      slug: property.slug || property.propertyId,

      title: property.title,

      description: property.description,

      category: property.category,

      locality: location?.locality || "",
      postedBy: property.postedBy || "",

      agentName: property.agentName || "",

      agentPhone: property.agentPhone || "",

      status: property.status || "",

      constructionStatus: property.constructionStatus || "",

      createdAt: property.createdAt || "",

      updatedAt: property.updatedAt || "",

      city: location?.city || "",

      state: location?.state || "",

      address: location?.address || "",

      price: pricing?.price || 0,

      area: area?.area || 0,

      areaUnit: area?.areaUnit || "sqft",

      rera: flags?.isRERA || false,
      // Residential
      carpetArea: property.carpetArea || "",
      builtUpArea: property.builtUpArea || "",

      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",

      furnishedStatus: property.furnishedStatus || "",

      // Commercial
      shopType: property.shopType || "",
      mainRoadFacing: property.mainRoadFacing || false,

      // Agriculture
      borewellAvailable: property.borewellAvailable || false,
      roadWidth: property.roadWidth || "",
      waterSource: property.waterSource || "",
      documentationStatus: property.documentationStatus || "",

      // Warehouse
      powerLoad: property.powerLoad || "",
      truckAccess: property.truckAccess || false,
      industrialApproved: property.industrialApproved || false,

      badge: flags?.isFeatured ? "Featured" : null,

      images: images?.images?.map((x: any) => x.url) || [],

      amenities: amenities?.amenities || [],

      highlights: highlights?.highlights || [],

      latitude: Number(location?.latitude) || null,

      longitude: Number(location?.longitude) || null,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load property",
      },
      {
        status: 500,
      },
    );
  }
}
