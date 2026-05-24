import { NextResponse } from "next/server";

import { connectDB }
from "@/lib/mongodb";

import PropertyInquiry
from "@/models/PropertyInquiry";

import Notification
from "@/models/Notification";

export async function POST(
  req: Request
) {

  try {

    /* CONNECT DATABASE */
    await connectDB();

    /* GET REQUEST BODY */
    const body =
      await req.json();

    console.log(
      "Backend body:",
      body
    );

    /* CREATE PROPERTY INQUIRY */
    const propertyInquiry =
      await PropertyInquiry.create({

        /* OLD LEAD STRUCTURE */

        propertyId:
          body.propertyId ||
          "unknown-property-id",

        propertyName:
          body.propertyName ||
          "Unknown Property",

        name:
          body.name || "",

        mobileNumber:
          body.mobileNumber || "",

        interest:
          body.interest || "Buy",

        whatsappConsent:
          body.whatsappConsent
          ?? true,

        /* NEW PROPERTY INQUIRY STRUCTURE */

        propertyTitle:
          body.propertyName ||
          "Unknown Property",

        customerName:
          body.name || "",

        phone:
          body.mobileNumber || "",

        message:
          body.message || "",

        inquiryType:
          body.interest || "Buy",

        /* COMMON */

        email:
          body.email || "",

        status:
          "new"

      });

    /* CREATE NOTIFICATION */
    await Notification.create({

      type:
        "lead",

      title:
        "New Property Inquiry",

      message:
        `${body.name} submitted inquiry for ${body.propertyName}`,

      referenceId:
        propertyInquiry._id,

      isRead:
        false

    });

    /* SUCCESS RESPONSE */
    return NextResponse.json({

      success: true,

      data:
        propertyInquiry

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        success: false,

        message:
          "Failed to save inquiry"

      },

      {

        status: 500

      }

    );

  }

}