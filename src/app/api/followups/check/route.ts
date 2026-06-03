import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 🔐 Simple security check (prevents public abuse)
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    const dueFollowUps = await PropertyInquiry.find({
      nextFollowUp: { $lte: now },
      reminderSent: false,
    });

    for (const lead of dueFollowUps) {
      await Notification.create({
        userId: "admin",
        title: "Follow-up Reminder",
        message: `Follow up with ${lead.customerName || lead.name}`,
        type: "followup",
        isRead: false,
      });

      lead.reminderSent = true;
      await lead.save();
    }

    return NextResponse.json({
      success: true,
      processed: dueFollowUps.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cron failed" },
      { status: 500 }
    );
  }
}