import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = params;

    const inquiry = await PropertyInquiry.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update inquiry",
      },
      {
        status: 500,
      }
    );
  }
}
