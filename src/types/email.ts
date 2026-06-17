// types/email.ts
export type LeadCategory = 'real-estate' | 'commercial' | 'residential' | 'industrial';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type EmailStatus = 'queued' | 'sent' | 'failed' | 'delivered' | 'opened' | 'clicked';

export interface CategoryConfig {
  id: LeadCategory;
  name: string;
  email: string;
  cc: string[];
  bcc: string[];
  priority: Priority;
  template: string;
  webhook: string | null;
  slackChannel: string;
  autoReply: boolean;
  autoReplyMessage: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  category: LeadCategory;
  createdAt: Date;
  createdBy?: string;
  customFields?: Record<string, any>;
}

export interface EmailOptions {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  messageId?: string;
  headers?: Record<string, string>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  response?: string;
  attempt: number;
  error?: string;
}

export interface BulkEmailResult {
  total: number;
  successful: number;
  failed: number;
  details: Array<{
    leadId: string;
    email: string;
    status: 'success' | 'failed';
    messageId?: string;
    error?: string;
  }>;
}

export interface EmailLog {
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
}

export interface EmailStats {
  totalSent: number;
  successRate: number;
  failed: number;
  openRate: number;
  byCategory: Array<{
    category: LeadCategory;
    total: number;
    successful: number;
    failed: number;
  }>;
  dailyTrend: Array<{
    date: string;
    sent: number;
    opened: number;
  }>;
}