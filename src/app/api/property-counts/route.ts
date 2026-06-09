import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/properties";

export async function GET() {
  const properties = await getAllProperties();

  const counts: Record<string, number> = {};

  properties.forEach((p: any) => {
    const rawCat = (p.category || p.cat || "").toLowerCase();

    let cat = "";

    switch (rawCat) {
      case "na-plot":
        cat = "NA Plot";
        break;

      case "collector-na":
        cat = "Collector NA";
        break;

      case "agriculture":
        cat = "Agriculture";
        break;

      case "commercial":
        cat = "Commercial";
        break;

      case "warehouse":
        cat = "Warehouse";
        break;

      case "investment":
      case "investment-plot":
        cat = "Investment";
        break;

      case "residential":
        cat = "Residential";
        break;

      default:
        cat = rawCat
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    if (!cat) return;

    counts[cat] = (counts[cat] || 0) + 1;
  });

  return NextResponse.json({
    total: properties.length,
    counts,
  });
}
