import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inquiry",
    },

    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
    },

    action: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      default: "System",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
  