import { Schema, model, models } from "mongoose";

const PropertyHighlightSchema = new Schema({
  propertyId: {
    type: String,
    required: true,
    index: true,
  },

  highlights: {
    type: [String],
    default: [],
  },
});

export default models.PropertyHighlight ||
  model("PropertyHighlight", PropertyHighlightSchema);