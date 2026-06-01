import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing inquiry id" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    const updatedInquiry = await PropertyInquiry.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, inquiry: updatedInquiry });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to update inquiry";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
