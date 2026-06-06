import { NextRequest, NextResponse } from "next/server";
import { setupDatabase } from "@/lib/db-init";
import Deal from "@/models/Deal";
import PropertyInquiry from "@/models/PropertyInquiry";
import { requireAdminUser } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await setupDatabase();

    const { inquiryId } = await req.json();

    if (!inquiryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry ID is required",
        },
        { status: 400 }
      );
    }

    const inquiry = await PropertyInquiry.findById(
      inquiryId
    );

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found",
        },
        { status: 404 }
      );
    }

    // Prevent duplicate deal creation
    const existingDeal = await Deal.findOne({
      inquiryId,
    });

    if (existingDeal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal already exists",
          dealId: existingDeal._id,
        },
        { status: 409 }
      );
    }

    const dealCount =
      await Deal.countDocuments();

    const dealNumber = `DEAL-${String(
      dealCount + 1
    ).padStart(5, "0")}`;

    const deal = await Deal.create({
      dealNumber,

      inquiryId: inquiry._id,

      title:
        inquiry.propertyTitle ||
        inquiry.propertyName ||
        "Property Deal",

      propertyId:
        inquiry.propertyId || "",

      propertyTitle:
        inquiry.propertyTitle ||
        inquiry.propertyName ||
        "",

      customerName:
        inquiry.customerName ||
        inquiry.name ||
        "",

      customerPhone:
        inquiry.phone ||
        inquiry.mobileNumber ||
        "",

      customerEmail:
        inquiry.email || "",

      notes:
        inquiry.message || "",

      status: "new",
    });

    return NextResponse.json({
      success: true,
      message:
        "Inquiry converted to deal successfully",
      deal,
    });
  } catch (error) {
    console.error(
      "CONVERT DEAL ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to convert inquiry to deal",
      },
      {
        status: 500,
      }
    );
  }
}