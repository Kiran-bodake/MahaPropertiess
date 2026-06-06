import { Schema, model, models } from "mongoose";

const DealSchema = new Schema(
  {
    // Unique Deal Number
    dealNumber: {
      type: String,
      unique: true,
      index: true,
    },

    // Source Inquiry
    inquiryId: {
      type: Schema.Types.ObjectId,
      ref: "PropertyInquiry",
      required: true,
      index: true,
    },

    // Property Information
    propertyId: {
      type: String,
      default: "",
      index: true,
    },

    propertyTitle: {
      type: String,
      default: "",
    },

    propertyPrice: {
      type: Number,
      default: 0,
    },

    // Customer Information
    customerName: {
      type: String,
      required: true,
      index: true,
    },

    customerPhone: {
      type: String,
      default: "",
      index: true,
    },

    customerEmail: {
      type: String,
      default: "",
    },

    // Deal Information
    title: {
      type: String,
      required: true,
      index: true,
    },

    dealValue: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
    },

    expectedClosingDate: {
      type: Date,
      default: null,
    },

    // Deal Pipeline Status
    status: {
      type: String,
      enum: [
        "new",
        "site_visit",
        "negotiation",
        "token_paid",
        "agreement",
        "registration",
        "closed",
        "cancelled",
      ],
      default: "new",
      index: true,
    },

    // Assignment
    owner: {
      type: String,
      default: "",
      index: true,
    },

    // Notes
    notes: {
      type: String,
      default: "",
    },

    // Financial Tracking
    tokenAmount: {
      type: Number,
      default: 0,
    },

    totalReceived: {
      type: Number,
      default: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
    },

    // Flags
    isClosed: {
      type: Boolean,
      default: false,
      index: true,
    },

    isCancelled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Deal || model("Deal", DealSchema);