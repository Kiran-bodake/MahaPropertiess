// lib/email/category.config.ts
import { CategoryConfig, LeadCategory } from '@/types/email';

export const categoryConfig: Record<LeadCategory, CategoryConfig> = {
  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate',
    email: process.env.REAL_ESTATE_EMAIL || 'realestate@yourcompany.com',
    cc: process.env.REAL_ESTATE_CC?.split(',') || [],
    bcc: process.env.REAL_ESTATE_BCC?.split(',') || [],
    priority: 'high',
    template: 'real-estate',
    webhook: process.env.REAL_ESTATE_WEBHOOK || null,
    slackChannel: '#real-estate-leads',
    autoReply: true,
    autoReplyMessage: 'Thank you for your real estate inquiry. Our team will contact you within 24 hours.'
  },
  'commercial': {
    id: 'commercial',
    name: 'Commercial',
    email: process.env.COMMERCIAL_EMAIL || 'commercial@yourcompany.com',
    cc: process.env.COMMERCIAL_CC?.split(',') || [],
    bcc: process.env.COMMERCIAL_BCC?.split(',') || [],
    priority: 'high',
    template: 'commercial',
    webhook: process.env.COMMERCIAL_WEBHOOK || null,
    slackChannel: '#commercial-leads',
    autoReply: true,
    autoReplyMessage: 'Thank you for your commercial property inquiry.'
  },
  'residential': {
    id: 'residential',
    name: 'Residential',
    email: process.env.RESIDENTIAL_EMAIL || 'residential@yourcompany.com',
    cc: process.env.RESIDENTIAL_CC?.split(',') || [],
    bcc: process.env.RESIDENTIAL_BCC?.split(',') || [],
    priority: 'medium',
    template: 'residential',
    webhook: null,
    slackChannel: '#residential-leads',
    autoReply: true,
    autoReplyMessage: 'Thank you for your residential inquiry.'
  },
  'industrial': {
    id: 'industrial',
    name: 'Industrial',
    email: process.env.INDUSTRIAL_EMAIL || 'industrial@yourcompany.com',
    cc: process.env.INDUSTRIAL_CC?.split(',') || [],
    bcc: process.env.INDUSTRIAL_BCC?.split(',') || [],
    priority: 'urgent',
    template: 'industrial',
    webhook: process.env.INDUSTRIAL_WEBHOOK || null,
    slackChannel: '#industrial-leads',
    autoReply: true,
    autoReplyMessage: 'Thank you for your industrial property inquiry.'
  }
};

export const getCategoryById = (id: string): CategoryConfig | undefined => {
  return Object.values(categoryConfig).find(cat => cat.id === id);
};

export const getCategoryByEmail = (email: string): CategoryConfig | undefined => {
  return Object.values(categoryConfig).find(cat => cat.email === email);
};