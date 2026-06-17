// lib/email/template.service.ts
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { Lead, LeadCategory, Priority } from '@/types/email';
import { categoryConfig } from './category.config';

export interface TemplateData {
  lead: Lead;
  categoryName: string;
  priority: Priority;
  submittedAt: string;
  appUrl: string;
  companyName: string;
  year: number;
}

export class EmailTemplateService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  private baseTemplate: HandlebarsTemplateDelegate | null = null;

  async initialize(): Promise<void> {
    await this.loadTemplates();
  }

  private async loadTemplates(): Promise<void> {
    const templateDir = path.join(process.cwd(), 'lib/email/templates');
    
    try {
      // Load base template
      const basePath = path.join(templateDir, 'base.hbs');
      const baseContent = await fs.readFile(basePath, 'utf-8');
      this.baseTemplate = Handlebars.compile(baseContent);

      // Load category-specific templates
      const files = await fs.readdir(templateDir);
      
      for (const file of files) {
        if (file.endsWith('.hbs') && file !== 'base.hbs') {
          const templateName = file.replace('.hbs', '');
          const content = await fs.readFile(path.join(templateDir, file), 'utf-8');
          this.templates.set(templateName, Handlebars.compile(content));
        }
      }

      // Register Handlebars helpers
      this.registerHelpers();
      
      console.log('Email templates loaded successfully');
    } catch (error) {
      console.error('Failed to load email templates:', error);
      throw error;
    }
  }

  private registerHelpers(): void {
    Handlebars.registerHelper('formatDate', (date: Date) => {
      return new Date(date).toLocaleString();
    });

    Handlebars.registerHelper('formatPhone', (phone: string) => {
      if (!phone) return 'N/A';
      // Format phone number (XXX) XXX-XXXX
      const cleaned = phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return phone;
    });

    Handlebars.registerHelper('priorityClass', (priority: Priority) => {
      const classes = {
        urgent: 'priority-urgent',
        high: 'priority-high',
        medium: 'priority-medium',
        low: 'priority-low'
      };
      return classes[priority];
    });
  }

  async renderTemplate(
    categoryId: LeadCategory,
    lead: Lead,
    customData?: Record<string, any>
  ): Promise<string> {
    const category = categoryConfig[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    const template = this.templates.get(category.template);
    if (!template) {
      throw new Error(`Template ${category.template} not found`);
    }

    const templateData: TemplateData = {
      lead,
      categoryName: category.name,
      priority: category.priority,
      submittedAt: new Date().toLocaleString(),
      appUrl: process.env.NEXT_PUBLIC_APP_URL!,
      companyName: process.env.COMPANY_NAME!,
      year: new Date().getFullYear(),
      ...customData
    };

    // Render category-specific template
    const content = template(templateData);
    
    // Wrap with base template if available
    if (this.baseTemplate) {
      return this.baseTemplate({ content, ...templateData });
    }

    return content;
  }

  async renderAutoReply(categoryId: LeadCategory, lead: Lead): Promise<string> {
    const category = categoryConfig[categoryId];
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    const autoReplyTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">Thank You for Contacting Us</h2>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Dear {{lead.name}},</p>
          <p>{{autoReplyMessage}}</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Reference ID:</strong> {{lead._id}}</p>
            <p style="margin: 10px 0 0 0;"><strong>Category:</strong> {{categoryName}}</p>
            <p style="margin: 10px 0 0 0;"><strong>Submitted:</strong> {{submittedAt}}</p>
          </div>
          <p>Best regards,<br>{{companyName}} Team</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    `;

    const template = Handlebars.compile(autoReplyTemplate);
    
    return template({
      lead,
      categoryName: category.name,
      autoReplyMessage: category.autoReplyMessage,
      companyName: process.env.COMPANY_NAME,
      submittedAt: new Date().toLocaleString()
    });
  }
}

export const emailTemplateService = new EmailTemplateService();