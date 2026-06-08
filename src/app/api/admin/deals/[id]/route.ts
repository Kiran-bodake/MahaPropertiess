import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Deal from "@/models/Deal";

// ======================================
// GET SINGLE DEAL
// ======================================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal id",
        },
        { status: 400 }
      );
    }

    const deal = await Deal.findById(id).lean();

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deal,
    });
  } catch (error) {
    console.error("GET DEAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch deal",
      },
      { status: 500 }
    );
  }
}

// ======================================
// UPDATE DEAL
// ======================================

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal id",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    delete body._id;
    delete body.createdAt;

    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDeal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deal updated successfully",
      deal: updatedDeal,
    });
  } catch (error) {
    console.error("UPDATE DEAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update deal",
      },
      { status: 500 }
    );
  }
}

// ======================================
// DELETE DEAL
// ======================================

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal id",
        },
        { status: 400 }
      );
    }

    const deletedDeal = await Deal.findByIdAndDelete(id);

    if (!deletedDeal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deal deleted successfully",
      deletedDeal,
    });
  } catch (error) {
    console.error("DELETE DEAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete deal",
      },
      { status: 500 }
    );
  }
}