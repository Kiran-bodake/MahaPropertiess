import { Schema, model, models } from "mongoose";

const PropertyAreaSchema = new Schema({
  propertyId: {
  type: String,
  required: true,
  index: true,
},

  area: Number,

  areaUnit: String,

  convertedSqft: Number,
});

export default models.PropertyArea ||
  model("PropertyArea", PropertyAreaSchema);