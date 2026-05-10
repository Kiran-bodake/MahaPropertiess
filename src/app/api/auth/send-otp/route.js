import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return Response.json(
        { error: "Phone number required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 HASH OTP (IMPORTANT FIX)
    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { phone },
      {
        otp: hashedOtp,
        expiresAt,
        attempts: 0,
      },
      { upsert: true }
    );

    // 👉 TEMP (for testing only)
    console.log("OTP:", otp);

    // ❌ DO NOT send OTP in response (production)
    return Response.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}