import { NextResponse }
  from "next/server";

import { connectDB }
  from "@/lib/mongodb";

import Property
  from "@/models/Property";

export async function POST(
  req: Request
){

  try{

    await connectDB();

    const {
      id
    } = await req.json();

    console.log(
      "Approving property:",
      id
    );

    const updatedProperty =

      await Property.findByIdAndUpdate(

        id,

        {

          approvalStatus:
            "approved"

        },

        {

          returnDocument: "after"

        }

      );

    console.log(
      "Updated:",
      updatedProperty
    );

    return NextResponse.json({

      success:true

    });

  }

  catch(error){

    console.error(
      "Approve error:",
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