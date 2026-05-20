import mongoose from "mongoose";

const PropertyInquirySchema = new mongoose.Schema(
  {
    propertyTitle: String,

    customerName: String,

    email: String,

    phone: String,

    message: String,

    inquiryType: String,

    status: {
      type: String,
      default: "new",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.PropertyInquiry ||
  mongoose.model("PropertyInquiry", PropertyInquirySchema);