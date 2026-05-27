import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

const LOCALITY_META: Record<
  string,
  {
    tp: string;
    img: string;
    hot?: boolean;
  }
> = {
  "Gangapur Road": {
    tp: "Premium Residential",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=75",
    hot: true,
  },

  Igatpuri: {
    tp: "Agriculture & Hills",
    img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=500&q=75",
    hot: true,
  },

  "Nashik Road": {
    tp: "Industrial Belt",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=75",
  },
};

export async function GET() {
  try {
    await connectDB();

    const properties = await Property.find({
      approvalStatus: "approved",
    }).lean();

    const grouped: Record<string, number> = {};

    properties.forEach((p: any) => {
      const locality = p.locality?.trim();

      if (!locality) return;

      grouped[locality] = (grouped[locality] || 0) + 1;
    });

    const localities = Object.entries(grouped).map(([name, count]) => ({
      n: name,

      slug: name.toLowerCase().replace(/\s+/g, "-"),

      c: `${count}+`,

      ...(LOCALITY_META[name] || {
        tp: "Prime Investment Zone",

        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=75",
      }),
    }));

    return NextResponse.json(localities);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch localities" },
      { status: 500 },
    );
  }
}
