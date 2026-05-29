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

        /* USER */

        userId:
          body.userId || "",

        /* COMMON */

        email:
          body.email || "",

        status:
          "new"

      });




    /* =====================================
       CREATE NOTIFICATION
    ===================================== */

    try {

      await Notification.create({

        /* REQUIRED USER ID */

        userId:
          body.userId || "",

        /* NOTIFICATION TYPE */

        type:
          "lead",

        /* TITLE */

        title:
          "New Property Inquiry",

        /* MESSAGE */

        message:
          `${body.name} submitted inquiry for ${body.propertyName}`,

        /* LEAD REFERENCE */

        referenceId:
          propertyInquiry._id,

        /* PROPERTY REFERENCE */

        propertyId:
          body.propertyId || "",

        /* PROPERTY TITLE */

        propertyTitle:
          body.propertyName || "",

        /* READ STATUS */

        isRead:
          false,

        /* CREATED */

        createdAt:
          new Date()

      });

    }

    catch(notificationError){

      console.log(

        "Notification Error:",

        notificationError

      );

    }




    /* SUCCESS RESPONSE */
    return NextResponse.json({

      success: true,

      data:
        propertyInquiry

    });

  }

  catch (error) {

    console.error(

      "LEAD API ERROR:",

      error

    );

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