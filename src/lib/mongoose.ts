import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/realestate";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGO_URI);
};