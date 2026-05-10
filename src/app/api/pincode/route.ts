import { connectDB } from "@/lib/mongoose";
import Pincode from "@/models/Pincode";

export async function GET(req: Request) {
  try {
    // Connect MongoDB
    await connectDB();

    // Get pin from URL
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get("pin");

    if (!pin) {
      return Response.json(
        {
          success: false,
          message: "Pincode is required"
        },
        { status: 400 }
      );
    }

    // Search in MongoDB
    const location = await Pincode.findOne({
      pincode: Number(pin)
    });

    if (!location) {
      return Response.json({
        success: false,
        message: "Pincode not found"
      });
    }

    // Return data
    return Response.json({
      success: true,
      state: location.state,
      city: location.city,
      locality: location.locality,
      district: location.district
    });

  } catch (error) {
    console.error("Pincode API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}