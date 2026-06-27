import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Otp from "@/models/Otp";
import User from "@/models/user";
import Role from "@/models/Role";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {

  try {

    const {
      phone,
      otp
    } = await req.json();



    if(!phone || !otp){

      return NextResponse.json(
        {
          success:false,
          error:"Phone and OTP required"
        },
        {
          status:400
        }
      );

    }



    await connectDB();




    // FIND OTP

    const record = await Otp.findOne({
      phone
    });



    if(!record){

      return NextResponse.json(
        {
          success:false,
          error:"OTP not found"
        },
        {
          status:400
        }
      );

    }




    // OTP EXPIRY

    if(record.expiresAt < new Date()){


      await record.deleteOne();


      return NextResponse.json(
        {
          success:false,
          error:"OTP expired"
        },
        {
          status:400
        }
      );

    }






    // VERIFY OTP


    const isValid = await bcrypt.compare(

      otp,

      record.otp

    );



    if(!isValid){


      record.attempts =
        (record.attempts || 0) + 1;


      await record.save();



      return NextResponse.json(
        {
          success:false,
          error:"Invalid OTP"
        },
        {
          status:400
        }
      );

    }







    // FIND USER


    let user = await User.findOne({

      phone

    });









    // CREATE USER


    if(!user){



      // GET DEFAULT USER ROLE

      const userRole = await Role.findOne({

        name:"user"

      });





      if(!userRole){


        return NextResponse.json(
          {
            success:false,
            error:"User role not found in database"
          },
          {
            status:500
          }
        );


      }






      const passwordHash =

        await bcrypt.hash(

          crypto.randomUUID(),

          10

        );







      user = await User.create({


        name:

          `User ${phone.slice(-4)}`,


        phone,



        email:

          `${phone}@temp.com`,



        passwordHash,



        role:

          userRole._id,



        isVerified:true,



        loginCount:1,



        lastLoginAt:

          new Date()



      });




    }







    // EXISTING USER LOGIN



    else {



      // FIX OLD USERS


      if(!user.email){


        user.email =
          `${phone}@temp.com`;


      }





      if(!user.passwordHash){


        user.passwordHash =

          await bcrypt.hash(

            crypto.randomUUID(),

            10

          );


      }





      user.loginCount =

        (user.loginCount || 0) + 1;




      user.lastLoginAt =

        new Date();




      user.isVerified = true;




      await user.save();



    }









    // DELETE OTP


    await record.deleteOne();








    // JWT TOKEN



    const token = jwt.sign(


      {

        userId:user._id,

        phone:user.phone,

        role:user.role


      },


      process.env.JWT_SECRET!,


      {

        expiresIn:"7d"

      }


    );









    const response = NextResponse.json({


      success:true,


      message:"Login successful",


      user:user.getPublicProfile()



    });










    response.cookies.set(


      "propvista-access-token",


      token,


      {


        httpOnly:true,


        secure:

          process.env.NODE_ENV === "production",



        sameSite:"lax",



        maxAge:

          7 * 24 * 60 * 60,



        path:"/"


      }


    );








    return response;





  }



  catch(error:any){



    console.error(

      "Verify OTP Error:",

      error

    );



    return NextResponse.json(

      {

        success:false,

        error:error.message || "OTP verification failed"

      },

      {

        status:500

      }

    );


  }


}