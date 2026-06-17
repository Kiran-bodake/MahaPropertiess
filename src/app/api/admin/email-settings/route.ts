import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import EmailSettings from '@/models/EmailSettings';

// GET - Fetch all email settings
export async function GET() {
  try {
    await connectDB();
    
    const settings = await EmailSettings.find().lean();
    
    // Default values from .env
    const defaultSettings = {
      'real-estate': process.env.REAL_ESTATE_EMAIL || '',
      'commercial': process.env.COMMERCIAL_EMAIL || '',
      'residential': process.env.RESIDENTIAL_EMAIL || '',
      'industrial': process.env.INDUSTRIAL_EMAIL || ''
    };
    
    // Override with database values if they exist
    settings.forEach((setting: any) => {
      if (setting.category && setting.emailAddress) {
        defaultSettings[setting.category as keyof typeof defaultSettings] = setting.emailAddress;
      }
    });
    
    return NextResponse.json({
      success: true,
      settings: defaultSettings
    });
    
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Update email settings
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { settings } = body;
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      );
    }
    
    // Update each category
    const updates = [];
    for (const [category, emailAddress] of Object.entries(settings)) {
      if (emailAddress && typeof emailAddress === 'string' && emailAddress.trim()) {
        const result = await EmailSettings.findOneAndUpdate(
          { category },
          { 
            emailAddress: emailAddress.trim().toLowerCase(),
            updatedAt: new Date(),
            updatedBy: 'admin'
          },
          { upsert: true, new: true }
        );
        updates.push(result);
        console.log(`✅ Updated ${category} email to: ${emailAddress}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} email settings`,
      updated: updates.length
    });
    
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    );
  }
}