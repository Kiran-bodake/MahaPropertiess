import mongoose from "mongoose";
import Lead from "@/models/Lead";

async function seedLeads() {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/mahaproperties";

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing leads
    await Lead.deleteMany({});
    console.log("✓ Cleared existing leads");

    // Create sample leads with today's date
    const today = new Date();
    const sampleLeads = [
      {
        propertyId: "prop-001",
        propertyName: "Luxury Apartment - Bangalore",
        name: "Rajesh Kumar",
        mobileNumber: "9876543210",
        email: "rajesh@example.com",
        interest: "2 BHK",
        source: "website",
        status: "new",
        whatsappConsent: true,
        createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        propertyId: "prop-002",
        propertyName: "Modern Villa - Hyderabad",
        name: "Priya Singh",
        mobileNumber: "9123456789",
        email: "priya@example.com",
        interest: "3 BHK",
        source: "organic_search",
        status: "contacted",
        whatsappConsent: true,
        createdAt: new Date(today.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        propertyId: "prop-003",
        propertyName: "Studio Apartment - Mumbai",
        name: "Amit Patel",
        mobileNumber: "9987654321",
        email: "amit@example.com",
        interest: "1 BHK",
        source: "referral",
        status: "negotiation",
        whatsappConsent: false,
        createdAt: today, // Just now
      },
      {
        propertyId: "prop-001",
        propertyName: "Luxury Apartment - Bangalore",
        name: "Neha Verma",
        mobileNumber: "9111223344",
        email: "neha@example.com",
        interest: "3 BHK",
        source: "google_ads",
        status: "new",
        whatsappConsent: true,
        createdAt: today, // Just now
      },
    ];

    const inserted = await Lead.insertMany(sampleLeads);
    console.log(`✓ Inserted ${inserted.length} sample leads`);
    console.log("\nSample leads created:");
    inserted.forEach((lead, i) => {
      console.log(`  ${i + 1}. ${lead.name} (${lead.propertyName})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

seedLeads();
