import { NextResponse } from "next/server";
import properties from "@/moc-data/properties.json";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const property = properties.find(
      (item: any) =>
        item.slug?.trim().toLowerCase() === slug?.trim().toLowerCase(),
    );

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load property" },
      { status: 500 },
    );
  }
}
