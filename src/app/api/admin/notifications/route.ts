import { connectDB }
  from "@/lib/mongoose";

import Notification
  from "@/models/Notification";


export async function GET() {

  await connectDB();

  const notifications =
    await Notification.find()

      .sort({

        createdAt: -1

      })

      .limit(20);


  return Response.json({

    success: true,

    notifications

  });

}