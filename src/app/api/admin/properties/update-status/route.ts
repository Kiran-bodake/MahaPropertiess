import { NextResponse }
from "next/server";

import { connectDB }
from "@/lib/mongodb";

import Property
from "@/models/Property";

export async function POST(

  req:Request

){

  try{

    await connectDB();

    const {

      id,

      status

    } = await req.json();

    await Property.findByIdAndUpdate(

      id,

      {

        approvalStatus:status

      }

    );

    return NextResponse.json({

      success:true

    });

  }

  catch(error){

    console.error(error);

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