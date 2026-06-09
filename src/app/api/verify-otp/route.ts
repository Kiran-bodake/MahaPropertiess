import { NextResponse } from "next/server";

declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number; attempts: number }>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    console.log("🔐 [verify-otp] Request received:", { phone, otp });

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.toString().replace(/\D/g, "");
    const cleanOtp = otp.toString().trim();

    console.log("🔐 [verify-otp] Cleaned data:", { cleanPhone, cleanOtp });

    const storedData = global.otpStore?.get(cleanPhone);

    console.log("🔐 [verify-otp] Stored data:", storedData);

    if (!storedData) {
      return NextResponse.json(
        { error: "No OTP requested or OTP expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (Date.now() > storedData.expiresAt) {
      global.otpStore.delete(cleanPhone);
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (storedData.attempts >= 3) {
      global.otpStore.delete(cleanPhone);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (storedData.otp !== cleanOtp) {
      storedData.attempts++;
      console.log("❌ [verify-otp] Invalid OTP. Expected:", storedData.otp, "Got:", cleanOtp);
      return NextResponse.json(
        { error: `Invalid OTP. ${3 - storedData.attempts} attempts remaining` },
        { status: 400 }
      );
    }

    // Success
    global.otpStore.delete(cleanPhone);
    
    const userId = `user_${Date.now()}_${cleanPhone}`;
    const token = Buffer.from(`${cleanPhone}_${Date.now()}_${Math.random()}`).toString("base64");
    
    console.log("✅ [verify-otp] Success for phone:", cleanPhone);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: userId,
        _id: userId,
        phone: cleanPhone,
        name: null,
        email: null,
        isVerified: true,
        verifiedAt: new Date().toISOString()
      },
      token: token
    });

  } catch (error) {
    console.error("❌ [verify-otp] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}