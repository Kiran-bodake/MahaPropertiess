import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PropertyInquiry from "@/models/PropertyInquiry";
import mongoose from "mongoose";

type AllowedUpdateFields = {
  status?: string;
  notes?: string;
  isRead?: boolean;
  priority?: "hot" | "warm" | "cold";
  nextFollowUp?: string | Date | null;
};

export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    console.log("FULL CONTEXT:", context);

    const params = await context.params;

    console.log("PARAMS:", params);

    const id = params?.id;

    console.log("PATCH INQUIRY ID:", id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing inquiry id",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid inquiry id",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const body: AllowedUpdateFields = await req.json();

    console.log("PATCH BODY:", body);
    console.log("NEXT FOLLOWUP RECEIVED:", body.nextFollowUp);

    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    if (body.isRead !== undefined) {
      updateData.isRead = body.isRead;
    }

    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }

    // FIX FOR FOLLOW-UP DATE
    if (body.nextFollowUp !== undefined) {
      if (
        body.nextFollowUp === "" ||
        body.nextFollowUp === null
      ) {
        updateData.nextFollowUp = null;
      } else {
        updateData.nextFollowUp = new Date(
          body.nextFollowUp
        );
      }
    }

    console.log("UPDATE DATA:", updateData);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields supplied",
        },
        { status: 400 }
      );
    }

    const updatedInquiry =
      await PropertyInquiry.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    console.log(
      "UPDATED INQUIRY:",
      updatedInquiry
    );

    if (!updatedInquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error(
      "PATCH /property-inquiry/[id] ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update inquiry",
      },
      { status: 500 }
    );
  }
}