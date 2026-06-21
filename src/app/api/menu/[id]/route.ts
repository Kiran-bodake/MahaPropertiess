import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";

// GET SINGLE MENU
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const menu = await Menu.findById(id);

    if (!menu) {
      return Response.json(
        {
          message: "Menu not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(menu);
  } catch (error: any) {
    return Response.json(
      {
        message: "Error fetching menu",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

// UPDATE MENU
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const menu = await Menu.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!menu) {
      return Response.json(
        {
          message: "Menu not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(menu);
  } catch (error: any) {
    return Response.json(
      {
        message: "Error updating menu",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE MENU + ALL CHILDREN
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;
    console.log("DELETE ID =", id);

    async function deleteChildren(parentId: string) {
      const children = await Menu.find({
        parentId,
      });

      for (const child of children) {
        await deleteChildren(child._id.toString());

        await Menu.findByIdAndDelete(child._id);
      }
    }

    console.log("Deleting menu...");

    await deleteChildren(id);

    await Menu.findByIdAndDelete(id);

    return Response.json({
      message: "Menu deleted successfully",
    });
  } catch (error: any) {
    return Response.json(
      {
        message: "Delete failed",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
