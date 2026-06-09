import { NextResponse } from "next/server";

declare global {
  var otpStore: Map<string, { otp: string; expiresAt: number; attempts: number }>;
}

if (!global.otpStore) {
  global.otpStore = new Map();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;

    console.log("📱 [send-otp] Request received for phone:", phone);

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.toString().replace(/\D/g, "");
    
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global.otpStore.set(cleanPhone, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    console.log("📱 [send-otp] OTP generated:", otp, "for phone:", cleanPhone);
    console.log("📱 [send-otp] Store size:", global.otpStore.size);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      debugOtp: otp // Always send for debugging
    });

  } catch (error) {
    console.error("❌ [send-otp] Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}