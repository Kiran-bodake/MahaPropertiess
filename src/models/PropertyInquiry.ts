import mongoose, {
  Schema,
  Document,
  models,
  model,
} from "mongoose";

/* =========================
   TYPE SAFETY
========================= */
export interface IPropertyInquiry extends Document {
  propertyId?: string;
  propertyName?: string;

  name?: string;
  mobileNumber?: string;
  email?: string;

  interest?: string;
  whatsappConsent?: boolean;

  propertyTitle?: string;
  customerName?: string;
  phone?: string;

  message?: string;
  notes?: string;

  inquiryType?: string;

  // ✅ NEW AUTHENTICATION FIELDS
  isAuthenticated?: boolean;
  userId?: string;
  verificationToken?: string;
  verifiedAt?: Date | null;

  status:
    | "new"
    | "contacted"
    | "interested"
    | "site-visit"
    | "negotiation"
    | "closed";

  priority:
    | "hot"
    | "warm"
    | "cold";

  nextFollowUp?: Date | null;

  isRead: boolean;

  reminderSent: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */
const PropertyInquirySchema = new Schema<IPropertyInquiry>(
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

    notes: {
      type: String,
      default: "",
    },

    inquiryType: {
      type: String,
      default: "general",
    },

    // ✅ NEW FIELDS - Authentication tracking
    isAuthenticated: {
      type: Boolean,
      default: false,
      index: true, // For filtering verified vs guest leads
    },

    userId: {
      type: String,
      default: null,
      index: true, // To find all inquiries from a specific user
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "interested",
        "site-visit",
        "negotiation",
        "closed",
      ],
      default: "new",
      index: true,
    },

    priority: {
      type: String,
      enum: ["hot", "warm", "cold"],
      default: "warm",
      index: true,
    },

    nextFollowUp: {
      type: Date,
      default: null,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Add virtual field to check if user is verified
PropertyInquirySchema.virtual('isVerified').get(function() {
  return this.isAuthenticated === true || this.verifiedAt !== null;
});

// ✅ Index for efficient queries
PropertyInquirySchema.index({ createdAt: -1 });
PropertyInquirySchema.index({ status: 1, createdAt: -1 });
PropertyInquirySchema.index({ isAuthenticated: 1, createdAt: -1 });

/* =========================
   MODEL EXPORT
========================= */
const PropertyInquiry =
  models.PropertyInquiry ||
  model<IPropertyInquiry>(
    "PropertyInquiry",
    PropertyInquirySchema,
    "property_inquiries"
  );

export default PropertyInquiry;