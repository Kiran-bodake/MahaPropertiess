import nodemailer from 'nodemailer';
import EmailSettings from '@/models/EmailSettings';
import { connectDB } from './mongodb';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Cache for email settings (to avoid DB query every time)
let settingsCache: Record<string, string> = {};
let lastCacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

// Function to get category email from database or .env
async function getCategoryEmail(category: string): Promise<string> {
  try {
    // Check cache first
    const now = Date.now();
    if (now - lastCacheTime < CACHE_TTL && settingsCache[category]) {
      return settingsCache[category];
    }
    
    await connectDB();
    const setting = await EmailSettings.findOne({ category });
    
    if (setting && setting.emailAddress) {
      // Update cache
      settingsCache[category] = setting.emailAddress;
      lastCacheTime = now;
      return setting.emailAddress;
    }
    
    // Fallback to .env if no database setting found
    const fallback: Record<string, string> = {
      'real-estate': process.env.REAL_ESTATE_EMAIL || '',
      'commercial': process.env.COMMERCIAL_EMAIL || '',
      'residential': process.env.RESIDENTIAL_EMAIL || '',
      'industrial': process.env.INDUSTRIAL_EMAIL || '',
    };
    
    return fallback[category] || '';
  } catch (error) {
    console.error('Error fetching email from DB, using .env fallback:', error);
    const fallback: Record<string, string> = {
      'real-estate': process.env.REAL_ESTATE_EMAIL || '',
      'commercial': process.env.COMMERCIAL_EMAIL || '',
      'residential': process.env.RESIDENTIAL_EMAIL || '',
      'industrial': process.env.INDUSTRIAL_EMAIL || '',
    };
    return fallback[category] || '';
  }
}

// Escape HTML to prevent XSS attacks
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Email template function
function getEmailTemplate(inquiry: any): string {
  const category = inquiry.category || 'real-estate';
  const categoryNames: Record<string, string> = {
    'real-estate': '🏠 Real Estate',
    'commercial': '🏢 Commercial',
    'residential': '🏡 Residential',
    'industrial': '🏭 Industrial'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h2 { margin: 0; font-size: 24px; }
        .badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; margin-top: 10px; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; padding: 12px; background: #f8f9fa; border-radius: 8px; }
        .label { font-weight: bold; color: #4F46E5; margin-bottom: 5px; display: block; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; background: #f8f9fa; }
        .button { display: inline-block; background: #4F46E5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin-top: 15px; }
        a { color: #4F46E5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        @media (max-width: 600px) {
          .content { padding: 20px; }
          .field { margin-bottom: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h2>🆕 New ${categoryNames[category]} Inquiry</h2>
            <div class="badge">${category}</div>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Customer Name</div>
              <div class="value">${escapeHtml(inquiry.customerName || inquiry.name || 'N/A')}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email Address</div>
              <div class="value"><a href="mailto:${inquiry.email}">${escapeHtml(inquiry.email || 'N/A')}</a></div>
            </div>
            <div class="field">
              <div class="label">📞 Phone Number</div>
              <div class="value">${escapeHtml(inquiry.phone || inquiry.mobileNumber || 'N/A')}</div>
            </div>
            <div class="field">
              <div class="label">🏢 Property</div>
              <div class="value">${escapeHtml(inquiry.propertyTitle || inquiry.propertyName || 'N/A')}</div>
            </div>
            ${inquiry.message ? `
            <div class="field">
              <div class="label">💬 Message</div>
              <div class="value">${escapeHtml(inquiry.message)}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">📅 Submitted At</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/property-inquiries/${inquiry._id}" class="button">View in Admin Panel →</a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from ${process.env.COMPANY_NAME || 'MahaProps'}</p>
            <p style="font-size: 10px;">Powered by Brevo SMTP</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Main function to send inquiry email
export async function sendInquiryEmail(inquiry: any) {
  const category = inquiry.category || 'real-estate';
  
  // ✅ Get email from database (or .env fallback)
  const toEmail = await getCategoryEmail(category);
  
  if (!toEmail) {
    console.log(`❌ No email configured for category: ${category}`);
    console.log(`💡 Please configure email for ${category} in admin panel`);
    return { success: false, error: `No recipient configured for ${category}` };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: `🔔 New ${category.toUpperCase()} Inquiry - ${inquiry.customerName || inquiry.name || 'Customer'}`,
      html: getEmailTemplate(inquiry),
      replyTo: inquiry.email,
      headers: {
        'X-Category': category,
        'X-Priority': '1',
        'X-Lead-ID': inquiry._id?.toString() || 'new'
      }
    });
    
    console.log(`✅ Email sent successfully!`);
    console.log(`   📧 To: ${toEmail}`);
    console.log(`   🏷️ Category: ${category}`);
    console.log(`   📋 Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId, to: toEmail };
  } catch (error) {
    console.error(`❌ Email failed for ${category}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

// Function to test email connection
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email transporter is ready');
    return { success: true, message: 'Email service is ready!' };
  } catch (error) {
    console.error('❌ Email transporter error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
  }
}

// Function to clear cache (useful after admin updates)
export function clearEmailCache() {
  settingsCache = {};
  lastCacheTime = 0;
  console.log('🗑️ Email settings cache cleared');
}