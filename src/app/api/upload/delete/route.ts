import { NextResponse } from "next/server";

import fs from "fs/promises";

import path from "path";

export async function POST(
  request: Request
){

  try {

    const body =
      await request.json();

    const imageUrl =
      body.imageUrl;

    if(!imageUrl){

      return NextResponse.json(

        {
          success:false,
          error:"Image URL required"
        },

        {
          status:400
        }

      );

    }

    // REMOVE STARTING /
    const relativePath =

      imageUrl.startsWith("/")

      ?

      imageUrl.slice(1)

      :

      imageUrl;

    // CREATE FULL FILE PATH
    const filePath =
      path.join(

        process.cwd(),

        "public",

        relativePath

      );

    // DELETE IMAGE FILE
    await fs.unlink(filePath);

    return NextResponse.json({

      success:true

    });

  }

  catch(error){

    console.error(
      "[DELETE_IMAGE_ERROR]",
      error
    );

    return NextResponse.json(

      {
        success:false,
        error:"Failed to delete image"
      },

      {
        status:500
      }

    );

  }

}