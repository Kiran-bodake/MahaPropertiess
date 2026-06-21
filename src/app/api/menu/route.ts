import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function GET() {
  try {
    await connectDB();

    const menus = await Menu.find({
      active: true,
    }).sort({
      order: 1,
    });

    return Response.json(menus);
  } catch (error: any) {
    return Response.json(
      {
        message: "Error fetching menus",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Find highest order
    const lastMenu = await Menu.findOne().sort({ order: -1 });

    const menu = await Menu.create({
      ...body,
      order: (lastMenu?.order || 0) + 1,
    });

    return Response.json(menu);
  } catch (error: any) {
    return Response.json(
      {
        message: "Error creating menu",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
