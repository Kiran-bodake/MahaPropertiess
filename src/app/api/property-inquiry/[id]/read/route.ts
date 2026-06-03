import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const inquiry = await PropertyInquiry.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    // 🔔 DEV NOTIFICATION (only for testing)
    if (inquiry) {
      await Notification.create({
        userId: "admin",
        title: "Lead Opened",
        message: `You opened lead: ${
          inquiry.customerName || inquiry.name
        }`,
        type: "lead-open",
        isRead: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Marked as read + notification created (dev mode)",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}