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
      userId
    } = await req.json();

    const properties =

      await Property.find({

        postedBy:
          userId

      })

      .sort({

        createdAt:-1

      });

    return NextResponse.json({

      success:true,

      properties

    });

  }

  catch(error){

    console.error(
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