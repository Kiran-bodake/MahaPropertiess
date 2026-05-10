import mongoose from "mongoose";

const schema =
  new mongoose.Schema(
    {
      propertyId: {
        type: String,
        required: true,
        index: true,
      },

      state: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      locality: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models
    .PropertyLocation ||
  mongoose.model(
    "PropertyLocation",
    schema
  );