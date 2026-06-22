import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/user";
import Role from "@/models/Role";


export async function POST(req: Request) {

  try {


    await connectDB();


    const {
      userId,
      roleId
    } = await req.json();



    if(!userId || !roleId){

      return NextResponse.json(
        {
          success:false,
          message:"userId and roleId required"
        },
        {
          status:400
        }
      );

    }



    // check role exists

    const role =
      await Role.findById(roleId);



    if(!role){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid role"
        },
        {
          status:404
        }
      );

    }



    // update user role

    const user =

      await User.findByIdAndUpdate(

        userId,

        {
          role: role._id
        },

        {
          new:true
        }

      )
      .populate("role");





    if(!user){

      return NextResponse.json(
        {
          success:false,
          message:"User not found"
        },
        {
          status:404
        }
      );

    }





    return NextResponse.json({

      success:true,

      message:"Role assigned successfully",

      user

    });



  }

  catch(error){


    console.error(
      "Assign role error:",
      error
    );


    return NextResponse.json(

      {
        success:false,
        message:"Server error"
      },

      {
        status:500
      }

    );


  }

}