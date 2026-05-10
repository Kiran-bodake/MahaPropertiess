import { Schema, model, models } from "mongoose";

const PropertyPricingSchema = new Schema({
  propertyId: {
    type: String,
    required: true,
    index: true,
  },

  price: Number,

  pricePerUnit: Number,

  priceNegotiable: {
    type: Boolean,
    default: false,
  },
});

export default models.PropertyPricing ||
  model("PropertyPricing", PropertyPricingSchema);