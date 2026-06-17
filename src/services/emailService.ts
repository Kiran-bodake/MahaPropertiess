// services/emailService.ts
import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import EmailSettings from '../models/EmailSettings';
import { 
  LeadCategory, 
  EmailOptions, 
  EmailResult, 
  Lead,
  CategoryConfig,
  Priority
} from '../types/email';

dotenv.config();

// ==========================================
// TRANSPORTER CONFIGURATION
// ==========================================

let transporter: Transporter | null = null;

const createTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
};

// ==========================================
// DATABASE HELPERS
// ==========================================

/**
 * Get department email from database
 */
export const getCategoryEmail = async (category: LeadCategory): Promise<string> => {
  try {
    const settings = await EmailSettings.findOne({ category });
    
    if (settings?.emailAddress) {
      return settings.emailAddress;
    }
    
    // Fallback to .env
    const envMap: Record<LeadCategory, string | undefined> = {
      'real-estate': process.env.REAL_ESTATE_EMAIL,
      'commercial': process.env.COMMERCIAL_EMAIL,
      'residential': process.env.RESIDENTIAL_EMAIL,
      'industrial': process.env.INDUSTRIAL_EMAIL
    };
    
    return envMap[category] || process.env.SMTP_FROM || '';
  } catch (error) {
    console.error('❌ Error getting category email:', error);
    return process.env.SMTP_FROM || '';
  }
};

/**
 * Get department name from category
 */
export const getDepartmentName = async (category: LeadCategory): Promise<string> => {
  try {
    const settings = await EmailSettings.findOne({ category });
    return settings?.emailAddress?.split('@')[0] || category.replace('-', ' ').toUpperCase();
  } catch (error) {
    return category.replace('-', ' ').toUpperCase();
  }
};

/**
 * Initialize default email settings
 */
export const initializeEmailSettings = async (): Promise<void> => {
  try {
    const defaultEmails: { category: LeadCategory; emailAddress: string }[] = [
      { category: 'residential', emailAddress: process.env.RESIDENTIAL_EMAIL || process.env.SMTP_FROM || '' },
      { category: 'commercial', emailAddress: process.env.COMMERCIAL_EMAIL || process.env.SMTP_FROM || '' },
      { category: 'real-estate', emailAddress: process.env.REAL_ESTATE_EMAIL || process.env.SMTP_FROM || '' },
      { category: 'industrial', emailAddress: process.env.INDUSTRIAL_EMAIL || process.env.SMTP_FROM || '' }
    ];

    for (const data of defaultEmails) {
      await EmailSettings.findOneAndUpdate(
        { category: data.category },
        { 
          emailAddress: data.emailAddress,
          updatedBy: 'system',
          updatedAt: new Date()
        },
        { upsert: true }
      );
    }
    
    console.log('✅ Email settings initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize email settings:', error);
  }
};

// ==========================================
// EMAIL TEMPLATES WITH FULL PROPERTY DETAILS & LOGO
// ==========================================

// ✅ LOGO URL - Change this to your actual logo URL
const LOGO_URL = process.env.NODE_ENV === 'production' 
  ? 'https://mahaproperties.in/mahaproperties-logo.png'
  : 'http://localhost:3000/mahaproperties-logo.png';
/**
 * Generate detailed property inquiry email with FULL PROPERTY DETAILS
 */
const getDetailedPropertyEmailTemplate = (lead: Lead, property: any, departmentName: string): string => {
  const categoryName = lead.category.replace('-', ' ').toUpperCase();
  
  // Format price in Indian Rupees
  const formattedPrice = property?.price 
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(property.price)
    : 'Contact for price';

  // Generate features list
  const featuresList = property?.features?.length 
    ? property.features.map((f: string) => `<li>✅ ${f}</li>`).join('')
    : '<li>No features listed</li>';

  // Generate images
  const imagesHtml = property?.images?.length
    ? property.images.map((img: string) => `
        <img src="${img}" alt="Property image" style="width: 100%; max-width: 200px; border-radius: 8px; margin: 5px;" />
      `).join('')
    : '<p>No images available</p>';

  // Get status color
  const getStatusColor = (status: string) => {
    if (!status) return '#6b7280';
    const lower = status.toLowerCase();
    if (lower === 'available' || lower === 'active') return '#16a34a';
    if (lower === 'sold' || lower === 'inactive') return '#dc2626';
    if (lower === 'under-construction') return '#f59e0b';
    return '#6b7280';
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; margin: 0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        
        /* ✅ HEADER WITH LOGO */
        .header { 
          background: linear-gradient(135deg, #1a56db, #2563eb); 
          color: white; 
          padding: 25px; 
          text-align: center; 
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .header-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }
        .header-text h1 { 
          margin: 0; 
          font-size: 28px; 
        }
        .header-text p { 
          margin: 5px 0 0; 
          opacity: 0.9; 
        }
        
        .content { padding: 25px; }
        .section { background: #f8fafc; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1a56db; }
        .section-title { color: #1a56db; font-size: 18px; font-weight: bold; margin-top: 0; margin-bottom: 15px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #1f2937; }
        .badge { display: inline-block; background: #16a34a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        .price { font-size: 28px; font-weight: bold; color: #1a56db; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-left: 20px; }
        .features-grid li { list-style: none; padding: 4px 0; }
        .images-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 10px 0; }
        .footer { 
          margin-top: 25px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          color: #666; 
          font-size: 12px; 
          text-align: center; 
        }
        .footer-logo {
          width: 40px;
          height: 40px;
          margin: 0 auto 10px;
        }
        .footer-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
        .status-available { color: #16a34a; font-weight: bold; }
        .status-sold { color: #dc2626; font-weight: bold; }
        .status-under-construction { color: #f59e0b; font-weight: bold; }
        @media (max-width: 600px) {
          .container { padding: 15px; }
          .features-grid { grid-template-columns: 1fr; }
          .detail-row { flex-direction: column; }
          .header { flex-direction: column; gap: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- ✅ HEADER WITH LOGO -->
        <div class="header">
          <div class="header-logo">
            <img src="${LOGO_URL}" alt="MahaProps Logo" />
          </div>
          <div class="header-text">
            <h1>🏠 MahaProps Real Estate</h1>
            <p>${departmentName}</p>
          </div>
        </div>
        
        <div class="content">
          <!-- Priority Badge -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap;">
            <span class="badge">🔔 NEW INQUIRY</span>
            <span style="color: #666; font-size: 14px;">${new Date().toLocaleString()}</span>
          </div>

          <!-- Buyer Details -->
          <div class="section">
            <h3 class="section-title">👤 Buyer / Client Details</h3>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${lead.name}</span>
            </div>
            <div class="detail-row">
              <span class="label">📧 Email:</span>
              <span class="value"><a href="mailto:${lead.email}" style="color: #1a56db;">${lead.email}</a></span>
            </div>
            <div class="detail-row">
              <span class="label">📱 Phone:</span>
              <span class="value">${lead.phone || 'Not provided'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🏷️ Category:</span>
              <span class="value">${lead.category}</span>
            </div>
            ${lead.message ? `
              <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                <span class="label">💬 Message:</span>
                <p style="margin: 5px 0 0;">${lead.message}</p>
              </div>
            ` : ''}
          </div>

          <!-- Property Details -->
          <div class="section" style="border-left-color: #f59e0b;">
            <h3 class="section-title">🏠 Property Details</h3>
            
            <div style="text-align: center; margin-bottom: 15px;">
              <span class="price">${formattedPrice}</span>
            </div>

            <div class="detail-row">
              <span class="label">Title:</span>
              <span class="value" style="font-weight: bold;">${property?.title || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Category:</span>
              <span class="value">${property?.category || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">📍 Location:</span>
              <span class="value">${property?.location || 'Not specified'}</span>
            </div>
            <div class="detail-row">
              <span class="label">📐 Area:</span>
              <span class="value">${property?.area || 'N/A'} sq.ft.</span>
            </div>
            ${property?.bedrooms ? `
              <div class="detail-row">
                <span class="label">🛏️ Bedrooms:</span>
                <span class="value">${property.bedrooms}</span>
              </div>
            ` : ''}
            ${property?.bathrooms ? `
              <div class="detail-row">
                <span class="label">🛁 Bathrooms:</span>
                <span class="value">${property.bathrooms}</span>
              </div>
            ` : ''}
            ${property?.propertyType ? `
              <div class="detail-row">
                <span class="label">🏗️ Property Type:</span>
                <span class="value">${property.propertyType}</span>
              </div>
            ` : ''}
            ${property?.status ? `
              <div class="detail-row">
                <span class="label">📊 Status:</span>
                <span class="value" style="color: ${getStatusColor(property.status)}; font-weight: bold;">${property.status.toUpperCase()}</span>
              </div>
            ` : ''}
            ${property?.listedBy ? `
              <div class="detail-row">
                <span class="label">👤 Listed By:</span>
                <span class="value">${property.listedBy}</span>
              </div>
            ` : ''}
            ${property?.listingDate ? `
              <div class="detail-row">
                <span class="label">📅 Listing Date:</span>
                <span class="value">${new Date(property.listingDate).toLocaleDateString()}</span>
              </div>
            ` : ''}
          </div>

          <!-- Description -->
          ${property?.description ? `
            <div class="section" style="border-left-color: #16a34a;">
              <h3 class="section-title">📝 Description</h3>
              <p style="line-height: 1.6;">${property.description}</p>
            </div>
          ` : ''}

          <!-- Features -->
          ${property?.features?.length ? `
            <div class="section" style="border-left-color: #8b5cf6;">
              <h3 class="section-title">✨ Features & Amenities</h3>
              <ul class="features-grid">
                ${featuresList}
              </ul>
            </div>
          ` : ''}

          <!-- Images -->
          ${property?.images?.length ? `
            <div class="section" style="border-left-color: #ec4899;">
              <h3 class="section-title">🖼️ Property Images</h3>
              <div class="images-grid">
                ${imagesHtml}
              </div>
            </div>
          ` : ''}

          <!-- Quick Actions -->
          <div class="highlight">
            <p style="margin: 0;"><strong>📌 Quick Actions:</strong></p>
            <div style="display: flex; gap: 15px; margin-top: 10px; flex-wrap: wrap;">
              <a href="mailto:${lead.email}" style="background: #1a56db; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">📧 Reply to Buyer</a>
              ${lead.phone ? `<a href="tel:${lead.phone}" style="background: #16a34a; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">📞 Call Buyer</a>` : ''}
              ${property?.customUrl ? `<a href="${property.customUrl}" style="background: #6b7280; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">🔗 View Property</a>` : ''}
            </div>
          </div>

          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
            This is an automated notification from MahaProps Real Estate System.
          </p>
        </div>

        <!-- ✅ FOOTER WITH LOGO -->
        <div class="footer">
          <div class="footer-logo">
            <img src="${LOGO_URL}" alt="MahaProps Logo" />
          </div>
          <p>&copy; ${new Date().getFullYear()} MahaProps Real Estate. All rights reserved.</p>
          <p style="margin: 0; font-size: 10px; color: #9ca3af;">Powered by MahaProps CMS • Inquiry ID: ${lead._id?.slice(-8) || 'N/A'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate auto-reply template for buyer with property summary
 */
const getAutoReplyWithPropertyTemplate = (lead: Lead, property: any, departmentName: string): string => {
  const formattedPrice = property?.price 
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(property.price)
    : 'Contact for price';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        /* ✅ HEADER WITH LOGO */
        .header { 
          background: linear-gradient(135deg, #1a56db, #2563eb); 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 10px 10px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        .header-logo {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          padding: 6px;
        }
        .header-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 0; opacity: 0.9; font-size: 14px; }
        
        .content { padding: 20px; }
        .footer { 
          margin-top: 20px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          color: #666; 
          font-size: 12px; 
          text-align: center; 
        }
        .footer-logo {
          width: 35px;
          height: 35px;
          margin: 0 auto 8px;
        }
        .footer-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .highlight { background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .price { font-size: 24px; font-weight: bold; color: #1a56db; }
        @media (max-width: 600px) {
          .header { flex-direction: column; gap: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- ✅ HEADER WITH LOGO -->
        <div class="header">
          <div class="header-logo">
            <img src="${LOGO_URL}" alt="MahaProps Logo" />
          </div>
          <div>
            <h1>🏠 MahaProps Real Estate</h1>
            <p>${departmentName}</p>
          </div>
        </div>
        
        <div class="content">
          <h2>Hello ${lead.name}! 👋</h2>
          <p>Thank you for contacting <strong>MahaProps Real Estate</strong>.</p>
          <p>We have received your inquiry regarding <strong>${lead.category}</strong> properties.</p>
          
          ${property ? `
            <div class="highlight">
              <p style="margin: 0 0 10px;"><strong>📋 Property Summary:</strong></p>
              <p style="margin: 5px 0;"><strong>🏠</strong> ${property.title || 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>💰</strong> <span class="price">${formattedPrice}</span></p>
              <p style="margin: 5px 0;"><strong>📍</strong> ${property.location || 'Not specified'}</p>
              ${property.area ? `<p style="margin: 5px 0;"><strong>📐</strong> ${property.area} sq.ft.</p>` : ''}
              ${property.bedrooms ? `<p style="margin: 5px 0;"><strong>🛏️</strong> ${property.bedrooms} Bedrooms</p>` : ''}
              ${property.bathrooms ? `<p style="margin: 5px 0;"><strong>🛁</strong> ${property.bathrooms} Bathrooms</p>` : ''}
            </div>
          ` : ''}
          
          <p>Our <strong>${departmentName}</strong> team will get back to you within <strong>24 hours</strong> with detailed information.</p>
          
          <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📞 Need immediate assistance?</strong></p>
            <p style="margin: 5px 0;">📧 support@mahaproperties.com</p>
          </div>
          
          <p>We look forward to helping you find your dream property! 🏡</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            <strong>Inquiry ID:</strong> ${lead._id?.slice(-8) || 'N/A'}<br>
            <strong>Date:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
        
        <!-- ✅ FOOTER WITH LOGO -->
        <div class="footer">
          <div class="footer-logo">
            <img src="${LOGO_URL}" alt="MahaProps Logo" />
          </div>
          <p>&copy; ${new Date().getFullYear()} MahaProps Real Estate. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==========================================
// MAIN SEND FUNCTIONS WITH PROPERTY DATA
// ==========================================

/**
 * Send inquiry to department with FULL property details
 */
export const sendInquiryToDepartment = async (lead: Lead, property?: any): Promise<EmailResult> => {
  try {
    const transporter = createTransporter();
    const toEmail = await getCategoryEmail(lead.category);
    const departmentName = await getDepartmentName(lead.category);
    
    if (!toEmail) {
      throw new Error(`No email found for category: ${lead.category}`);
    }

    const propertyTitle = property?.title || lead.customFields?.propertyTitle || 'Property';
    console.log(`📧 Sending inquiry to ${departmentName} (${toEmail})`);
    console.log(`🏠 Property: ${propertyTitle}`);

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: `🔔 New ${lead.category} Inquiry - ${propertyTitle} - ${lead.name}`,
      html: getDetailedPropertyEmailTemplate(lead, property, departmentName),
      replyTo: lead.email,
      headers: {
        'X-Category': lead.category,
        'X-Priority': 'high',
        'X-Property-ID': property?._id?.toString() || lead.customFields?.propertyId || 'N/A',
        'X-Inquiry-ID': lead._id || 'new',
        'X-Inquiry-Time': new Date().toISOString()
      }
    });

    console.log(`✅ Department email sent: ${result.messageId}`);

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
      attempt: 1
    };

  } catch (error) {
    console.error('❌ Department email failed:', error);
    return {
      success: false,
      attempt: 1,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Send auto-reply to buyer with property summary
 */
export const sendAutoReply = async (lead: Lead, property?: any): Promise<EmailResult> => {
  try {
    const transporter = createTransporter();
    const departmentName = await getDepartmentName(lead.category);
    const propertyTitle = property?.title || lead.customFields?.propertyTitle || 'Property';

    console.log(`📧 Sending auto-reply to ${lead.email}`);

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: lead.email,
      subject: `✅ Inquiry Received - ${propertyTitle} - MahaProps`,
      html: getAutoReplyWithPropertyTemplate(lead, property, departmentName)
    });

    console.log(`✅ Auto-reply sent: ${result.messageId}`);

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
      attempt: 1
    };

  } catch (error) {
    console.error('❌ Auto-reply failed:', error);
    return {
      success: false,
      attempt: 1,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * SEND BOTH EMAILS WITH FULL PROPERTY DETAILS
 */
export const sendInquiryEmails = async (lead: Lead, property?: any): Promise<{
  departmentEmail: EmailResult;
  autoReply: EmailResult;
}> => {
  const propertyTitle = property?.title || lead.customFields?.propertyTitle || 'Property';
  console.log(`🚀 Sending emails with full property details...`);
  console.log(`📤 Property: ${propertyTitle}`);
  
  const [departmentEmail, autoReply] = await Promise.all([
    sendInquiryToDepartment(lead, property),
    sendAutoReply(lead, property)
  ]);

  console.log(`✅ Both emails sent successfully!`);
  console.log(`   📧 Department: ${departmentEmail.success ? '✅' : '❌'}`);
  console.log(`   📧 Auto-reply: ${autoReply.success ? '✅' : '❌'}`);

  return {
    departmentEmail,
    autoReply
  };
};

// ==========================================
// EXPORTS
// ==========================================

export default {
  getCategoryEmail,
  getDepartmentName,
  getAllCategorySettings: async () => await EmailSettings.find().sort({ category: 1 }),
  updateCategoryEmail: async (category: LeadCategory, emailAddress: string, updatedBy: string = 'admin') => {
    return await EmailSettings.findOneAndUpdate(
      { category },
      { emailAddress: emailAddress.toLowerCase().trim(), updatedBy, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  },
  initializeEmailSettings,
  sendInquiryToDepartment,
  sendAutoReply,
  sendInquiryEmails
};