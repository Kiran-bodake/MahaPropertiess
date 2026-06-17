<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/enquiry";
import { leadSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await connectDB();
    const enquiries = await Enquiry.find().populate("propertyId", "title slug").sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(enquiries);
  } catch (e) {
    logger.error("GET /api/enquiries", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const parsed = leadSchema.parse(await req.json());
    const enquiry = await Enquiry.create(parsed);
    return NextResponse.json({ success: true, id: enquiry._id }, { status: 201 });
  } catch (e) {
    logger.error("POST /api/enquiries", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 400 });
  }
}
=======
import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  propertyId?: string;
  propertyTitle?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobileNumber?: string;
  message?: string;
  category: 'real-estate' | 'commercial' | 'residential' | 'industrial';
  inquiryType?: string;
  isAuthenticated?: boolean;
  userId?: string;
  status?: string;
  priority?: string;
  notes?: string;
  isRead?: boolean;
  nextFollowUp?: Date;
  emailSent?: boolean;
  emailMessageId?: string;
  emailError?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EnquirySchema = new Schema({
  propertyId: { type: String, index: true },
  propertyTitle: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  mobileNumber: { type: String },
  message: { type: String },
  category: {
    type: String,
    enum: ['real-estate', 'commercial', 'residential', 'industrial'],
    default: 'real-estate',
    index: true,
  },
  inquiryType: { type: String, default: 'lead-form' },
  isAuthenticated: { type: Boolean, default: false },
  userId: { type: String, index: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'site-visit', 'negotiation', 'closed'],
    default: 'new',
    index: true,
  },
  priority: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm',
  },
  notes: { type: String },
  isRead: { type: Boolean, default: false, index: true },
  nextFollowUp: { type: Date, default: null },
  emailSent: { type: Boolean, default: false },
  emailMessageId: { type: String },
  emailError: { type: String },
}, {
  timestamps: true,
});

// Indexes
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ category: 1, createdAt: -1 });

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
>>>>>>> 2011411 (updated code)
