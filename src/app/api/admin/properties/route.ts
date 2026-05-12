import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  try {

    await connectDB();

    const properties = await Property.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      properties
    });

  } catch (error) {

    console.error("Property fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        properties: []
      },
      { status: 500 }
    );
  }
}