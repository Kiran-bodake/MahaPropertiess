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
    }).sort({
      createdAt: -1,
    });

    if (category && category !== "All") {
      properties = properties.filter(
        (item: any) => item.category?.toLowerCase() === category.toLowerCase(),
      );
    }

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

        const images =
          imageDoc?.images

            ?.map((img: any) => img.url)

            ?.filter(Boolean) || [];

        return {
          id: property._id,

          _id: property._id,

          title: property.title,

          slug: property.slug || property.propertyId,

          category: property.category,

          locality: location?.locality || "",

          city: location?.city || "",

          price: `₹${Number(pricing?.price || 0).toLocaleString()}`,

          area: `${area?.area || 0} ${area?.areaUnit || "sqft"}`,

          badge: flags?.isFeatured ? "Featured" : null,

          rera: flags?.isRERA || false,

          img: images[0] || "/maha.png",

          images: images.length ? images : ["/maha.png"],

          views: property.views || 0,

          // agentName:

          // property.agentName ||

          // "Property Expert",

          // agentPhone:

          // property.agentPhone ||

          // "Not Available",

          // postedBy:

          // property.postedBy ||

          // "Agency",

          createdAt: property.createdAt,
        };
      }),
    );

    return NextResponse.json({
      success: true,

      data: finalData,
    });
  } catch (error: any) {
    console.log(
      "PROPERTY API ERROR",

      error,
    );

    return NextResponse.json(
      {
        success: false,

        message: error.message,
      },

      {
        status: 500,
      },
    );
  }
}
