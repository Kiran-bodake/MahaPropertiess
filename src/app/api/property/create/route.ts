import { connectDB } from "@/lib/mongoose";
import { createProperty } from "@/services/property.service";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
console.log("Backend body:", body);
console.log("API Received:", body);
  try {
    const property = await createProperty(body);
    return Response.json({ success: true, property });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false }, { status: 500 });
  }
}