import { NextRequest, NextResponse } from "next/server";

import {connectDB} from "@/lib/mongodb";

import PropertyInquiry from "@/models/PropertyInquiry";


// SAVE PROPERTY INQUIRY
export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const body = await req.json();

    const inquiry = await PropertyInquiry.create(body);

    console.log("Property Inquiry Saved");

    return NextResponse.json({
      success: true,
      inquiry,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save inquiry",
      },
      {
        status: 500,
      },
    );
  }
}


// FETCH PROPERTY INQUIRIES
export async function GET() {

  try {

    await connectDB();

    const inquiries = await PropertyInquiry.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(inquiries);

  } catch (error) {

    console.log(error);

    return NextResponse.json([]);
  }
}