import { NextResponse } from "next/server";
import { getPropertyBySlug } from "@/lib/properties";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const property = await getPropertyBySlug(slug);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load property" },
      { status: 500 },
    );
  }
}
