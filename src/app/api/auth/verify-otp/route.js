import { connectDB } from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return Response.json(
        { error: "Phone and OTP required" },
        { status: 400 },
      );
    }

    await connectDB();

    const record = await Otp.findOne({ phone });

    // ❌ No OTP found
    if (!record) {
      return Response.json({ error: "OTP not found" }, { status: 400 });
    }

    // ❌ OTP expired
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ phone });
      return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    // ❌ Too many attempts
    if (record.attempts >= 5) {
      return Response.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 },
      );
    }

    // ✅ Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
      record.attempts += 1;
      await record.save();

      return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // ✅ Create or update user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        isVerified: true,
        lastLoginAt: new Date(),
        loginCount: 1,
      });
    } else {
      user.isVerified = true;
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();
    }

    // ✅ Delete OTP after success
    await Otp.deleteOne({ phone });

    // ✅ Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Set HTTP-only cookie (SECURE)
    return new Response(
      JSON.stringify({ success: true, message: "Login successful" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);

    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
