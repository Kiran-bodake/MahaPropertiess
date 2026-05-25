import {
  NextRequest,
  NextResponse
}
from "next/server";



/* =========================================
   GET LOGGED-IN USER
========================================= */
export async function GET(

  req:NextRequest

){

  try{

    /* GET USER FROM LOCAL STORAGE COOKIE */
    const userCookie =

      req.cookies.get(
        "user"
      );


    /* NO USER */
    if(!userCookie){

      return NextResponse.json(

        {

          success:false,

          user:null

        },

        {

          status:401

        }

      );

    }


    /* PARSE USER */
    const user =

      JSON.parse(
        userCookie.value
      );


    return NextResponse.json({

      success:true,

      user

    });

  }

  catch(error){

    console.error(

      "[AUTH_ME_ERROR]",

      error

    );

    return NextResponse.json(

      {

        success:false,

        user:null

      },

      {

        status:500

      }

    );

  }

}