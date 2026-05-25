import { NextRequest, NextResponse } from "next/server";
import { setupDatabase } from "@/lib/db-init";
import User from "@/models/User";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {

  await setupDatabase();

  const access =
    req.cookies
      .get("propvista-access-token")
      ?.value;

  if (!access) {
    return NextResponse.json(
      { message: "Unauthenticated" },
      { status: 401 }
    );
  }

  const payload =
    verifyAccessToken(access);

  if (!payload) {
    return NextResponse.json(
      { message: "Unauthenticated" },
      { status: 401 }
    );
  }

  const user =
    await User.findById(payload.sub).lean();

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 403 }
    );
  }

  /* 🔥 IMPORTANT FIX */
  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });

}