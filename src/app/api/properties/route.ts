// src/app/api/properties/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyPricing from "@/models/PropertyPricing";
import PropertyArea from "@/models/PropertyArea";
import PropertyFlags from "@/models/PropertyFlags";
import PropertyImage from "@/models/PropertyImage";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let properties = await Property.find({
      approvalStatus: "approved",
    }).sort({ createdAt: -1 });

    /* Category Filter */
    if (category && category !== "All") {
      properties = properties.filter(
        (item: any) => item.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    /* Merge data from related collections */
    const finalData = await Promise.all(
      properties.map(async (property: any) => {
        const propertyId = property.propertyId;

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

        const imageDoc = await PropertyImage.findOne({
          propertyId,
        });

        const validImages =
          imageDoc?.images?.map((img: any) => img?.url)?.filter(Boolean) || [];

        return {
          id: property._id,
          _id: property._id,
          slug: property.slug || property.propertyId,
          title: property.title,
          locality: location?.locality || "",
          city: location?.city || "",
          category: property.category,
          price: `₹${Number(pricing?.price || 0).toLocaleString()}`,
          area: `${area?.area || 0} ${area?.areaUnit || "sqft"}`,
          badge: flags?.isFeatured ? "Featured" : null,
          rera: flags?.isRERA || false,
          img: validImages[0] || "/maha.png",
          images: validImages.length > 0 ? validImages : ["/maha.png"],
          views: property.views || 100,
          createdAt: property.createdAt,
          
          // ✅ AGENT / POSTER INFORMATION
          agentName: property.agentName || "Property Expert",
          agentPhone: property.agentPhone || "Not Available",
          postedBy: property.postedBy || "Agency",
        };
      }),
    );

    return NextResponse.json(finalData);
  } catch (error: any) {
    console.error("Properties API Error:", error);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}