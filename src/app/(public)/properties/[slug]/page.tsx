import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StickyContactForm } from "@/components/shared/StickyContactForm";
import { PropertyLeadForm } from "@/components/shared/PropertyLeadForm";
import { RelatedPropertyCard } from "@/components/shared/RelatedPropertyCard";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { getPropertyBySlug } from "@/lib/properties";
import { getNearbyProperties } from "@/utils/property/getNearbyProperties";
import properties from "@/moc-data/properties.json";

function formatProperty(property: any) {
  const parts = property.loc?.split(",") || [];

  return {
    _id: String(property.id),

    id: property.id,
    slug: property.slug,

    title: property.t,

    locality: parts[0]?.trim() || "",

    city: parts[1]?.trim() || "Nashik",

    state: "Maharashtra",

    localitySlug: property.localitySlug,

    pincode: property.pincode,

    price: property.pr,

    category: property.cat,

    area: property.area,

    views: property.views,

    badge: property.badge,

    image: property.img,

    images: [
      {
        url: property.img,
      },
    ],

    isRERA: property.rera,

    status: "available",

    constructionStatus: "ready",

    description: `${property.t} located in ${property.loc}. Excellent investment opportunity in prime location.`,

    highlights: ["Prime Location", "Clear Title", "Investment Opportunity"],

    amenities: ["Road Access", "Water Connection", "Electricity"],

    agentName: "MahaProperties",

    isZeroBrokerage: true,

    createdAt: new Date().toISOString(),
  };
}

// const PROPERTY_DATA: Record<string, Property> = {
//   "awfis-baner-2": {
//     _id: "p-awfis-ban2",
//     title: "Mahaproperties Office Plot near Nashik Road - Prime Business Hub",
//     slug: "awfis-baner-2",
//     category: "commercial",
//     status: "available",
//     constructionStatus: "ready",
//     price: 18500000,
//     area: 2800,
//     areaUnit: "sqft",
//     locality: "Nashik Road",
//     city: "Nashik",
//     state: "Maharashtra",
//     description: "Premium commercial plot with ready infrastructure, ideal for office and retail space in the Nashik growth corridor.",
//     images: [
//       { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80" },
//       { url: "https://images.unsplash.com/photo-1483389127114-cb1a8f70a4e2?w=1200&q=80" },
//       { url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80" },
//     ],
//     highlights: ["Main road frontage", "Licensed 2486 sq.ft plan", "Immediate handover"],
//     amenities: ["24x7 CCTV", "Power backup", "Ample parking", "Lift facility"],
//     isRERA: true,
//     isFeatured: false,
//     isZeroBrokerage: true,
//     postedBy: "builder",
//     agentName: "Rakesh Nanda",
//     views: 1130,
//     savedCount: 315,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   "na-plot-gangapur-road": {
//     _id: "p-na-plot-gangapur",
//     title: "Prime NA Plot - Gangapur Road",
//     slug: "na-plot-gangapur-road",
//     category: "na-plot",
//     status: "available",
//     constructionStatus: "ready",
//     price: 4200000,
//     area: 2000,
//     areaUnit: "sqft",
//     locality: "Gangapur Road",
//     city: "Nashik",
//     state: "Maharashtra",
//     description: "Prime NA plot on Gangapur Road with quick approval, ideal for residential development and investment.",
//     images: [
//       { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80" },
//       { url: "https://images.unsplash.com/photo-1462858555511-64f2af96f9b0?w=1200&q=80" },
//     ],
//     highlights: ["Gangapur Road connectivity", "NA converted land", "Gated layout potential"],
//     amenities: ["24x7 security", "Main road access", "Electricity & water connection"],
//     isRERA: true,
//     isFeatured: true,
//     isZeroBrokerage: true,
//     postedBy: "dealer",
//     agentName: "Anjali Deshmukh",
//     views: 540,
//     savedCount: 128,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// };

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const rawProperty = await getPropertyBySlug(slug);

  if (!rawProperty) {
    return {
      title: "Property Not Found",
    };
  }

  const property = formatProperty(rawProperty);
  return {
    title: `${property.title} | MahaProperties`,
    description: `${property.title} in ${property.locality}`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const rawProperty = await getPropertyBySlug(slug);

  if (!rawProperty) {
    notFound();
  }

  const property = formatProperty(rawProperty);

  const nearbyProperties = rawProperty?.pincode
    ? getNearbyProperties(rawProperty.pincode, properties, rawProperty.id)
    : [];

  const formattedNearbyProperties = nearbyProperties.map(formatProperty);

  return (
    <>
      <Navbar />
      <main style={{ background: "#f4f7fb" }}>
        <section
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "24px 16px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Home / investment options / {property.locality}
            </div>
            <div
              style={{ color: "#475569", fontSize: "0.9rem", fontWeight: 500 }}
            >
              Listed on:{" "}
              {new Date(property.createdAt).toLocaleDateString("en-IN")}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: "16px",
            }}
          >
            <article
              style={{
                background: "white",
                borderRadius: "14px",
                border: "1px solid #d7dde3",
                padding: "20px",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {property.title}
              </h1>
              <div
                style={{
                  marginTop: "8px",
                  color: "#667085",
                  fontSize: "0.95rem",
                }}
              >
                {property.locality}, {property.city}, {property.state}
              </div>

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "#d1fae5",
                    color: "#065f46",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {property.status.toUpperCase()}
                </span>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {property.constructionStatus.toUpperCase()}
                </span>
                {property.isRERA && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#fee2e2",
                      color: "#991b1b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    RERA Approved
                  </span>
                )}
                {property.isZeroBrokerage && (
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#f0fdf4",
                      color: "#166534",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    Zero Brokerage
                  </span>
                )}
              </div>

              <div
                style={{
                  marginTop: "18px",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #dbeafe",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <div style={{ color: "#0f766e", fontWeight: 700 }}>
                    {property.price}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                    Price
                  </div>
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #dbeafe",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <div style={{ color: "#0f766e", fontWeight: 700 }}>
                    {property.area}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                    Carpet
                  </div>
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #dbeafe",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <div style={{ color: "#0f766e", fontWeight: 700 }}>
                    {property.agentName}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                    Agent
                  </div>
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #dbeafe",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <div style={{ color: "#0f766e", fontWeight: 700 }}>
                    {property.views}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                    Views
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #dbeafe",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "2px",
                  }}
                >
                  {property.images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{ minHeight: "124px", position: "relative" }}
                    >
                      <Image
                        src={img.url}
                        alt={`${property.title} image ${idx + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: "22px",
                  color: "#334155",
                  fontSize: "0.98rem",
                  lineHeight: 1.6,
                }}
              >
                {property.description}
              </div>

              <div
                style={{
                  marginTop: "22px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "14px",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                  Key highlights
                </div>
                <ul
                  style={{ paddingLeft: "18px", margin: 0, color: "#334155" }}
                >
                  {property.highlights.map((item) => (
                    <li key={item} style={{ marginBottom: "5px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                  Prime amenities
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                    gap: "8px",
                  }}
                >
                  {property.amenities.map((item) => (
                    <span
                      key={item}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #dbeafe",
                        padding: "6px 8px",
                        fontSize: "0.84rem",
                        color: "#334155",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: "22px",
                  minHeight: "220px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.locality + ", " + property.city + ", " + property.state)}&output=embed`}
                  style={{ width: "100%", height: "220px", border: 0 }}
                  loading="lazy"
                  title="Property Location"
                />
              </div>

              <PropertyLeadForm propertyTitle={property.title} />
            </article>

            <aside
              style={{ position: "sticky", top: "88px", alignSelf: "start" }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #dbeafe",
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                  overflow: "hidden",
                }}
              >
                <div style={{ background: "#ecfdf5", padding: "16px" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#047857",
                      fontSize: "0.88rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Need help?
                  </div>
                  <h3
                    style={{
                      margin: "8px 0 0",
                      fontSize: "1.25rem",
                      color: "#064e3b",
                    }}
                  >
                    Book a site visit
                  </h3>
                  <p
                    style={{
                      marginTop: "6px",
                      color: "#0f766e",
                      fontSize: "0.9rem",
                    }}
                  >
                    Get a call within 30 mins & a free property tour.
                  </p>
                </div>
                <div style={{ padding: "14px" }}>
                  <StickyContactForm
                    title="Contact Us"
                    description="Get in touch to book viewing, pricing info or site support."
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* You might be interested in */}
          <div style={{ marginTop: "32px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#16a34a",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}
              >
                Similar Properties
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                You might be interested in
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                Based on location:{" "}
                <strong>
                  {property.locality}, {property.city}
                </strong>
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {formattedNearbyProperties.map((rel) => (
                <RelatedPropertyCard key={rel._id} rel={rel} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
