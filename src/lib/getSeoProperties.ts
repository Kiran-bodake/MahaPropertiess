import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyLocation from "@/models/PropertyLocation";

export async function getSeoProperties(city: string, category: string) {
  await connectDB();

  const locations = await PropertyLocation.find({
    city: {
      $regex: new RegExp(`^${city}$`, "i"),
    },
  });

  const propertyIds = locations.map((x: any) => x.propertyId);

  const properties = await Property.find({
    propertyId: {
      $in: propertyIds,
    },
    category,
    approvalStatus: "approved",
  }).lean();

  return properties;
}
