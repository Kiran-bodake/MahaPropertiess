import { NextResponse }
  from "next/server";

import { connectDB }
  from "@/lib/mongodb";

import Lead
  from "@/models/Lead";


export async function POST(

  req: Request

){

  try{

    await connectDB();

    const {

      id

    } = await req.json();


    console.log(

      "Received Lead ID:",

      id

    );


    const updatedLead =

      await Lead.findByIdAndUpdate(

        id,

        {

          isViewed:true

        },

        {

          new:true

        }

      );


    console.log(

      "Updated Lead:",

      updatedLead

    );


    return NextResponse.json({

      success:true,

      updatedLead

    });

  }

  catch(error){

    console.error(

      "VIEW ERROR:",

      error

    );

    return NextResponse.json(

      {

        success:false

      },

      {

        status:500

      }

    );

  }

}