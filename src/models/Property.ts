import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    categoryLabel: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "available",
    },

    views: {
      type: Number,
      default: 100,
    },

    approvalStatus: {
      type: String,

      enum: ["pending", "approved", "rejected"],

      default: "pending",
    },

    constructionStatus: {
      type: String,
      default: "ready",
    },

    description: {
      type: String,
      default: "",
    },

    postedBy: String,
    agentName: String,
    agentPhone: String,
  },
  { timestamps: true },
);

export default models.Property || model("Property", PropertySchema);
