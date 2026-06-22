import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  const users = await User.find().populate("role");

  return NextResponse.json({
    success: true,
    users
  });
}