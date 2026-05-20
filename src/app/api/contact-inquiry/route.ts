import { NextRequest, NextResponse } from "next/server";

import {connectDB} from "@/lib/mongodb";

import ContactInquiry from "@/models/ContactInquiry";


// SAVE INQUIRY
export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const body = await req.json();

    await ContactInquiry.create(body);

    console.log("New Contact Inquiry Received");

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}


// GET INQUIRIES
export async function GET() {

  try {

    await connectDB();

    const inquiries = await ContactInquiry.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(inquiries);

  } catch (error) {

    console.log(error);

    return NextResponse.json([]);
  }
}