import { NextResponse }
from "next/server";

import { connectDB }
from "@/lib/mongodb";

import Notification
from "@/models/Notification";

export async function GET(){

  try{

    await connectDB();

    const activity =

      await Notification.find()

      .sort({

        createdAt:-1

      })

      .limit(8);

    return NextResponse.json({

      activity

    });

  }

  catch(error){

    console.error(error);

    return NextResponse.json({

      activity:[]

    });

  }

}