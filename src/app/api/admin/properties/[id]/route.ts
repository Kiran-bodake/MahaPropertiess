import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Property from "@/models/Property";

import PropertyPricing from "@/models/PropertyPricing";

import PropertyArea from "@/models/PropertyArea";

import PropertyLocation from "@/models/PropertyLocation";

import PropertyImage from "@/models/PropertyImage";

import PropertyAmenity from "@/models/PropertyAmenity";

import PropertyHighlight from "@/models/PropertyHighlight";

import PropertyFlags from "@/models/PropertyFlags";


/* =========================================
   GET PROPERTY DETAILS
========================================= */
export async function GET(
  req: Request,
  context: any
) {

  try {

    await connectDB();

    const resolvedParams =
      await context.params;

    const id =
      resolvedParams.id;


    const property =
      await Property.findById(id).lean();

    if (!property) {

      return NextResponse.json({

        success: false,

        property: null

      });

    }


    const propertyId =
      property.propertyId;


    const pricing =
      await PropertyPricing.findOne({

        propertyId

      }).lean();


    const area =
      await PropertyArea.findOne({

        propertyId

      }).lean();


    const location =
      await PropertyLocation.findOne({

        propertyId

      }).lean();


    const images =
      await PropertyImage.findOne({

        propertyId

      }).lean();


    const amenities =
      await PropertyAmenity.findOne({

        propertyId

      }).lean();


    const highlights =
      await PropertyHighlight.findOne({

        propertyId

      }).lean();


    const flags =
      await PropertyFlags.findOne({

        propertyId

      }).lean();


    const finalProperty = {

      ...property,


      price:
        pricing?.price || 0,


      area:
        area?.area || 0,

      areaUnit:
        area?.areaUnit || "sqft",


      locality:
        location?.locality || "",

      city:
        location?.city || "",

      state:
        location?.state || "",

      houseNo:
        location?.houseNo || "",

      street:
        location?.street || "",

      landmark:
        location?.landmark || "",

      pincode:
        location?.pincode || "",


      images:
        images?.images?.map(

          (x:any) => x.url

        ) || [],


      amenities:
        amenities?.amenities || [],


      highlights:
        highlights?.highlights || [],


      isRERA:
        flags?.isRERA || false,

      isFeatured:
        flags?.isFeatured || false,

      isZeroBrokerage:
        flags?.isZeroBrokerage || false

    };


    return NextResponse.json({

      success: true,

      property:
        finalProperty

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json({

      success: false,

      property: null

    });

  }

}



/* =========================================
   UPDATE PROPERTY
========================================= */
export async function PUT(
  req: Request,
  context: any
) {

  try {

    await connectDB();

    const resolvedParams =
      await context.params;

    const id =
      resolvedParams.id;

    const body =
      await req.json();


    /* MAIN PROPERTY */
    const existingProperty =
      await Property.findById(id);

    if (!existingProperty) {

      return NextResponse.json({

        success: false,

        message: "Property not found"

      });

    }


    const propertyId =
      existingProperty.propertyId;


    /* UPDATE MAIN PROPERTY */
    await Property.findByIdAndUpdate(

      id,

      {

        title:
          body.title,

        category:
          body.category,

        postedBy:
          body.postedBy,

        agentName:
          body.agentName,

        agentPhone:
          body.agentPhone,

        status:
          body.status,

        description:
          body.description

      },

      {

        returnDocument:"after",

        runValidators:true

      }

    );


    /* UPDATE PRICE */
    await PropertyPricing.findOneAndUpdate(

      { propertyId },

      {

        price:
          body.price

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    /* UPDATE AREA */
    await PropertyArea.findOneAndUpdate(

      { propertyId },

      {

        area:
          body.area,

        areaUnit:
          body.areaUnit

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    /* UPDATE LOCATION */
    await PropertyLocation.findOneAndUpdate(

      { propertyId },

      {

        state:
          body.state,

        city:
          body.city,

        locality:
          body.locality,

        houseNo:
          body.houseNo,

        street:
          body.street,

        landmark:
          body.landmark,

        pincode:
          body.pincode

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    /* UPDATE FLAGS */
    await PropertyFlags.findOneAndUpdate(

      { propertyId },

      {

        isRERA:
          body.isRERA,

        isFeatured:
          body.isFeatured,

        isZeroBrokerage:
          body.isZeroBrokerage

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    /* UPDATE AMENITIES */
    await PropertyAmenity.findOneAndUpdate(

      { propertyId },

      {

        amenities:
          body.amenities || []

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    /* UPDATE HIGHLIGHTS */
    await PropertyHighlight.findOneAndUpdate(

      { propertyId },

      {

        highlights:
          body.highlights || []

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    /* UPDATE IMAGES */
    await PropertyImage.findOneAndUpdate(

      { propertyId },

      {

        images:

          (body.images || []).map(

            (url:string)=>({

              url

            })

          )

      },

      {

        upsert:true,

        returnDocument:"after"

      }

    );


    return NextResponse.json({

      success: true,

      message:
        "Property updated successfully"

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json({

      success: false,

      message:
        "Failed to update property"

    });

  }

}