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



/* =========================================
   CREATE PROPERTY REPORT
========================================= */
export async function POST(

  req: NextRequest

){

  try {

    await connectDB();

    const body =
      await req.json();

    console.log(
      "[PROPERTY_REPORT_BODY]",
      body
    );


    const {

      propertyMongoId,

      propertyId,

      propertyTitle,

      reason,
      reportedByUserId,

  reportedByName,

  reportedByPhone


    } = body;


    /* VALIDATION */
    if (

      !propertyMongoId ||

      !reason

    ) {

      return NextResponse.json(

        {

          success:false,

          message:
            "propertyMongoId and reason are required"

        },

        {

          status:400

        }

      );

    }


    /* SAVE REPORT */
    const report =

      await PropertyReport.create({

        // REAL PROPERTY MONGO ID
        propertyMongoId,

        // DISPLAY PROPERTY ID
        propertyId:
          propertyId || "",

        // PROPERTY TITLE
        propertyTitle:
          propertyTitle || "",

        reportedByUserId:
           reportedByUserId || "",

        reportedByName:
           reportedByName || "",

        reportedByPhone:
            reportedByPhone || "",

        // REPORT REASON
        reason,

        // DEFAULT STATUS
        status:"Pending"

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

      "[PROPERTY_REPORT_ERROR]",

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




/* =========================================
   FETCH ALL REPORTS
========================================= */
export async function GET(){

  try {

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

      "[FETCH_REPORTS_ERROR]",

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