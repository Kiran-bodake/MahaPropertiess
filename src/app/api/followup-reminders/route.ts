import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    console.log("=================================");
    console.log("CHECKING FOLLOWUPS:", now);
    console.log("=================================");

    // DEBUG: Fetch all leads
    const allLeads = await PropertyInquiry.find().lean();

    console.log("TOTAL LEADS:", allLeads.length);

    allLeads.forEach((lead: any) => {
      console.log({
        id: lead._id,
        customerName: lead.customerName,
        status: lead.status,
        nextFollowUp: lead.nextFollowUp,
        reminderSent: lead.reminderSent,
      });
    });

    const dueLeads = await PropertyInquiry.find({
      nextFollowUp: {
        $ne: null,
        $lte: now,
      },
      reminderSent: false,
    });

    console.log(
      "DUE LEADS FOUND:",
      dueLeads.length
    );

    for (const lead of dueLeads) {
      await Notification.create({
        title: "Follow Up Reminder",

        message: `Call ${
          lead.customerName ||
          lead.name ||
          "Customer"
        } regarding ${
          lead.propertyTitle ||
          lead.propertyName ||
          "Property"
        }`,

        type: "followup",

        isRead: false,
      });

      await PropertyInquiry.findByIdAndUpdate(
        lead._id,
        {
          $set: {
            reminderSent: true,
          },
        }
      );

      console.log(
        "REMINDER CREATED FOR:",
        lead._id
      );
    }

    // ✅ RETURN DEBUG DATA
    return NextResponse.json({
      success: true,
      currentTime: now,
      remindersCreated: dueLeads.length,
      totalLeads: allLeads.length,
      leads: allLeads,
    });
  } catch (error) {
    console.error(
      "FOLLOWUP REMINDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}