import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactInquiry from "@/models/ContactInquiry";

// SAVE INQUIRY
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    await ContactInquiry.create(body);

    console.log("New Contact Inquiry Received");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

// GET INQUIRIES
export async function GET() {
  try {
    await connectDB();

    const inquiries = await ContactInquiry.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.log(error);

    return NextResponse.json([]);
  }
}

// DELETE INQUIRY
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const deletedInquiry = await ContactInquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete inquiry",
      },
      {
        status: 500,
      }
    );
  }
}