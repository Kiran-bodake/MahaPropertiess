import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailSettings extends Document {
  category: string;
  emailAddress: string;
  updatedBy: string;
  updatedAt: Date;
}

const EmailSettingsSchema = new Schema({
  category: {
    type: String,
    enum: ['real-estate', 'commercial', 'residential', 'industrial'],
    required: true,
    unique: true,
    index: true
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  updatedBy: {
    type: String,
    default: 'admin'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.EmailSettings || mongoose.model<IEmailSettings>('EmailSettings', EmailSettingsSchema);