import { Schema, model, models } from "mongoose";

const PropertyFlagsSchema = new Schema({
  propertyId: {
    type: String,
    required: true,
    index: true,
  },

  isRERA: {
    type: Boolean,
    default: false,
  },

  reraNumber: String,

  isZeroBrokerage: {
    type: Boolean,
    default: false,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default models.PropertyFlags ||
  model("PropertyFlags", PropertyFlagsSchema);