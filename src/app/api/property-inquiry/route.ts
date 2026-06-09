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

    // ✅ Extract all fields including auth fields
    const {
      propertyTitle,
      customerName,
      name,
      email,
      phone,
      message,
      inquiryType,
      isAuthenticated,
      userId,
      verificationToken,
      ...rest
    } = body;

    // Prepare inquiry data with proper field mapping
    const inquiryData = {
      // Map to existing schema fields
      propertyTitle: propertyTitle || rest.propertyTitle,
      customerName: customerName || name || "Unknown",
      name: customerName || name || "Unknown",
      email: email || "",
      phone: phone || rest.mobileNumber || "",
      mobileNumber: phone || rest.mobileNumber || "",
      message: message || "",
      inquiryType: inquiryType || "lead-form",
      
      // ✅ NEW AUTHENTICATION FIELDS
      isAuthenticated: isAuthenticated || false,
      userId: userId || null,
      verificationToken: verificationToken || null,
      verifiedAt: verificationToken ? new Date() : null,
      
      // Default values
      status: "new",
      priority: "warm",
      isRead: false,
      reminderSent: false,
      
      ...rest
    };

    console.log("📝 Saving inquiry with auth data:", {
      propertyTitle: inquiryData.propertyTitle,
      customerName: inquiryData.customerName,
      phone: inquiryData.phone,
      isAuthenticated: inquiryData.isAuthenticated,
      userId: inquiryData.userId,
      hasVerificationToken: !!inquiryData.verificationToken,
      verifiedAt: inquiryData.verifiedAt
    });

    // Create inquiry in database
    const inquiry = await PropertyInquiry.create(inquiryData);

    // ✅ CREATE NOTIFICATION FOR NEW LEAD
    const userType = inquiry.isAuthenticated ? 'Verified User' : 'Guest (OTP Verified)';
    await Notification.create({
      userId: "admin",
      type: "lead",
      title: "🆕 New Lead Received",
      message: `${inquiry.customerName || inquiry.name || "New customer"} sent an inquiry - ${userType}`,
      referenceId: inquiry._id.toString(),
      isRead: false,
      metadata: {
        isAuthenticated: inquiry.isAuthenticated,
        userId: inquiry.userId,
        phone: inquiry.phone,
        propertyTitle: inquiry.propertyTitle,
        verifiedViaOTP: !!inquiry.verificationToken,
        inquiryId: inquiry._id.toString()
      }
    });

    console.log("✅ Property Inquiry + Notification Saved");

    return NextResponse.json({
      success: true,
      inquiry,
      message: "Inquiry submitted successfully"
    });

  } catch (error) {
    console.error("Error saving inquiry:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save inquiry. Please try again.",
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
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const isAuthenticated = searchParams.get('isAuthenticated');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build query filters
    let query: any = {};
    
    if (status) query.status = status;
    if (isAuthenticated === 'true') query.isAuthenticated = true;
    if (isAuthenticated === 'false') query.isAuthenticated = false;
    if (userId) query.userId = userId;

    const inquiries = await PropertyInquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await PropertyInquiry.countDocuments(query);

    return NextResponse.json({
      success: true,
      inquiries,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + inquiries.length < total
      }
    });

  } catch (error) {
    console.error("Error fetching inquiries:", error);

    return NextResponse.json({
      success: false,
      inquiries: [],
      pagination: {
        total: 0,
        limit: 0,
        skip: 0,
        hasMore: false
      }
    });
  }
}

// =========================================
// UPDATE INQUIRY STATUS
// =========================================
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    const body = await req.json();
    const { status, priority, notes, nextFollowUp } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (notes) updateData.notes = notes;
    if (nextFollowUp) updateData.nextFollowUp = new Date(nextFollowUp);

    const inquiry = await PropertyInquiry.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry
    });

  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}