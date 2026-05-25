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

import Notification
from "@/models/Notification";



/* =========================================
   RESOLVE REPORT
========================================= */
export async function PATCH(

  request:NextRequest,

  {

    params

  }:{

    params:Promise<{

      id:string

    }>

  }

){

  try{

    await connectDB();

    const {

      id

    } = await params;

    console.log(

      "[PATCH_REPORT_ID]",

      id

    );


    /* UPDATE REPORT STATUS */
    const updatedReport =

      await PropertyReport.findByIdAndUpdate(

        id,

        {

          $set:{

            status:"Resolved"

          }

        },

        {

          returnDocument:"after"

        }

      );

    console.log(

      "[UPDATED_REPORT]",

      updatedReport

    );


    /* REPORT NOT FOUND */
    if(!updatedReport){

      return NextResponse.json(

        {

          success:false,

          message:
            "Report not found"

        },

        {

          status:404

        }

      );

    }



    /* CREATE USER NOTIFICATION */
  if (

  updatedReport.reportedByUserId

) {

  await Notification.create({

    userId:
      updatedReport.reportedByUserId,

    title:
      "Report Resolved",

    message:
      "Your reported property has been resolved successfully.",

    type:
      "report_resolved",

    referenceId:
      updatedReport.propertyMongoId

  });

}

    return NextResponse.json({

      success:true,

      message:
        "Report resolved successfully",

      report:
        updatedReport

    });

  }

  catch(error){

    console.error(

      "[RESOLVE_REPORT_ERROR]",

      error

    );

    return NextResponse.json(

      {

        success:false,

        message:
          "Failed to resolve report"

      },

      {

        status:500

      }

    );

  }

}




/* =========================================
   DELETE REPORT
========================================= */
export async function DELETE(

  request:NextRequest,

  {

    params

  }:{

    params:Promise<{

      id:string

    }>

  }

){

  try{

    await connectDB();

    const {

      id

    } = await params;

    console.log(

      "[DELETE_REPORT_ID]",

      id

    );


    const deletedReport =

      await PropertyReport.findByIdAndDelete(

        id

      );


    /* REPORT NOT FOUND */
    if(!deletedReport){

      return NextResponse.json(

        {

          success:false,

          message:
            "Report not found"

        },

        {

          status:404

        }

      );

    }


    return NextResponse.json({

      success:true,

      message:
        "Report deleted successfully"

    });

  }

  catch(error){

    console.error(

      "[DELETE_REPORT_ERROR]",

      error

    );

    return NextResponse.json(

      {

        success:false,

        message:
          "Failed to delete report"

      },

      {

        status:500

      }

    );

  }

}