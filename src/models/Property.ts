import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    categoryLabel: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "available",
    },

    views: {
      type: Number,
      default: 100,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    constructionStatus: {
      type: String,
      default: "ready",
    },

    description: {
      type: String,
      default: "",
    },

    // Price & Area
    price: {
      type: Number,
      default: 0,
    },

    area: {
      type: String,
      default: "",
    },

    areaUnit: {
      type: String,
      default: "sq ft",
    },

    // Location
    locality: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    // Images
    images: {
      type: [String],
      default: [],
    },

    // Residential
    carpetArea: {
      type: String,
      default: "",
    },
    
    builtUpArea: {
      type: String,
      default: "",
    },

    bedrooms: {
      type: String,
      default: "",
    },
    
    bathrooms: {
      type: String,
      default: "",
    },

    furnishedStatus: {
      type: String,
      default: "",
    },

    // Commercial
    shopType: {
      type: String,
      default: "",
    },
    
    mainRoadFacing: {
      type: Boolean,
      default: false,
    },

    // Agriculture
    borewellAvailable: {
      type: Boolean,
      default: false,
    },
    
    roadWidth: {
      type: String,
      default: "",
    },
    
    waterSource: {
      type: String,
      default: "",
    },
    
    documentationStatus: {
      type: String,
      default: "",
    },

    // Warehouse
    powerLoad: {
      type: String,
      default: "",
    },
    
    truckAccess: {
      type: Boolean,
      default: false,
    },
    
    industrialApproved: {
      type: Boolean,
      default: false,
    },

    // ✅ AGENT / POSTER INFORMATION (UPDATED)
    postedBy: {
      type: String,
      enum: ["Owner", "Agency", "Builder", "Developer", "Agent"],
      default: "Agency",
    },

    agentName: {
      type: String,
      default: "Property Expert",
      trim: true,
    },

    agentPhone: {
      type: String,
      default: "Not Available",
      trim: true,
    },

    agentEmail: {
      type: String,
      default: "",
      trim: true,
    },

    // Badges & Features
    rera: {
      type: Boolean,
      default: false,
    },

    badge: {
      type: String,
      default: null,
    },

    highlights: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    // Map Location
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Create indexes for better search performance
PropertySchema.index({ title: "text", description: "text", locality: "text", city: "text" });
PropertySchema.index({ slug: 1 });
PropertySchema.index({ propertyId: 1 });
PropertySchema.index({ category: 1 });
PropertySchema.index({ city: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ views: -1 });
PropertySchema.index({ approvalStatus: 1 });

export default models.Property || model("Property", PropertySchema);