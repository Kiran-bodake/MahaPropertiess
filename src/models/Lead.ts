import mongoose, { Schema } from "mongoose";

const LeadSchema = new Schema(
  {
    propertyId: {
      type: String,
      required: true,
    },

    propertyName: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    interest: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      default: "website",
      index: true,
    },

    isViewed:{

  type:Boolean,

  default:false

},


assignedTo: {

  type: String,

  default: null,

  index: true

},

notes: {

  type: String,

  default: ""

},



    status: {
      type: String,
      enum: ["new", "contacted", "negotiation", "closed"],
      default: "new",
      index: true,
    },

    whatsappConsent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
