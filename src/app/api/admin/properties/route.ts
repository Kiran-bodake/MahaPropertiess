import { NextResponse, NextRequest } from "next/server";

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


import { verifyAccessToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {

  try {

    await connectDB();


    // Build query from query params: `approval` (pending|approved|rejected|all) and `mine` (true|false)
    const { searchParams } = req.nextUrl;

    const approvalParam = searchParams.get("approval") || "pending";
    const mineParam = searchParams.get("mine") || "false";

    const query: any = {};

    if (approvalParam && approvalParam !== "all") {
      query.approvalStatus = approvalParam;
    }

    // If user requested only their properties, verify access token and filter by postedBy
    if (mineParam === "true") {
      const access = req.cookies.get("propvista-access-token")?.value;
      if (!access) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
      }
      const payload = verifyAccessToken(access);
      if (!payload) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
      }
      // filter by postedBy (user id)
      query.postedBy = payload.sub;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 }).lean();


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