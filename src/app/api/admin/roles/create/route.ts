import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Role from "@/models/Role";


export async function POST(req: Request) {

  try {

    await connectDB();


    const {
      name
    } = await req.json();


    if(!name){

      return NextResponse.json(
        {
          success:false,
          message:"Role name required"
        },
        {
          status:400
        }
      );

    }


    const existing = await Role.findOne({
      name
    });


    if(existing){

      return NextResponse.json(
        {
          success:false,
          message:"Role already exists"
        },
        {
          status:400
        }
      );

    }



    const role = await Role.create({

      name,

      permissions:[]

    });



    return NextResponse.json({

      success:true,

      role

    });


  }

  catch(error){

    console.log(error);


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