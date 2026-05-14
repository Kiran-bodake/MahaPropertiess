import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongoose";

import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyPricing from "@/models/PropertyPricing";
import PropertyArea from "@/models/PropertyArea";
import PropertyFlags from "@/models/PropertyFlags";
import PropertyImage from "@/models/PropertyImage";


export async function GET(
  req: Request
) {

  try {

    await connectDB();

    const {
      searchParams
    } = new URL(
      req.url
    );

    const category =
      searchParams.get(
        "category"
      );

    let properties =
      await Property.find();

    /* Category Filter */
    if (
      category &&
      category !== "All"
    ) {

      properties =
        properties.filter(
          (item: any) =>

            item.category
              ?.toLowerCase() ===
            category.toLowerCase()

        );

    }

    /* Merge data from related collections */
    const finalData =
      await Promise.all(

        properties.map(
          async (
            property: any
          ) => {

            const propertyId =
              property.propertyId;

            const location =
              await PropertyLocation.findOne({
                propertyId
              });

            const pricing =
              await PropertyPricing.findOne({
                propertyId
              });

            const area =
              await PropertyArea.findOne({
                propertyId
              });

            const flags =
              await PropertyFlags.findOne({
                propertyId
              });

            const images =
              await PropertyImage.findOne({
                propertyId
              });

            return {

              id:
                property._id,

          slug:
  property.slug ||
  property.propertyId,

              title:
                property.title,

              locality:
                location?.locality ||
                "",

              city:
                location?.city ||
                "",

              category:
                property.category,

              price:
                `₹${Number(
                  pricing?.price || 0
                ).toLocaleString()}`,

              area:
                `${area?.area || 0} ${area?.areaUnit || "sqft"}`,

              badge:
                flags?.isFeatured
                  ? "Featured"
                  : null,

              rera:
                flags?.isRERA || false,

              img:
                images?.images?.[0]?.url ||

                "/maha.png",

              views:
                property.views || 0

            };

          }

        )

      );

    return NextResponse.json(
      finalData
    );

  }

  catch (error: any) {

  console.error(
    "Properties API Error:",
    error
  );

  return NextResponse.json(
    {
      error:
        error.message
    },
    {
      status: 500
    }
  );

}

}