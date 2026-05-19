import { NextResponse }
from "next/server";

import { connectDB }
from "@/lib/mongodb";

import Property
from "@/models/Property";

export async function GET(){

  try{

    await connectDB();

    const properties =

      await Property.find()

      .sort({

        createdAt:-1

      })

      .limit(10);

    return NextResponse.json({

      properties

    });

  }

  catch(error){

    console.error(error);

    return NextResponse.json({

      properties:[]

    });

  }

}