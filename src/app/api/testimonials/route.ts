import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectDB();

    const testimonials = await Testimonial.find({
      active: true,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json([], {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const testimonial = await Testimonial.create(body);

    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create testimonial",
      },
      {
        status: 500,
      },
    );
  }
}
