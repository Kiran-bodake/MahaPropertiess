import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(
  request: Request
) {

  try {

    const formData =
      await request.formData();

    // PROPERTY ID
    const propertyIdValue =
      formData.get("propertyId");

    if (

      !propertyIdValue ||

      typeof propertyIdValue !== "string"

    ) {

      return NextResponse.json(

        {
          success: false,
          error: "propertyId is required",
        },

        {
          status: 400,
        }

      );

    }

    const propertyId =
      propertyIdValue.trim();

    if (!propertyId) {

      return NextResponse.json(

        {
          success: false,
          error: "propertyId is required",
        },

        {
          status: 400,
        }

      );

    }

    // FILES
    const files =
      formData.getAll("images");

    if (!files.length) {

      return NextResponse.json(

        {
          success: false,
          error: "No files uploaded",
        },

        {
          status: 400,
        }

      );

    }

    // UPLOAD DIRECTORY
    const uploadDir =
      path.join(
        process.cwd(),
        "public",
        "uploads",
        propertyId
      );

    await mkdir(
      uploadDir,
      {
        recursive: true,
      }
    );

    const urls: string[] = [];

    // LOOP FILES
    for (const file of files) {

      console.log(
        "[UPLOAD_FILE]",
        file
      );

      // SAFE VALIDATION
      if (

        !file ||

        typeof file !== "object" ||

        !("type" in file) ||

        typeof file.type !== "string" ||

        !file.type.startsWith("image/")

      ) {

        return NextResponse.json(

          {
            success: false,
            error: "Only image files are allowed",
          },

          {
            status: 400,
          }

        );

      }

      // ARRAY BUFFER
      const bytes =
        await file.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      // FILE EXTENSION
      const ext =
        file.name

          ?

          path
            .extname(
              String(file.name)
            )
            .toLowerCase()

          :

          ".jpg";

      // SAFE FILE NAME
      const safeName =

        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}${ext}`;

      // FINAL FILE PATH
      const filePath =
        path.join(
          uploadDir,
          safeName
        );

      // SAVE FILE
      await writeFile(
        filePath,
        buffer
      );

      // SAVE URL
      urls.push(
        `/uploads/${propertyId}/${safeName}`
      );

    }

    // SUCCESS RESPONSE
    return NextResponse.json({

      success: true,

      propertyId,

      urls,

      count: urls.length,

    });

  }

  catch (error) {

    console.error(

      "[UPLOAD_ERROR]",

      error instanceof Error

        ?

        error.stack

        :

        error

    );

    return NextResponse.json(

      {
        success: false,
        error: "Upload failed",
      },

      {
        status: 500,
      }

    );

  }

}