import mongoose from "mongoose";

const PropertyInquirySchema =

  new mongoose.Schema(

    {

      propertyId: {
        type: String,
        default: "",
      },

      propertyName: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
      },

      mobileNumber: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      interest: {
        type: String,
        default: "",
      },

      whatsappConsent: {
        type: Boolean,
        default: false,
      },

      propertyTitle: {
        type: String,
        default: "",
      },

      customerName: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      message: {
        type: String,
        default: "",
      },

      inquiryType: {
        type: String,
        default: "general",
      },

      status: {

        type: String,

        enum: [

          "new",

          "contacted",

          "closed"

        ],

        default: "new",

      },

    },

    {

      timestamps: true,

    }

  );



/* PROFESSIONAL MODEL EXPORT */
const PropertyInquiry =

  mongoose.models.PropertyInquiry ||

  mongoose.model(

    "PropertyInquiry",

    PropertyInquirySchema,

    "property_inquiries"

  );



export default PropertyInquiry;