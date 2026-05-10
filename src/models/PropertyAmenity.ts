import { Schema, model, models } from "mongoose";

const PropertyAmenitySchema = new Schema({
  propertyId: {
    type: String,
    required: true,
    index: true,
  },

  amenities: {
    type: [String],
    default: [],
  },
});

export default models.PropertyAmenity ||
  model("PropertyAmenity", PropertyAmenitySchema);