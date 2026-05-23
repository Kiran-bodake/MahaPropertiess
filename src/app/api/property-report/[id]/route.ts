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



/* UPDATE REPORT STATUS */
export async function PATCH(

  req:NextRequest,

  {
    params
  }:{

    params:{
      id:string
    }

  }

){

  try{

    await connectDB();

    const report =

      await PropertyReport.findByIdAndUpdate(

        params.id,

        {

          status:"Resolved",

          resolvedAt:
            new Date()

        },

        {

          new:true

        }

      );


    if(!report){

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
        "Report resolved successfully",

      report

    });

  }

  catch(error){

    console.error(

      "Resolve Report Error:",

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




/* DELETE REPORT */
export async function DELETE(

  req:NextRequest,

  {
    params
  }:{

    params:{
      id:string
    }

  }

){

  try{

    await connectDB();

    const report =

      await PropertyReport.findByIdAndDelete(

        params.id

      );


    if(!report){

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

      "Delete Report Error:",

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