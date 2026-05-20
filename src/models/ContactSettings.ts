import mongoose from "mongoose";

const ContactSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ContactSettings ||
  mongoose.model("ContactSettings", ContactSettingsSchema);