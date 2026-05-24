import {
  NextRequest,
  NextResponse
}
from "next/server";

import {
  connectDB
}
from "@/lib/mongodb";

import PropertyReport
from "@/models/PropertyReport";



/* CREATE PROPERTY REPORT */
export async function POST(

  req:NextRequest

){

  try{

    await connectDB();

    const body =
      await req.json();


    // VALIDATION
    if(

      !body.propertyMongoId ||

      !body.reason

    ){

      return NextResponse.json(

        {

          success:false,

          message:
            "Missing required fields"

        },

        {

          status:400

        }

      );

    }


    // SAVE REPORT
    const report =

      await PropertyReport.create({

        // REAL DATABASE ID
        propertyMongoId:
          body.propertyMongoId,

        // DISPLAY ID
        propertyId:
          body.propertyId || "",

        propertyTitle:
          body.propertyTitle || "",

        reason:
          body.reason,

        status:
          "Pending"

      });


    return NextResponse.json({

      success:true,

      message:
        "Report submitted successfully",

      report

    });

  }

  catch(error){

    console.error(

      "Property Report Error:",

      error

    );

    return NextResponse.json(

      {

        success:false,

        message:
          "Failed to submit report"

      },

      {

        status:500

      }

    );

  }

}



/* FETCH ALL REPORTS */
export async function GET(){

  try{

    await connectDB();

    const reports =

      await PropertyReport.find()

      .sort({

        createdAt:-1

      });


    return NextResponse.json({

      success:true,

      reports

    });

  }

  catch(error){

    console.error(

      "Fetch Reports Error:",

      error

    );

    return NextResponse.json(

      {

        success:false,

        reports:[]

      },

      {

        status:500

      }

    );

  }

}