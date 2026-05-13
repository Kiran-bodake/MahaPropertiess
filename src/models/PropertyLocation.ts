import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {

    // Property Reference
    propertyId: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    // Geography
    state: {
      type: String,
      default: "",
      trim: true
    },

    city: {
      type: String,
      default: "",
      trim: true
    },

    locality: {
      type: String,
      default: "",
      trim: true
    },

    pincode: {
      type: String,
      default: "",
      trim: true
    },

    // Detailed Address
    houseNo: {
      type: String,
      default: "",
      trim: true
    },

    street: {
      type: String,
      default: "",
      trim: true
    },

    landmark: {
      type: String,
      default: "",
      trim: true
    },

    // Full Address
    address: {
      type: String,
      default: "",
      trim: true
    },

    // Coordinates
    latitude: {
      type: String,
      default: "",
      trim: true
    },

    longitude: {
      type: String,
      default: "",
      trim: true
    }

  },
  {
    timestamps: true
  }
);

const PropertyLocation =
  mongoose.models.PropertyLocation ||
  mongoose.model(
    "PropertyLocation",
    schema
  );

export default PropertyLocation;