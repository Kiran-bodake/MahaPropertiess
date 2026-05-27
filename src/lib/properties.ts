import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function getAllProperties() {
  await connectDB();

  const properties = await Property.find({
    approvalStatus: "approved",
  })
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(properties));
}

export async function getPropertyById(id: string) {
  await connectDB();

  const property = await Property.findOne({
    propertyId: id,
    approvalStatus: "approved",
  }).lean();

  return property ? JSON.parse(JSON.stringify(property)) : null;
}

export async function getPropertyBySlug(slug: string) {
  await connectDB();

  const property = await Property.findOne({
    slug: slug.trim().toLowerCase(),
    approvalStatus: "approved",
  }).lean();

  return property ? JSON.parse(JSON.stringify(property)) : null;
}
