import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  const db = await mongoose.connect(MONGODB_URI);

  console.log("Connected DB:", db.connection.name);

  return db;
}
