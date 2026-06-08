// src/app/api/thankyou-messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ThankYouMessage from "@/models/ThankYouMessage";

// GET - Fetch messages
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");
    
    let query = {};
    if (active === "true") {
      query = { isActive: true };
    }
    
    const messages = await ThankYouMessage.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// POST - Create message
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (body.isActive) {
      await ThankYouMessage.updateMany({}, { isActive: false });
    }
    
    const newMessage = await ThankYouMessage.create(body);
    
    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create" }, { status: 500 });
  }
}

// PUT - Update message
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    
    if (!id) {
      return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }
    
    if (body.isActive) {
      await ThankYouMessage.updateMany({ _id: { $ne: id } }, { isActive: false });
    }
    
    const updated = await ThankYouMessage.findByIdAndUpdate(id, body, { new: true });
    
    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

// DELETE - Delete message
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }
    
    await ThankYouMessage.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}