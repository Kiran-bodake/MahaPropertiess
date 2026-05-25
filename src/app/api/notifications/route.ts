import {
  NextRequest,
  NextResponse
}
from "next/server";

import {
  connectDB
}
from "@/lib/mongodb";

import Notification
from "@/models/Notification";



/* =========================================
   GET USER NOTIFICATIONS
========================================= */
export async function GET(

  req:NextRequest

){

  try{

    await connectDB();

    /* GET USER ID */
    const userId =

      req.nextUrl.searchParams.get(
        "userId"
      );


    /* VALIDATION */
    if(!userId){

      return NextResponse.json(

        {

          success:false,

          message:
            "userId is required"

        },

        {

          status:400

        }

      );

    }


    /* FETCH NOTIFICATIONS */
    const notifications =

      await Notification.find({

        userId

      })

      .sort({

        createdAt:-1

      });


    /* UNREAD COUNT */
    const unreadCount =

      notifications.filter(

        (item:any)=>

          !item.isRead

      ).length;


    return NextResponse.json({

      success:true,

      notifications,

      unreadCount

    });

  }

  catch(error){

    console.error(

      "[FETCH_NOTIFICATIONS_ERROR]",

      error

    );

    return NextResponse.json(

      {

        success:false,

        notifications:[],

        unreadCount:0

      },

      {

        status:500

      }

    );

  }

}