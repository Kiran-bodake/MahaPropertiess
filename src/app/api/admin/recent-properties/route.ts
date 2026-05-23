import { NextResponse }
from "next/server";

import { connectDB }
from "@/lib/mongodb";

import Property
from "@/models/Property";

import PropertyPricing
from "@/models/PropertyPricing";



export async function GET(){

  try{

    await connectDB();

    // FETCH RECENT PROPERTIES
    const properties =

      await Property.find()

      .sort({

        createdAt:-1

      })

      .limit(10);


    // MERGE PRICING
    const finalProperties =

      await Promise.all(

        properties.map(

          async (property:any)=>{

            // GET PRICE
            const pricing =

              await PropertyPricing.findOne({

                propertyId:
                  property.propertyId

              });


            return {

              ...property.toObject(),

              // PRICE
              price:
                pricing?.price || 0

            };

          }

        )

      );


    return NextResponse.json({

      properties:
        finalProperties

    });

  }

  catch(error){

    console.error(error);

    return NextResponse.json({

      properties:[]

    });

  }

}