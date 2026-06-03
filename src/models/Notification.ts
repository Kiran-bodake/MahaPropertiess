import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    type: {
      type: String, // keep as it is (no breaking change)
      
    },

    title: {
      type: String,
    },

    message: {
      type: String,
    },

    referenceId: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    // ✅ ADD ONLY THIS (SAFE EXTENSION)
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);