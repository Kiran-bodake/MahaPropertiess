import { connectDB } from "@/lib/mongodb";

import Notification from "@/models/Notification";

// GET notifications
export async function GET() {
  try {
    await connectDB();

    const notifications = await Notification.find({
      isRead: false,
    })

      .sort({
        createdAt: -1,
      })

      .limit(20);

    return Response.json({
      success: true,

      notifications,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,

        notifications: [],
      },

      {
        status: 500,
      },
    );
  }
}

// Mark notification as read
export async function POST(req: Request) {
  try {
    await connectDB();

    const { referenceId } = await req.json();

    await Notification.updateMany(
      {
        referenceId,
      },

      {
        isRead: true,
      },
    );

    // IMPORTANT
    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

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
