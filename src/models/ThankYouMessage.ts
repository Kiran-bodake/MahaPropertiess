// src/models/ThankYouMessage.ts
import mongoose from "mongoose";

const ThankYouMessageSchema = new mongoose.Schema({
  title: { type: String, default: "Thank You!" },
  message: { type: String, default: "Your property inquiry has been submitted successfully. Our expert will contact you shortly." },
  buttonText: { type: String, default: "Close" },
  backgroundColor: { type: String, default: "#16a34a" },
  icon: { type: String, default: "✓" },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ThankYouMessage || mongoose.model("ThankYouMessage", ThankYouMessageSchema);