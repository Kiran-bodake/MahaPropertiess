import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/property-grid";
import { Footer } from "@/components/layout/footer";
import { parseSeoSlug } from "@/lib/seoPages";
import { getSeoProperties } from "@/lib/getSeoProperties";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const seo = parseSeoSlug(params.slug);

  if (!seo) {
    return {
      title: "Page not found",
    };
  }

  const cityName = seo.citySlug
    .split("-")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");

  const categoryName = seo.categorySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${categoryName} in ${cityName} | MahaProperties`,
    description: `Browse verified ${categoryName.toLowerCase()} in ${cityName}.`,
    openGraph: {
      title: `${categoryName} in ${cityName}`,
      description: `Browse verified ${categoryName.toLowerCase()} in ${cityName}.`,
      siteName: "MahaProperties",
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const seo = parseSeoSlug(slug);

  if (!seo) {
    notFound();
  }

  const category = seo.categorySlug.replace(/-/g, " ");

  if (!category) {
    notFound();
  }

  const properties = await getSeoProperties(seo.citySlug, category);
  if (!properties || properties.length === 0) {
    notFound();
  }

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <section
        style={{ maxWidth: "1080px", margin: "0 auto", padding: "40px 20px" }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem,4vw,2.8rem)",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          {seo.categorySlug.replace(/-/g, " ")} in{" "}
          {seo.citySlug.replace(/-/g, " ")}
        </h1>
        <p
          style={{
            color: "#475569",
            fontSize: "1rem",
            marginBottom: "20px",
          }}
        >
          Browse verified {seo.categorySlug.replace(/-/g, " ")} properties in{" "}
          {seo.citySlug.replace(/-/g, " ")}.
        </p>

        <div
          style={{
            marginBottom: "32px",
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Why MahaProperties
          </h2>
          <p style={{ color: "#475569", marginBottom: "12px" }}>
            MahaProperties offers verified listings, transparent pricing, and
            trusted local agents in Nashik.
          </p>
          <ul style={{ marginLeft: "18px", color: "#334155" }}>
            <li>Verified title and documents</li>
            <li>Best price comparison with historical data</li>
            <li>Buyback guarantee on select plots</li>
            <li>Dedicated property advisory and financing support</li>
          </ul>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Featured Listings
          </h2>
          <PropertyGrid properties={properties as any} />
        </div>

        <div
          style={{
            marginBottom: "40px",
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Location Advantage
          </h2>
          <ul style={{ marginLeft: "18px", color: "#334155" }}>
            <li>Close to major transport hubs (highway & airport)</li>
            <li>Developing residential and commercial neighborhoods</li>
            <li>Upcoming infrastructure projects within 3-5 km radius</li>
            <li>Water and power connections ready for quick start</li>
          </ul>
        </div>

        <div
          style={{
            marginBottom: "40px",
            borderRadius: "12px",
            overflow: "hidden",
            height: "420px",
          }}
        >
          <iframe
            title="Property location map"
            width="100%"
            height="100%"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.850101893499!2d73.76337891503646!3d19.999397753144066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c0ce8f6f09f9%3A0x37e5a873c7d5a3cd!2sNashik%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </section>
      <Footer />
    </main>
  );
}
