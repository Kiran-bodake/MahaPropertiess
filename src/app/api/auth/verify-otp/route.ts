import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import User, { IUser } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp }: { phone: string; otp: string } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone and OTP required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find OTP record
    const record = await Otp.findOne({ phone });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "OTP not found. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (record.expiresAt < new Date()) {
      await record.deleteOne();
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check attempts
    if (record.attempts >= 5) {
      await record.deleteOne();
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, record.otp);

    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json(
        { success: false, error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      // Create new user
      user = await User.create({
        name: phone.slice(-4), // Use last 4 digits of phone as default name
        phone,
        email: "",
        role: "user",
        isVerified: true,
        loginCount: 1,
        lastLoginAt: new Date(),
      });
    } else {
      // Update existing user
      user.loginCount = (user.loginCount || 0) + 1;
      user.lastLoginAt = new Date();
      user.isVerified = true;
      await user.save();
    }

    // Delete used OTP
    await record.deleteOne();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        phone: user.phone,
        role: user.role 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Get public profile (safe to send)
    const publicProfile = user.getPublicProfile();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: publicProfile,
    });

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Verify OTP Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}