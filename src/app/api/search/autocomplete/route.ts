import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Property from "@/models/Property";

import PropertyLocation from "@/models/PropertyLocation";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const query =
      request.nextUrl.searchParams
        .get("q")

        ?.trim() || "";

    if (!query) {
      return NextResponse.json({
        success: true,

        suggestions: [],
      });
    }

    /* Search Property Titles + Category */
    const properties = await Property.find({
      $or: [
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },

        {
          category: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).limit(5);

    /* Search Locations */
    const locations = await PropertyLocation.find({
      $or: [
        {
          locality: {
            $regex: query,
            $options: "i",
          },
        },

        {
          city: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).limit(5);

    /* Merge results */
    const suggestions = [
      ...properties.map((p: any) => ({
        id: p._id,

        title: p.title,

        category: p.category,
      })),

      ...locations.map((l: any) => ({
        id: l._id,

        locality: l.locality,

        city: l.city,
      })),
    ];

    return NextResponse.json({
      success: true,

      query,

      suggestions,

      total: suggestions.length,
    });
  } catch (error) {
    console.error(
      "Autocomplete Error:",

      error,
    );

    return NextResponse.json(
      {
        success: false,

        suggestions: [],
      },

      {
        status: 500,
      },
    );
  }
}
