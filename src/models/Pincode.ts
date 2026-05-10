import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    pincode: Number,
    state: String,
    city: String,
    locality: String,
    district: String,
  },
  {
    collection: "Pincode"
  }
);

export default mongoose.models.Pincode ||
  mongoose.model("Pincode", schema);