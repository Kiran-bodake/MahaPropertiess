import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";
import { sendInquiryEmails } from "@/services/emailService"; // ✅ FIXED import
import Property from "@/models/Property"; // ✅ Add this to fetch property details

// =========================================
// HELPER: Generate slug from property title
// =========================================
const generatePropertySlug = (title: string): string => {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// =========================================
// SAVE PROPERTY INQUIRY (WITH NOTIFICATION)
// =========================================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ Extract all fields
    const {
      propertyTitle,
      propertySlug: incomingPropertySlug,
      customerName,
      name,
      email,
      phone,
      message,
      inquiryType,
      isAuthenticated,
      userId,
      verificationToken,
      propertyId,
      ...rest
    } = body;

    // ✅ Generate property slug if not provided
    const propertySlug =
      incomingPropertySlug || generatePropertySlug(propertyTitle);

    // ✅ FETCH FULL PROPERTY DETAILS FROM DATABASE
    let propertyData = null;
    if (propertyId) {
      try {
        propertyData = await Property.findById(propertyId);
        if (propertyData) {
          console.log(`✅ Found property for email: ${propertyData.title}`);
        } else {
          console.warn(`⚠️ Property not found with ID: ${propertyId}`);
        }
      } catch (error) {
        console.error("❌ Error fetching property:", error);
      }
    }

    // Prepare inquiry data with proper field mapping
    const inquiryData = {
      propertyTitle: propertyData?.title || propertyTitle || rest.propertyTitle,
      propertyId: propertyId || null,
      customerName: customerName || name || "Unknown",
      name: customerName || name || "Unknown",
      email: email || "",
      phone: phone || rest.mobileNumber || "",
      mobileNumber: phone || rest.mobileNumber || "",
      message: message || "",
      inquiryType: inquiryType || "lead-form",

      // Authentication fields
      isAuthenticated: isAuthenticated || false,
      userId: userId || null,
      verificationToken: verificationToken || null,
      verifiedAt: verificationToken ? new Date() : null,

      // Default values
      status: "new",
      priority: "warm",
      isRead: false,
      reminderSent: false,

      ...rest,
    };

    console.log("📝 Saving inquiry:", {
      propertyTitle: inquiryData.propertyTitle,
      propertySlug: propertySlug,
      customerName: inquiryData.customerName,
      phone: inquiryData.phone,
      isAuthenticated: inquiryData.isAuthenticated,
    });

    // Create inquiry in database
    const inquiry = await PropertyInquiry.create(inquiryData);

    // =========================================
    // ✅ SEND EMAIL WITH FULL PROPERTY DETAILS
    // =========================================
    try {
      // Prepare lead object for email service
      const lead = {
        _id: inquiry._id.toString(),
        name: inquiry.customerName || inquiry.name || "Guest",
        email: inquiry.email || "",
        phone: inquiry.phone || "",
        message: inquiry.message || "",
        category: inquiry.category || "real-estate",
        createdAt: inquiry.createdAt || new Date(),
        createdBy: inquiry.isAuthenticated ? "authenticated" : "guest",
        customFields: {
          propertyId: propertyId || null,
          propertyTitle: propertyData?.title || inquiry.propertyTitle || null,
          budget: propertyData?.price || null,
          preferredLocation: propertyData?.location || null,
        },
      };

      // ✅ Send email using your email service
      const emailResult = await sendInquiryEmails(lead, propertyData);

      console.log("✅ Email sent successfully:", {
        department: emailResult.departmentEmail.success,
        autoReply: emailResult.autoReply.success,
      });

      // ✅ Update inquiry with email status
      await PropertyInquiry.findByIdAndUpdate(inquiry._id, {
        emailSent: emailResult.departmentEmail.success,
        emailMessageId: emailResult.departmentEmail.messageId,
        emailError: emailResult.departmentEmail.error || null,
      });
    } catch (emailError) {
      // ✅ LOG BUT DON'T BREAK THE FLOW
      const errorMessage =
        emailError instanceof Error
          ? emailError.message
          : "Unknown email error";
      console.error("❌ Email sending failed:", errorMessage);

      // Update inquiry with email error
      await PropertyInquiry.findByIdAndUpdate(inquiry._id, {
        emailSent: false,
        emailError: errorMessage,
      });
      // ⚠️ DON'T RETURN - Continue with notification
    }

    // ✅ CREATE NOTIFICATION
    const userType = inquiry.isAuthenticated ? "Verified User" : "Guest";

    const notification = await Notification.create({
      userId: "admin",
      type: "lead",
      title: "🆕 New Lead Received",
      message: `${inquiry.customerName || inquiry.name || "New customer"} sent an inquiry - ${userType}`,
      referenceId: inquiry._id.toString(),
      isRead: false,
      metadata: {
        propertySlug: propertySlug,
        propertyTitle: inquiry.propertyTitle,
        propertyId: propertyId || null,
        isAuthenticated: inquiry.isAuthenticated,
        userId: inquiry.userId,
        phone: inquiry.phone,
        verifiedViaOTP: !!inquiry.verificationToken,
        inquiryId: inquiry._id.toString(),
        customerName: inquiry.customerName,
        createdAt: new Date().toISOString(),
        category: inquiry.category, // ✅ Add category for routing
      },
    });

    console.log("✅ Notification created with propertySlug:", propertySlug);

    return NextResponse.json({
      success: true,
      inquiry,
      notification: {
        id: notification._id,
        propertySlug: propertySlug,
      },
      email: {
        sent: true, // or false if failed
      },
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("Error saving inquiry:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save inquiry. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
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
    const status = searchParams.get("status");
    const isAuthenticated = searchParams.get("isAuthenticated");
    const userId = searchParams.get("userId");
    const propertyId = searchParams.get("propertyId");
    const category = searchParams.get("category"); // ✅ Add category filter
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Build query filters
    let query: any = {};

    if (status) query.status = status;
    if (isAuthenticated === "true") query.isAuthenticated = true;
    if (isAuthenticated === "false") query.isAuthenticated = false;
    if (userId) query.userId = userId;
    if (propertyId) query.propertyId = propertyId;
    if (category) query.category = category; // ✅ Add category filter

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
        hasMore: skip + inquiries.length < total,
      },
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
        hasMore: false,
      },
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
    const id = searchParams.get("id");

    const body = await req.json();
    const { status, priority, notes, nextFollowUp } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (notes) updateData.notes = notes;
    if (nextFollowUp) updateData.nextFollowUp = new Date(nextFollowUp);

    const inquiry = await PropertyInquiry.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}

// =========================================
// DELETE INQUIRY
// =========================================
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    const deletedInquiry = await PropertyInquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete inquiry" },
      { status: 500 },
    );
  }
}
