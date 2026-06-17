// models/EmailLog.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { EmailLog, LeadCategory, EmailStatus } from '@/types/email';

export interface IEmailLog extends Document {
  leadId: string;
  category: LeadCategory;
  recipientEmail: string;
  messageId?: string;
  status: EmailStatus;
  attempts: number;
  error?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedLinks?: Array<{
    link: string;
    clickedAt: Date;
  }>;
  metadata?: {
    ip?: string;
    userAgent?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmailLogSchema = new Schema({
  leadId: { type: String, required: true, index: true },
  category: { 
    type: String, 
    enum: ['real-estate', 'commercial', 'residential', 'industrial'],
    required: true,
    index: true
  },
  recipientEmail: { type: String, required: true },
  messageId: { type: String, index: true },
  status: {
    type: String,
    enum: ['queued', 'sent', 'failed', 'delivered', 'opened', 'clicked'],
    default: 'queued',
    index: true
  },
  attempts: { type: Number, default: 0 },
  error: { type: String },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  openedAt: { type: Date },
  clickedLinks: [{
    link: { type: String },
    clickedAt: { type: Date, default: Date.now }
  }],
  metadata: {
    ip: { type: String },
    userAgent: { type: String }
  }
}, {
  timestamps: true
});

// Compound indexes for queries
EmailLogSchema.index({ category: 1, status: 1 });
EmailLogSchema.index({ createdAt: -1 });

export const EmailLogModel = mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);