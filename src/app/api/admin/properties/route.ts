import { NextResponse }
  from "next/server";

import { connectDB }
  from "@/lib/mongodb";

import Property
  from "@/models/Property";

import PropertyPricing
  from "@/models/PropertyPricing";

import PropertyLocation
  from "@/models/PropertyLocation";

import PropertyImage
  from "@/models/PropertyImage";


export async function GET() {

  try {

    await connectDB();


    // Get pending properties
    const properties =
      await Property.find({

        approvalStatus:
          "pending"

      })

      .sort({

        createdAt: -1

      })

      .lean();


    // Merge related collections
    const finalProperties =
      await Promise.all(

        properties.map(

          async (
            property: any
          ) => {

            const mongoId =
              property._id;


            // Pricing
            const pricing =
              await PropertyPricing.findOne({

                propertyId:
                  mongoId

              }).lean();


            // Location
            const location =
              await PropertyLocation.findOne({

                propertyId:
                  mongoId

              }).lean();


            // Images
            const image =
              await PropertyImage.findOne({

                propertyId:
                  mongoId

              }).lean();


            return {

              ...property,

              // Price
              price:
                pricing?.price || 0,


              // Flat location fields
              city:
                location?.city || "",

              state:
                location?.state || "",

              locality:
                location?.locality || "",


              // Main image
              image:

                image?.images?.[0]?.url ||

                "/maha.png"

            };

          }

        )

      );


    return NextResponse.json({

      success: true,

      properties:
        finalProperties

    });

  }

  catch (error) {

    console.error(

      "Property fetch error:",

      error

    );

    return NextResponse.json(

      {

        success: false,

        properties: []

      },

      {

        status: 500

      }

    );

  }

}