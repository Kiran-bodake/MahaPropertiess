import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  return await mongoose.connect(MONGODB_URI);
}
