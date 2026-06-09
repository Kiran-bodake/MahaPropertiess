import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();

    // Create sample notifications
    const samples = [
      {
        type: "lead",
        title: "📋 New Lead: 2BHK Apartment",
        message: "Rahul Sharma (9876543210) is interested in 2BHK Apartment in Nashik",
        priority: "high",
        userType: "guest",
        metadata: { name: "Rahul Sharma", phone: "9876543210", property: "2BHK Apartment" }
      },
      {
        type: "lead",
        title: "📋 New Lead: Commercial Shop",
        message: "Priya Patel (8765432109) wants to buy Commercial Shop in College Road",
        priority: "high",
        userType: "authenticated",
        metadata: { name: "Priya Patel", phone: "8765432109", property: "Commercial Shop" }
      },
      {
        type: "inquiry",
        title: "❓ Price Inquiry",
        message: "Amit Kumar asked: What is the price per square foot?",
        priority: "medium",
        userType: "guest",
        metadata: { name: "Amit Kumar", question: "Price per square foot?" }
      },
      {
        type: "callback",
        title: "📞 Callback Request",
        message: "Neha Singh requested a callback for Site Visit tomorrow",
        priority: "high",
        userType: "authenticated",
        metadata: { name: "Neha Singh", phone: "7654321098", preferredTime: "Tomorrow 11 AM" }
      },
      {
        type: "system",
        title: "⚙️ System Update",
        message: "New property listing 'Luxury Villa' added successfully",
        priority: "low",
        userType: "system",
        metadata: { property: "Luxury Villa", action: "added" }
      }
    ];

    const created = [];
    for (const sample of samples) {
      const notif = await Notification.create(sample);
      created.push(notif);
    }

    return NextResponse.json({
      success: true,
      message: `✅ Created ${created.length} sample notifications`,
      notifications: created.map(n => ({ title: n.title, type: n.type, priority: n.priority }))
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}