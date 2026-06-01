import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connectDB();

  const { slug } = await params;

  await Property.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

  return NextResponse.json({
    success: true,
  });
}
