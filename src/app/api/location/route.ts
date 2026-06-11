import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headersList = await headers();

    const cookieStore = await cookies();

    // Existing cookies
    const savedCity = cookieStore.get("city");

    const savedLat = cookieStore.get("lat");

    const savedLng = cookieStore.get("lng");

    // Use cached location
    if (savedCity && savedLat && savedLng) {
      return NextResponse.json({
        success: true,

        location: {
          city: savedCity.value,

          lat: Number(savedLat.value),

          lng: Number(savedLng.value),
        },
      });
    }

    const forwardedFor = headersList.get("x-forwarded-for");

    let ip = forwardedFor?.split(",")[0]?.trim() || "";

    // =========================
    // LOCALHOST FALLBACK
    // =========================

    if (
      process.env.NODE_ENV === "development" &&
      (ip === "::1" || ip === "127.0.0.1" || !ip)
    ) {
      const response = NextResponse.json({
        success: true,

        location: {
          city: "Nashik",

          lat: 19.9975,

          lng: 73.7898,
        },
      });

      // Save Nashik cookies
      response.cookies.set("city", "Nashik", {
        maxAge: 60 * 60 * 24 * 7,

        path: "/",
      });

      response.cookies.set("lat", "19.9975", {
        maxAge: 60 * 60 * 24 * 7,

        path: "/",
      });

      response.cookies.set("lng", "73.7898", {
        maxAge: 60 * 60 * 24 * 7,

        path: "/",
      });

      return response;
    }

    // =========================
    // REAL IP LOOKUP
    // =========================

    const res = await fetch(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`,

      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("IPInfo lookup failed");
    }

    const data = await res.json();

    const lat = data.loc ? Number(data.loc.split(",")[0]) : 19.9975;

    const lng = data.loc ? Number(data.loc.split(",")[1]) : 73.7898;

    const response = NextResponse.json({
      success: true,

      location: {
        city: data.city || "Nashik",

        lat,

        lng,
      },
    });

    // Save cookies
    response.cookies.set("city", data.city || "Nashik", {
      maxAge: 60 * 60 * 24 * 30,

      path: "/",
    });

    response.cookies.set("lat", String(lat), {
      maxAge: 60 * 60 * 24 * 30,

      path: "/",
    });

    response.cookies.set("lng", String(lng), {
      maxAge: 60 * 60 * 24 * 30,

      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({
      success: true,

      location: {
        city: "Nashik",

        lat: 19.9975,

        lng: 73.7898,
      },
    });
  }
}
