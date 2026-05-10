import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI; // ✅ FIXED

  console.log("ENV:", uri); // debug

  if (!uri) {
    throw new Error("MONGODB_URI is missing ❌");
  }

  await mongoose.connect(uri);
  console.log("✅ MongoDB Connected");
};