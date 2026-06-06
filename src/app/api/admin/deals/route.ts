import { NextRequest, NextResponse } from "next/server";
import { setupDatabase } from "@/lib/db-init";
import Deal from "@/models/Deal";
import { requireAdminUser } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminUser(req);

    if (auth instanceof NextResponse) {
      return auth;
    }

    await setupDatabase();

    const deals = await Deal.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: deals.length,
      deals,
    });
  } catch (error) {
    console.error("GET DEALS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch deals",
      },
      {
        status: 500,
      }
    );
  }
}