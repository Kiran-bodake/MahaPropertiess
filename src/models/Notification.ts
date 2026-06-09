import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
      default: null,
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    userType: {
      type: String,
      enum: ["authenticated", "guest", "admin", "system"],
      default: "guest",
      index: true,
    },
    type: {
      type: String,
      enum: ["lead", "inquiry", "callback", "followup", "system", "admin"],
      default: "lead",
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
      default: null,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ guestId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ priority: 1, isRead: 1 });

// ✅ Safe model creation (prevents overwrite error)
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;