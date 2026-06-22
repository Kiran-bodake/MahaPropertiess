import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { userId, roleId } = await req.json();

  if (!userId || !roleId) {
    return NextResponse.json(
      { message: "Missing data" },
      { status: 400 }
    );
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: roleId },
    { new: true }
  ).populate("role");

  return NextResponse.json({
    success: true,
    user
  });
}