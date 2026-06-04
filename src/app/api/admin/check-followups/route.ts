import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    // find due follow-ups
    const dueInquiries = await PropertyInquiry.find({
      nextFollowUp: { $lte: now },
      status: { $ne: "completed" },
    });

    for (const inquiry of dueInquiries) {
      await Notification.create({
        userId: "admin",
        type: "followup",
        title: "Follow-up Reminder",
        message: `Follow up: ${inquiry.customerName}`,
        referenceId: inquiry._id.toString(),
        followUpDate: inquiry.nextFollowUp,
        isRead: false,
      });
    }

    return NextResponse.json({
      success: true,
      created: dueInquiries.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}