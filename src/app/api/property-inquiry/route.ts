import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";

// =========================================
// SAVE PROPERTY INQUIRY (WITH NOTIFICATION)
// =========================================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const inquiry = await PropertyInquiry.create(body);

    // ✅ CREATE NOTIFICATION FOR NEW LEAD
    await Notification.create({
      userId: "admin",
      type: "lead",
      title: "🆕 New Lead Received",
      message: `${inquiry.customerName || inquiry.name || "New customer"} sent an inquiry`,
      referenceId: inquiry._id.toString(),
      isRead: false,
    });

    console.log("Property Inquiry + Notification Saved");

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
      }
    );
  }
}

// =========================================
// FETCH PROPERTY INQUIRIES
// =========================================
export async function GET() {
  try {
    await connectDB();

    const inquiries = await PropertyInquiry.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      inquiries: [],
    });
  }
}