import { NextResponse } from "next/server";
import meta from "@/data/property-meta.json";

export async function GET() {
  return NextResponse.json(meta);
}
