import {

  NextRequest,

  NextResponse

} from "next/server";

import {

  connectDB

} from "@/lib/mongodb";

import Notification
from "@/models/Notification";


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

    await Notification.findByIdAndUpdate(

      id,

      {

        isRead:true

      }

    );

    return NextResponse.json({

      success:true

    });

  }

  catch(error){

    console.error(

      "[NOTIFICATION_PATCH_ERROR]",

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