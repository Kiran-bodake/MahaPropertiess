import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import ViewTracker from "@/components/property/ViewTracker";

import { StickyContactForm } from "@/components/shared/StickyContactForm";
import { PropertyLeadForm } from "@/components/shared/PropertyLeadForm";
import { PropertySectionTabs } from "@/components/property/PropertySectionTabs";
import { PropertyActions } from "@/components/property/PropertyActions";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import {
  ShieldCheck,
  FileCheck,
  Landmark,
  Building2,
  Trees,
  Waves,
  Mountain,
  Train,
  Warehouse,
  BadgeIndianRupee,
  MapPinned,
  Fence,
  ParkingCircle,
  Camera,
  Zap,
  Droplets,
  School,
  Hospital,
  Store,
  SquareDashedBottom,
  UserRound,
  BriefcaseBusiness,
  Shield,
} from "lucide-react";

type PropertyType = {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyId?: string;

  locality: string;
  city: string;
  state?: string;

  price: number;
  area: number;
  areaUnit: string;

  postedBy: string;
  agentName: string;
  agentPhone: string;

  images: string[];

  amenities?: string[];
  highlights?: string[];

  rera?: boolean;
  badge?: string;

  status?: string;
  constructionStatus?: string;
};

const highlightIcons: Record<string, React.ReactNode> = {
  "NA Converted": <FileCheck size={14} />,
  "Clear Title": <ShieldCheck size={14} />,
  "RERA Approved": <BadgeIndianRupee size={14} />,
  "Zero Brokerage": <BadgeIndianRupee size={14} />,
  "Ready Possession": <Building2 size={14} />,
  "Immediate Handover": <Building2 size={14} />,
  "Main Road Frontage": <MapPinned size={14} />,
  "Corner Plot": <Landmark size={14} />,
  "Gated Community": <Fence size={14} />,
  "Hill View": <Mountain size={14} />,
  "Lake View": <Waves size={14} />,
  "Garden Facing": <Trees size={14} />,
  "East Facing": <MapPinned size={14} />,
  "West Facing": <MapPinned size={14} />,
  "North Facing": <MapPinned size={14} />,
  "River Nearby": <Waves size={14} />,
  "High ROI": <BadgeIndianRupee size={14} />,
  "Upcoming Metro": <Train size={14} />,
  "Near IT Park": <Building2 size={14} />,
  "MIDC Approved Zone": <Warehouse size={14} />,
  "Collector Approved": <ShieldCheck size={14} />,
};

const amenityIcons: Record<string, React.ReactNode> = {
  "Road Access": <MapPinned size={14} />,
  "Water Connection": <Droplets size={14} />,
  Electricity: <Zap size={14} />,
  "24x7 Security": <Shield size={14} />,
  "CCTV Surveillance": <Camera size={14} />,
  "Parking Area": <ParkingCircle size={14} />,
  Borewell: <Droplets size={14} />,
  Fencing: <Fence size={14} />,
  "Power Backup": <Zap size={14} />,
  "Natural Water Source": <Droplets size={14} />,
  "Wide Road": <MapPinned size={14} />,
  "Near Highway": <MapPinned size={14} />,
  "Near Market": <Store size={14} />,
  "Near School": <School size={14} />,
  "Near Hospital": <Hospital size={14} />,
  "Street Lights": <Zap size={14} />,
  Drainage: <Droplets size={14} />,
  "Compound Wall": <Fence size={14} />,
  "Garden Area": <Trees size={14} />,
  "Warehouse Facility": <Warehouse size={14} />,
};

export const dynamicParams = true;

async function getProperty(slug: string): Promise<PropertyType | null> {
  const res = await fetch(`http://localhost:3000/api/properties/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

async function getRelatedProperties(city: string): Promise<PropertyType[]> {
  const res = await fetch(`http://localhost:3000/api/properties?city=${city}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    metadataBase: new URL("https://mahaproperties.in"),

    title: `${property.title} | MahaProperties`,

    description: property.description,

    openGraph: {
      title: `${property.title} | MahaProperties`,

      description: property.description,

      url: `https://mahaproperties.in/properties/${property.slug}`,

      siteName: "MahaProperties",

      images: [
        {
          url: property.images?.[0]?.startsWith("http")
            ? property.images[0]
            : `https://mahaproperties.in${property.images?.[0]}`,

          width: 1200,

          height: 630,

          alt: property.title,
        },
      ],

      locale: "en_IN",

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title: `${property.title} | MahaProperties`,

      description: property.description,

      images: [
        property.images?.[0]?.startsWith("http")
          ? property.images[0]
          : `https://mahaproperties.in${property.images?.[0]}`,
      ],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const property = await getProperty(slug);

  if (!property) notFound();

  const relatedProperties = await getRelatedProperties(property.city);
  const jsonLd = {
    "@context": "https://schema.org",

    "@type": "RealEstateListing",

    name: property.title,

    description: property.description,

    image: property.images,

    url: `https://mahaproperties.in/properties/${property.slug}`,

    datePosted: new Date().toISOString(),

    offers: {
      "@type": "Offer",

      price: property.price,

      priceCurrency: "INR",

      availability: "https://schema.org/InStock",
    },

    provider: {
      "@type": "RealEstateAgent",

      name: property.agentName,

      telephone: property.agentPhone,
    },

    mainEntity: {
      "@type": "SingleFamilyResidence",

      name: property.title,

      floorSize: {
        "@type": "QuantitativeValue",

        value: property.area,

        unitCode: property.areaUnit,
      },
      address: {
        "@type": "PostalAddress",

        addressLocality: property.locality,

        addressRegion: property.city,

        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <ViewTracker slug={property.slug} />
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main
        style={{
          background: "#f8fafc",
        }}
      >
        {/* CENTERED CONTAINER */}
        <section
          style={{
            width: "100%",

            maxWidth: 1380,

            margin: "0 auto",

            padding: "20px 16px 40px",
            overflow: "visible",
          }}
        >
          {/* MAIN GRID */}
          <div
            className="mainGrid"
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {/* LEFT */}
            <article
              style={{
                flex: 1,
                minWidth: 0,
                width: "100%",

                background: "#fff",

                borderRadius: 24,

                overflow: "visible",

                boxShadow: "0 8px 30px rgba(0,0,0,.05)",
              }}
            >
              <PropertySectionTabs />
              {/* HERO */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "24px 24px 0 0",
                  minHeight: 520,
                }}
              >
                <PropertyGallery
                  images={property.images}
                  title={property.title}
                  price={property.price}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 82,
                    height: 90,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,.38), transparent)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
              </div>
              {/* BODY */}
              <div
                className="propertyBody"
                style={{
                  padding: 36,
                }}
              >
                <div
                  className="titleRow"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    marginBottom: 24,
                    flexWrap: "wrap",
                  }}
                >
                  {/* LEFT */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "clamp(1.6rem,4vw,2.5rem)",
                        fontWeight: 900,
                        lineHeight: 1.15,
                        color: "#0f172a",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {property.title}
                    </h1>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#64748b",
                        fontSize: ".96rem",
                        fontWeight: 500,
                      }}
                    >
                      <span>📍</span>

                      <span>
                        {property.locality}, {property.city}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    style={{
                      flexShrink: 0,
                    }}
                  >
                    <PropertyActions
                      propertyMongoId={property.id || ""}
                      propertyId={property.propertyId || ""}
                      propertyTitle={property.title || ""}
                    />
                  </div>
                </div>

                {/* BADGES */}
                <div
                  style={{
                    display: "flex",

                    flexWrap: "wrap",

                    gap: 10,

                    marginTop: 18,
                  }}
                >
                  {property.rera && <Badge label="RERA" />}

                  {property.badge && <Badge label={property.badge} />}

                  {property.status && <Badge label={property.status} />}
                </div>

                {/* OVERVIEW */}
                <div id="overview">
                  <SectionTitle title="Property Overview" />
                </div>

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",

                    gap: 12,
                  }}
                >
                  <InfoCard
                    icon={<SquareDashedBottom size={18} strokeWidth={2.2} />}
                    label="Area"
                    value={`${property.area} ${property.areaUnit}`}
                  />
                  <InfoCard
                    icon={<BriefcaseBusiness size={18} strokeWidth={2.2} />}
                    label="Listed By"
                    value={property.postedBy}
                  />

                  <InfoCard
                    icon={<UserRound size={18} strokeWidth={2.2} />}
                    label="Agent"
                    value={property.agentName}
                  />
                </div>

                {/* DESCRIPTION */}
                <div id="description">
                  <SectionTitle title="Description" />
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: 24,
                    borderRadius: 20,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      lineHeight: 1.9,
                      fontSize: ".98rem",
                    }}
                  >
                    {property.description}
                  </p>
                </div>

                {/* AMENITIES */}
                {property.amenities?.length ? (
                  <>
                    <div id="amenities">
                      <SectionTitle title="Amenities" />
                    </div>

                    <ChipList items={property.amenities} type="amenities" />
                  </>
                ) : null}

                {/* HIGHLIGHTS */}
                {property.highlights?.length ? (
                  <>
                    <div id="highlights">
                      <SectionTitle title="Highlights" />
                    </div>

                    <ChipList items={property.highlights} type="highlights" />
                  </>
                ) : null}

                {/* MAP */}
                <div id="location">
                  <SectionTitle title="Location" />
                </div>

                <div
                  style={{
                    borderRadius: 18,

                    overflow: "hidden",
                  }}
                >
                  <iframe
                    title="Location"
                    width="100%"
                    height="320"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${property.locality}, ${property.city}`,
                    )}&output=embed`}
                    style={{
                      border: 0,
                    }}
                  />
                </div>

                {/* LEAD */}
                <div
                  style={{
                    marginTop: 30,
                  }}
                >
                  <PropertyLeadForm propertyTitle={property.title} />
                </div>
              </div>
            </article>

            {/* RIGHT */}
            <aside
              className="sidebar"
              style={{
                width: 340,
                flexShrink: 0,
                position: "sticky",
                top: 90,
                alignSelf: "flex-start",
              }}
            >
              <div
                className="stickyFormWrapper"
                style={{
                  alignSelf: "start",
                  zIndex: 30,
                  willChange: "transform",
                  border: "2px solid rgba(96, 165, 250, 0.28)",
                  background: "rgba(239, 246, 255, 0.72)",

                  backdropFilter: "blur(16px)",

                  boxShadow: ` 0 12px 34px rgba(37, 99, 235, 0.08), inset 0 1px 0 rgba(255,255,255,.7)`,

                  borderRadius: 28,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 24,
                    padding: 24,
                    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
                  }}
                >
                  {/* content */}
                  <div
                    style={{
                      paddingBottom: 18,
                      borderBottom: "1px solid #e2e8f0",
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "#0f172a",
                      }}
                    >
                      Interested in this property?
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        color: "#64748b",
                        fontSize: ".92rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Get complete details, site visit assistance and best
                      price.
                    </div>
                  </div>

                  {/* TRUST */}
                  <div
                    style={{
                      marginTop: 20,
                      display: "grid",
                      gap: 8,
                      color: "#475569",
                      fontSize: ".92rem",
                    }}
                  >
                    <div>✓ Verified Agent</div>
                    <div>⚡ Fast Response</div>
                    {/* <div>👁 High Buyer Interest</div> */}
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <StickyContactForm
                      propertyTitle={property.title}
                      title="Request Callback"
                      description="Talk with owner today"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* RELATED */}
          {relatedProperties?.length > 0 && (
            <div
              style={{
                marginTop: 32,
              }}
            >
              <SectionTitle title="Similar Properties" />

              <div
                className="relatedGrid"
                style={{
                  display: "grid",

                  gridTemplateColumns: "repeat(auto-fit,minmax(240px,280px))",

                  justifyContent: "start",

                  gap: 16,
                }}
              >
                {relatedProperties
                  .filter((item) => item.slug !== property.slug)
                  .slice(0, 4)
                  .map((item) => (
                    <RelatedCard key={`${item.slug}-${item.id}`} item={item} />
                  ))}
              </div>
            </div>
          )}
        </section>

        <style>{`

        html {
  scroll-behavior: smooth;
}

.sidebar {
  position: relative;
  align-self: start;
}

.stickyFormWrapper {
  position: sticky;
  top: 90px;
  height: fit-content;
  z-index: 30;
  will-change: transform;
}

        .stickyFormWrapper::-webkit-scrollbar {
  display: none;
}

  @media (max-width: 1024px) {

  .mainGrid {
  flex-direction: column !important;
}

  .sidebar {
  width: 100% !important;
  max-width: 100% !important;

  position: static !important;
  top: unset !important;
}

.stickyFormWrapper {
  position: static !important;
  width: 100% !important;
  max-height: unset !important;
  overflow: visible !important;
}
}

  @media (max-width: 768px) {

    .propertyBody {
      padding: 18px !important;
    }

    .priceOverlay {
      left: 14px !important;
      bottom: 80px !important;
      font-size: 1.25rem !important;
      padding: 6px 12px !important;
    }

    .relatedGrid {
      grid-template-columns:
        repeat(auto-fit,minmax(220px,1fr)) !important;
    }

    .titleRow{
  flex-direction: column !important;
}

.titleRow > div:last-child{
  width: 100%;
}

.titleRow button{
  flex: 1;
}
  }

  @media (max-width: 540px) {

    .relatedGrid {
      grid-template-columns: 1fr !important;
    }

  }

`}</style>
      </main>

      <Footer />
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3
      style={{
        marginTop: 30,
        marginBottom: 14,
        fontWeight: 700,
        fontSize: "1.1rem",
      }}
    >
      {title}
    </h3>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "#eff6ff",
        color: "#2563eb",
        padding: "8px 14px",
        borderRadius: 999,
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );
}

function InfoCard({ label, value, icon }: any) {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom,#fff,#f8fafc)",

        border: "1px solid #e2e8f0",

        borderRadius: 20,

        padding: 18,

        boxShadow: "0 4px 20px rgba(15,23,42,.04)",

        transition: ".2s ease",
      }}
    >
      <div
        style={{
          fontWeight: 700,
        }}
      >
        {icon}
        {value}
      </div>

      <div
        style={{
          marginTop: 4,
          color: "#64748b",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ChipList({
  items,
  type,
}: {
  items: string[];
  type: "amenities" | "highlights";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      {items.map((item, i) => {
        const icon =
          type === "amenities" ? amenityIcons[item] : highlightIcons[item];

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,

              padding: "10px 16px",

              borderRadius: 999,

              background: "#ffffff",

              border: "1px solid #dbeafe",

              color: "#334155",

              fontWeight: 600,

              fontSize: ".86rem",

              boxShadow: "0 2px 10px rgba(0,0,0,.04)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                color: "#16a34a",
              }}
            >
              {icon}
            </span>

            {item}
          </div>
        );
      })}
    </div>
  );
}

function RelatedCard({ item }: any) {
  const image = item.images?.[0] || item.img || "/maha.png";

  return (
    <Link
      href={`/property/${item.propertyId || item.id || item._id}/${item.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <article
        style={{
          background: "#fff",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          transition: "0.22s ease",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            position: "relative",
            height: 150,
          }}
        >
          <Image
            src={image}
            alt={item.title}
            fill
            style={{
              objectFit: "cover",
            }}
          />

          {/* CATEGORY */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "#16a34a",
              color: "white",
              fontSize: 10,
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 999,
              textTransform: "uppercase",
            }}
          >
            {item.category || "Property"}
          </div>

          {/* BADGE */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#dcfce7",
              color: "#166534",
              fontSize: 10,
              fontWeight: 700,
              padding: "6px 10px",
              borderRadius: 999,
            }}
          >
            Verified
          </div>
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "0.95rem",
              lineHeight: 1.4,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              marginTop: 8,
              color: "#64748b",
              fontSize: "0.86rem",
            }}
          >
            📍 {item.locality}
          </p>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 900,
                color: "#0f766e",
              }}
            >
              {item.price}
            </span>

            <button
              type="button"
              style={{
                height: 32,
                padding: "0 12px",
                border: "none",
                borderRadius: 10,
                background: "#dcfce7",
                color: "#16a34a",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              View →
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
