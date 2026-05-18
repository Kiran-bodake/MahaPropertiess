import { NextResponse } from "next/server";

import { connectDB }
  from "@/lib/mongodb";

import Lead
  from "@/models/Lead";

import Notification
  from "@/models/Notification";


export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const body =
      await req.json();

    console.log(
      "Backend body:",
      body
    );


    /* CREATE LEAD */
    const lead =
      await Lead.create({

        propertyId:
          body.propertyId ||
          "unknown-property-id",

        propertyName:
          body.propertyName ||
          "Unknown Property",

        name:
          body.name,

        mobileNumber:
          body.mobileNumber,

        email:
          body.email,

        interest:
          body.interest ||
          "Buy",

        whatsappConsent:
          body.whatsappConsent
          ?? true

      });


    /* CREATE NOTIFICATION */
    await Notification.create({

      type:
        "lead",

      title:
        "New Lead Received",

      message:
        `${body.name} submitted a lead for ${body.propertyName}`,

      referenceId:
        lead._id,

      isRead:
        false

    });


    return NextResponse.json({

      success: true,

      data:
        lead

    });

  }

  catch (error) {

    console.error(
      error
    );

    return NextResponse.json(

      {

        success: false,

        message:
          "Failed to save lead"

      },

      {

        status: 500

      }

    );

  }

}