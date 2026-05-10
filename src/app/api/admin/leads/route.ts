import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { requireAdminUser } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdminUser(req);
  if (auth instanceof NextResponse) {
    return auth;
  }

  await connectDB();

  const leads = await Lead.find()
    .select("_id name mobileNumber source status createdAt")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Transform mobileNumber to contact for frontend compatibility
  const transformedLeads = leads.map((lead) => ({
    _id: lead._id,
    name: lead.name,
    contact: lead.mobileNumber,
    source: lead.source,
    status: lead.status,
    createdAt: lead.createdAt,
  }));

  return NextResponse.json({ leads: transformedLeads });
}
