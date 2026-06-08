import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, securityCode } = body;

    console.log("Login attempt:", { email, password, securityCode });

    // Get admin credentials from .env
    const superEmail = process.env.ADMIN_SUPER_EMAIL;
    const superPassword = process.env.ADMIN_SUPER_PASSWORD;
    const superSecurityCode = process.env.ADMIN_SECURITY_CODE;

    // Check super admin credentials
    if (
      email === superEmail &&
      password === superPassword &&
      securityCode === superSecurityCode
    ) {
      console.log("Super admin login successful");
      return NextResponse.json({
        success: true,
        message: "Login successful",
        role: "super_admin",
      });
    }

    // Check sub-admin credentials
    const subEmail = process.env.ADMIN_SUB_EMAIL;
    const subPassword = process.env.ADMIN_SUB_PASSWORD;
    const subSecurityCode = process.env.ADMIN_SUB_SECURITY_CODE;

    if (
      email === subEmail &&
      password === subPassword &&
      securityCode === subSecurityCode
    ) {
      console.log("Sub admin login successful");
      return NextResponse.json({
        success: true,
        message: "Login successful",
        role: "sub_admin",
      });
    }

    console.log("Invalid credentials");
    return NextResponse.json(
      { success: false, message: "Invalid email, password, or security code" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}