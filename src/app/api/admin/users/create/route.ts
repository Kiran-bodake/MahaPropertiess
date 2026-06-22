import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Role from "@/models/Role";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      phone,
      password,
      roleId
    } = body;


    if(!roleId){

      return NextResponse.json(
        {
          success:false,
          message:"Role is required"
        },
        {
          status:400
        }
      );

    }



    // check role exists

    const role = await Role.findById(roleId);


    if(!role){

      return NextResponse.json(
        {
          success:false,
          message:"Invalid role"
        },
        {
          status:400
        }
      );

    }



    const passwordHash =
      await bcrypt.hash(password,10);



    const user = await User.create({

      name,

      email,

      phone,

      passwordHash,

      role: role._id,

      isVerified:true

    });



    return NextResponse.json({

      success:true,

      user

    });


  }

  catch(error:any){

    console.log(error);


    return NextResponse.json(
      {
        success:false,
        message:error.message
      },
      {
        status:500
      }
    );

  }

}