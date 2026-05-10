import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    propertyId: {
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
  { timestamps: true }
);

export default models.Property ||
  model("Property", PropertySchema);