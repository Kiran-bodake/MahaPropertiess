// src/middleware/adminAuth.ts
import { NextRequest, NextResponse } from "next/server";

export function verifyAdmin(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  const isValid = adminKey === process.env.ADMIN_SECRET_KEY;
  
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  return null;
}