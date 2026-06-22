import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Role from "@/models/Role";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { roleId, permissions } = body;

    // ✅ validation
    if (!roleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Role ID is required",
        },
        { status: 400 }
      );
    }

    // ✅ ensure permissions is always array
    const safePermissions = Array.isArray(permissions)
      ? permissions
      : [];

    // ✅ update role
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        $set: {
          permissions: safePermissions,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("permissions"); // optional but useful for UI

    if (!updatedRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Permissions updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    console.error("Update permissions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}