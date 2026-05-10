import mongoose from "mongoose";

const schema = new mongoose.Schema({
  propertyId: {
  type: String,
  required: true,
  index: true,
},

  postedBy: {
    type: String,
    enum: ["owner", "dealer", "builder"],
    required: true,
  },

  name: { type: String, required: true },
  phone: { type: String, required: true },

}, { timestamps: true });

export default mongoose.models.PropertyUser || mongoose.model("PropertyUser", schema);