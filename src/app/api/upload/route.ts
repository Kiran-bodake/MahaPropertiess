import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData  = await request.formData();
    const propertyId = (formData.get("propertyId") as string | null)?.trim();

    if (!propertyId) {
      return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
    }

    const files = formData.getAll("images") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", propertyId);
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const buffer   = Buffer.from(await file.arrayBuffer());
      const ext      = path.extname(file.name).toLowerCase() || ".jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      urls.push(`/uploads/${propertyId}/${safeName}`);
    }

    return NextResponse.json({ urls, propertyId });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
