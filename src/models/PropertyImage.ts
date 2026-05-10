import { Schema, model, models } from "mongoose";

const PropertyImageSchema = new Schema({
  propertyId: {
    type: String,
    required: true,
    index: true,
  },

  images: [
    {
      url: String,

      fileName: String,

      fileSize: String,

      isPrimary: {
        type: Boolean,
        default: false,
      },

      displayOrder: Number,
    },
  ],
});

export default models.PropertyImage ||
  model("PropertyImage", PropertyImageSchema);