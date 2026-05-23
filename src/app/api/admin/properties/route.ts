import { NextResponse } from "next/server";

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


    const properties =
      await Property.find({

        approvalStatus:
          "pending"

      })

      .sort({

        createdAt:-1

      })

      .lean();


    const finalProperties =
      await Promise.all(

        properties.map(

          async(property:any)=>{

            // IMPORTANT FIX
            const propertyId =
              property.propertyId;


            // Pricing
            const pricing =
              await PropertyPricing.findOne({

                propertyId:
                  propertyId

              }).lean();


            // Location
            const location =
              await PropertyLocation.findOne({

                propertyId:
                  propertyId

              }).lean();


            // Images
            const image =
              await PropertyImage.findOne({

                propertyId:
                  propertyId

              }).lean();


            return {

              ...property,


              // PRICE
              price:
                pricing?.price || 0,


              // LOCATION
              city:
                location?.city || "",

              state:
                location?.state || "",

              locality:
                location?.locality || "",

              houseNo:
                location?.houseNo || "",

              street:
                location?.street || "",

              landmark:
                location?.landmark || "",


              // IMAGE
              image:
                image?.images?.[0]?.url ||

                "/maha.png"

            };

          }

        )

      );


    console.log(
      "FINAL PROPERTIES:",
      finalProperties
    );


    return NextResponse.json({

      success:true,

      properties:
        finalProperties

    });

  }

  catch(error){

    console.error(
      "Property fetch error:",
      error
    );

    return NextResponse.json(

      {

        success:false,

        properties:[]

      },

      {

        status:500

      }

    );

  }

}