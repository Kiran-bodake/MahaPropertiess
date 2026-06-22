import { NextResponse } from "next/server";
import Role from "@/models/Role";
import { connectDB } from "@/lib/db";

// GET roles
export async function GET() {
  try {
    await connectDB();

   const roles = await Role.find()
.populate("permissions");

    return NextResponse.json({
      success: true,
      roles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}