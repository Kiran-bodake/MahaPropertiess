import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function POST(req: Request) {
  try {
    await connectDB();

    const menus = await req.json();

    for (let i = 0; i < menus.length; i++) {
      await Menu.findByIdAndUpdate(menus[i]._id, {
        order: i + 1,
      });
    }

    return Response.json({
      success: true,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
