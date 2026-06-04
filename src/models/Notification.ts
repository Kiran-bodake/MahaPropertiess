import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // ✅ faster queries for admin bell
    },

    type: {
      type: String,
      default: "lead", // keep backward compatible
      index: true, // helps filter followup vs lead
    },

    title: {
      type: String,
      required: true, // safer for UI (bell always needs title)
    },

    message: {
      type: String,
      required: true, // ensure UI never breaks
    },

    referenceId: {
      type: String,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true, // unread count becomes faster
    },

    // ✅ FOLLOW-UP SUPPORT (NEW FEATURE - SAFE ADDITION)
    followUpDate: {
      type: Date,
      default: null,
      index: true, // important for future cron / reminders
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================
   SAFE MODEL EXPORT (prevents overwrite in dev)
========================================= */
export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);