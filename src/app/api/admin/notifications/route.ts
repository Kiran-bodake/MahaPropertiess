import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

/* =========================================
   GET ALL NOTIFICATIONS (ADMIN)
   No userId required - shows all notifications
========================================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const isRead = searchParams.get("isRead");
    const priority = searchParams.get("priority");
    
    const skip = (page - 1) * limit;

    // Build query - NO userId filter (admin sees all)
    let query: any = {};
    if (type && type !== "all") query.type = type;
    if (isRead && isRead !== "all") query.isRead = isRead === "true";
    if (priority && priority !== "all") query.priority = priority;

    // Fetch notifications for admin (all users)
    const notifications = await Notification.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    
    // Get counts by type
    const leadCount = await Notification.countDocuments({ type: "lead" });
    const inquiryCount = await Notification.countDocuments({ type: "inquiry" });
    const callbackCount = await Notification.countDocuments({ type: "callback" });
    const systemCount = await Notification.countDocuments({ type: "system" });

    return NextResponse.json({
      success: true,
      notifications,
      stats: {
        total,
        unreadCount,
        leadCount,
        inquiryCount,
        callbackCount,
        systemCount,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATIONS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        notifications: [],
        message: "Failed to fetch notifications",
      },
      { status: 500 }
    );
  }
}

/* =========================================
   CREATE NOTIFICATION (ADMIN)
========================================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { type, title, message, priority, metadata, userId, userType } = body;

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required" },
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      userId: userId || null,
      userType: userType || "admin",
      type: type || "system",
      title,
      message,
      priority: priority || "medium",
      metadata: metadata || {},
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("[CREATE_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to create notification" },
      { status: 500 }
    );
  }
}

/* =========================================
   UPDATE NOTIFICATION (Mark as read/unread)
========================================= */
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { notificationId, isRead } = body;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: "Notification ID required" },
        { status: 400 }
      );
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: isRead,
        readAt: isRead ? new Date() : null,
      },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("[UPDATE_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notification" },
      { status: 500 }
    );
  }
}

/* =========================================
   DELETE NOTIFICATION
========================================= */
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: "Notification ID required" },
        { status: 400 }
      );
    }

    await Notification.findByIdAndDelete(notificationId);

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete notification" },
      { status: 500 }
    );
  }
}

/* =========================================
   MARK ALL AS READ (Admin)
========================================= */
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { markAllAsRead } = await req.json();

    if (markAllAsRead) {
      const result = await Notification.updateMany(
        { isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return NextResponse.json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
        modifiedCount: result.modifiedCount,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[MARK_ALL_READ_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Failed to mark all as read" },
      { status: 500 }
    );
  }
}