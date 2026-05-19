import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import slugify from "slugify";
import Property from "../src/models/Property";

const MONGODB_URI = process.env.MONGODB_URI!;

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected DB:", mongoose.connection.name);

  const properties = await Property.find();

  for (const p of properties) {
    if (!p.slug) {
      p.slug = slugify(`${p.title}-${p.propertyId}`, {
        lower: true,
        strict: true,
      });

      await p.save();

      console.log(`Updated: ${p.title}`);
    }
  }

  console.log("Slug updated successfully");

  process.exit();
}

run();
