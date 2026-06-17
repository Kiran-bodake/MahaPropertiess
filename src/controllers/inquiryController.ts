// src/controllers/inquiryController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendInquiryEmails } from '../services/emailService';
import { Lead, LeadCategory } from '../types/email';
import Property from '../models/Property'; // ✅ Import Property model

/**
 * Create inquiry and send INSTANT email with FULL property details
 */
export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      phone, 
      message, 
      category, 
      propertyId,
      propertyTitle,
      budget,
      preferredLocation
    } = req.body;

    // 1. VALIDATE REQUIRED FIELDS
    if (!name || !email || !category) {
      res.status(400).json({
        success: false,
        error: 'Name, email, and category are required'
      });
      return;
    }

    // 2. VALIDATE CATEGORY
    const validCategories: LeadCategory[] = ['real-estate', 'commercial', 'residential', 'industrial'];
    if (!validCategories.includes(category as LeadCategory)) {
      res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
      return;
    }

    // 3. ✅ FETCH FULL PROPERTY DETAILS FROM DATABASE
    let property = null;
    if (propertyId) {
      try {
        property = await Property.findById(propertyId);
        if (property) {
          console.log(`✅ Found property: ${property.title} (${property.price})`);
        } else {
          console.warn(`⚠️ Property not found with ID: ${propertyId}`);
        }
      } catch (error) {
        console.error('❌ Error fetching property:', error);
      }
    }

    // 4. CREATE LEAD OBJECT with property data
    const lead: Lead = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      email,
      phone,
      message,
      category: category as LeadCategory,
      createdAt: new Date(),
      createdBy: 'guest',
      customFields: {
        propertyId: propertyId || null,
        propertyTitle: property?.title || propertyTitle || null,
        budget: budget || property?.price || null,
        preferredLocation: preferredLocation || property?.location || null,
        propertyData: property || null // ✅ Store full property data
      }
    };

    // 5. ✅ SEND EMAILS WITH FULL PROPERTY DETAILS
    console.log(`📧 Sending instant emails for inquiry from ${name}...`);
    console.log(`🏠 Property: ${property?.title || 'Not specified'}`);
    const emailResults = await sendInquiryEmails(lead, property); // ✅ Pass property

    // 6. SAVE TO DATABASE (Optional - uncomment when you have Inquiry model)
    // const Inquiry = require('../models/Inquiry').default;
    // const inquiry = await Inquiry.create({
    //   name,
    //   email,
    //   phone,
    //   message,
    //   category: category as LeadCategory,
    //   propertyId: property?._id || null,
    //   propertyTitle: property?.title || propertyTitle || null,
    //   propertyPrice: property?.price || null,
    //   budget: budget || null,
    //   preferredLocation: preferredLocation || property?.location || null,
    //   status: 'pending',
    //   emailSent: emailResults.departmentEmail.success,
    //   emailMessageId: emailResults.departmentEmail.messageId,
    //   emailError: emailResults.departmentEmail.error,
    //   createdAt: new Date()
    // });

    // 7. RESPONSE
    res.status(201).json({
      success: true,
      message: '✅ Inquiry submitted successfully! We will contact you soon.',
      data: {
        inquiry: {
          id: lead._id,
          name: lead.name,
          email: lead.email,
          category: lead.category,
          createdAt: lead.createdAt
        },
        property: property ? {
          id: property._id,
          title: property.title,
          price: property.price,
          location: property.location,
          area: property.area,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          propertyType: property.propertyType,
          status: property.status
        } : null,
        emails: {
          department: {
            sent: emailResults.departmentEmail.success,
            messageId: emailResults.departmentEmail.messageId || null,
            error: emailResults.departmentEmail.error || null
          },
          autoReply: {
            sent: emailResults.autoReply.success,
            messageId: emailResults.autoReply.messageId || null,
            error: emailResults.autoReply.error || null
          }
        }
      }
    });

  } catch (error) {
    console.error('❌ Inquiry creation failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
};