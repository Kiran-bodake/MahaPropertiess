import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, securityCode } = body;

    // Get admin credentials from .env
    const superEmail = process.env.ADMIN_SUPER_EMAIL;
    const superPassword = process.env.ADMIN_SUPER_PASSWORD;
    const superSecurityCode = process.env.ADMIN_SECURITY_CODE;

    // Check super admin
    if (email === superEmail && password === superPassword && securityCode === superSecurityCode) {
      const token = jwt.sign(
 {
   email,
   role:"super-admin"
 },
 process.env.JWT_SECRET!,
 {
   expiresIn:"7d"
 }
)

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        role: "super-admin",
      });

      response.cookies.set("propvista-access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // Check sub admin
    const subEmail = process.env.ADMIN_SUB_EMAIL;
    const subPassword = process.env.ADMIN_SUB_PASSWORD;
    const subSecurityCode = process.env.ADMIN_SUB_SECURITY_CODE;

    if (email === subEmail && password === subPassword && securityCode === subSecurityCode) {
     const token = jwt.sign(
{
 email,
 role:"admin"
},
process.env.JWT_SECRET!,
{
 expiresIn:"7d"
}
);

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        role: "admin",
      });

    response.cookies.set("propvista-access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}