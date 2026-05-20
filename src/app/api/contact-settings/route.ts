import { NextRequest, NextResponse } from "next/server";

import {connectDB } from "@/lib/mongodb";
import ContactSettings from "@/models/ContactSettings";


// GET SETTINGS
export async function GET() {
  try {
    await connectDB();

    let settings = await ContactSettings.findOne();

    // Create default document if not exists
    if (!settings) {
      settings = await ContactSettings.create({});
    }

    return NextResponse.json(settings);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}


// UPDATE SETTINGS
export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const body = await req.json();

    let settings = await ContactSettings.findOne();

    if (!settings) {

      settings = await ContactSettings.create(body);

    } else {

      settings = await ContactSettings.findByIdAndUpdate(
        settings._id,
        body,
        { new: true },
      );
    }

    console.log("Contact Settings Updated");

    return NextResponse.json({
      success: true,
      settings,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}