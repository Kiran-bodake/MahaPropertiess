import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Permission from "@/models/Permission";

export async function GET() {
  try {
    await connectDB();

    const permissions = await Permission.find();

    return NextResponse.json({
      success: true,
      permissions,
    });

  } catch (error) {
    console.error("Permission API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch permissions",
      },
      { status: 500 }
    );
  }
}