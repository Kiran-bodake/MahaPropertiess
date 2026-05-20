import mongoose from "mongoose";

const ContactInquirySchema = new mongoose.Schema(
  {
    fullName: String,

    email: String,

    phone: String,

    message: String,

    status: {
      type: String,
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", ContactInquirySchema);