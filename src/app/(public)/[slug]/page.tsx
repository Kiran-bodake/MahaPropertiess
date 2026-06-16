import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/property-grid";
import { Footer } from "@/components/layout/footer";
import { parseSeoSlug } from "@/lib/seoPages";
import { getSeoProperties } from "@/lib/getSeoProperties";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const seo = parseSeoSlug(slug);

  if (!seo) {
    return {
      title: "Properties | MahaProperties",
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = parseSeoSlug(slug);

  if (!seo) {
    notFound();
  }

  const category = seo.categorySlug.replace(/-/g, " ");

  const properties = await getSeoProperties(seo.citySlug, category);

  if (!properties || properties.length === 0) {
    notFound();
  }

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
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
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            Why MahaProperties
          </h2>

          <p
            style={{
              color: "#475569",
              marginBottom: "12px",
            }}
          >
            MahaProperties offers verified listings, transparent pricing, and
            trusted local agents.
          </p>

          <ul
            style={{
              marginLeft: "18px",
              color: "#334155",
            }}
          >
            <li>Verified title and documents</li>
            <li>Best price comparison</li>
            <li>Buyback guarantee on select plots</li>
            <li>Dedicated property advisory support</li>
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
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            Location Advantage
          </h2>

          <ul
            style={{
              marginLeft: "18px",
              color: "#334155",
            }}
          >
            <li>Close to major transport hubs</li>
            <li>Developing residential areas</li>
            <li>Upcoming infrastructure projects</li>
            <li>Strong investment potential</li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
