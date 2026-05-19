import { NextResponse }
  from "next/server";

import { connectDB }
  from "@/lib/mongodb";

import Lead
  from "@/models/Lead";


export async function GET(){

  try{

    await connectDB();


    // Total leads
    const totalLeads =

      await Lead.countDocuments();


    // Today's leads
    const today =
      new Date();

    today.setHours(
      0,0,0,0
    );

    const todayLeads =

      await Lead.countDocuments({

        createdAt:{

          $gte: today

        }

      });


    // New leads
    const newLeads =

      await Lead.countDocuments({

        status:"new"

      });


    // Closed leads
    const closedLeads =

      await Lead.countDocuments({

        status:"closed"

      });


    // Unread leads
    const unreadLeads =

      await Lead.countDocuments({

        isViewed:false

      });


    return NextResponse.json({

      totalLeads,

      todayLeads,

      newLeads,

      closedLeads,

      unreadLeads

    });

  }

  catch(error){

    console.error(
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