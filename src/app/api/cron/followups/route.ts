import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    const dueLeads = await PropertyInquiry.find({
      nextFollowUp: { $lte: now },
      reminderSent: false,
    });

    for (const lead of dueLeads) {
      console.log("FOLLOW-UP DUE:", lead.customerName);

      // TODO: create notification here (next step)

      await PropertyInquiry.findByIdAndUpdate(lead._id, {
        reminderSent: true,
      });
    }

    return NextResponse.json({
      success: true,
      checked: dueLeads.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}