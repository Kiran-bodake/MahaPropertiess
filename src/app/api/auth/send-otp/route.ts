import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate 6-digit OTP
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP
    const hashedOtp: string = await bcrypt.hash(otp, 10);
    
    // Expires in 5 minutes
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000);

    // Save or update OTP record
    await Otp.findOneAndUpdate(
      { phone },
      {
        otp: hashedOtp,
        expiresAt,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    // Log OTP for testing (remove in production)
    console.log(`📱 OTP for ${phone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      testOtp: otp, // Remove in production
    });
  } catch (error: unknown) {
    console.error("Send OTP Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}