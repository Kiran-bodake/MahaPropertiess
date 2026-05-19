import { connectDB } from "@/lib/mongodb";

import { createProperty } from "@/services/property.service";

import Notification from "@/models/Notification";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  console.log("Backend body:", body);

  console.log("API Received:", body);

  try {
    const property = await createProperty(body);

    /* CREATE NOTIFICATION */
    await Notification.create({
      type: "property",

      title: "New Property Submitted",

      message: `${body.title} submitted for approval`,

      referenceId: property._id,

      isRead: false,
    });

    return Response.json({
      success: true,

      property,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
      },

      {
        status: 500,
      },
    );
  }
}
