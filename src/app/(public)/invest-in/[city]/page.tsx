import type { Metadata } from "next";
import FeaturedPropertiesSlider from "@/components/invest/FeaturedPropertiesSlider";
import { getFeaturedProperties } from "@/lib/getFeaturedProperties";
import { Navbar as MegaNavbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import FloatingWhatsapp from "@/components/shared/FloatingWhatsapp";
import StickySupport from "@/components/shared/StickySupport";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

function formatCity(city: string) {
  return city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;

  const cityName = formatCity(city);

  return {
    title: `Invest In ${cityName} | MahaProperties`,

    description: `Explore investment opportunities, growth corridors, NA plots, residential and commercial properties in ${cityName}.`,

    alternates: {
      canonical: `https://mahaproperties.in/invest-in/${city}`,
    },
  };
}

export default async function InvestInCityPage({ params }: Props) {
  const { city } = await params;

  const cityName = formatCity(city);

  console.log("URL City:", city);
  console.log("Formatted City:", cityName);

  const properties = await getFeaturedProperties(cityName, 12);
  return (
    <>
      <MegaNavbar />
      <main
        style={{
          background: "#f5f7fb",
          minHeight: "100vh",
          paddingBottom: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 18px",
          }}
        >
          <section
            style={{
              marginTop: "24px",
              marginBottom: "40px",
              borderRadius: "32px",
              overflow: "hidden",
              padding: "90px 60px",
              background: "linear-gradient(135deg,#0f172a 0%,#111827 100%)",
              color: "#fff",
              boxShadow: "0 30px 80px rgba(15,23,42,.18)",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(42px,5vw,72px)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                margin: 0,
                color: "#ffffff",
              }}
            >
              Invest In {cityName}
            </h1>
            <p
              style={{
                maxWidth: "720px",
                marginTop: "24px",
                fontSize: "18px",
                lineHeight: 1.9,
                color: "#cbd5e1",
              }}
            >
              Explore premium residential, commercial, NA plots and agricultural
              investment opportunities in {cityName}.
            </p>
          </section>

          <section
            style={{
              marginBottom: "40px",
              background: "#fff",
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              padding: "40px",
              boxShadow: "0 15px 45px rgba(15,23,42,.06)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(34px,3vw,56px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#111827",
                marginBottom: "40px",
              }}
            >
              Featured Properties
            </h2>

            <FeaturedPropertiesSlider properties={properties} />
          </section>

          <section
            style={{
              marginBottom: "40px",
              background: "#fff",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 15px 45px rgba(15,23,42,.06)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(32px,3vw,48px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "20px",
                color: "#111827",
              }}
            >
              About {cityName}
            </h2>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.9,
                color: "#475569",
                maxWidth: "900px",
              }}
            >
              {cityName} is one of the fastest-growing real estate destinations
              in Maharashtra. It offers strong appreciation potential,
              infrastructure growth, industrial development and residential
              demand.
            </p>

            <a
              href={`/${city}`}
              style={{
                display: "inline-block",
                marginTop: "20px",
                color: "#16a34a",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Read More →
            </a>
          </section>

          <section
            style={{
              marginBottom: "40px",
              background: "#fff",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 15px 45px rgba(15,23,42,.06)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(32px,3vw,48px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "20px",
                color: "#111827",
              }}
            >
              About MahaProperties
            </h2>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.9,
                color: "#475569",
                maxWidth: "900px",
              }}
            >
              MahaProperties helps buyers discover verified residential,
              commercial, agricultural and NA plot opportunities across
              Maharashtra.
            </p>

            <a
              href="/about-us"
              style={{
                display: "inline-block",
                marginTop: "20px",
                color: "#16a34a",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Read More →
            </a>
          </section>

          <section
            style={{
              marginBottom: "40px",
              background: "#fff",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 15px 45px rgba(15,23,42,.06)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(32px,3vw,48px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "30px",
                color: "#111827",
              }}
            >
              Property Categories
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: "20px",
              }}
            >
              <a
                href={`/properties/city/${city}/residential`}
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  textDecoration: "none",
                  color: "#111827",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(15,23,42,.04)",
                }}
              >
                Residential →
              </a>

              <a
                href={`/properties/city/${city}/commercial`}
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  textDecoration: "none",
                  color: "#111827",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(15,23,42,.04)",
                }}
              >
                Commercial →
              </a>

              <a
                href={`/properties/city/${city}/agriculture`}
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  textDecoration: "none",
                  color: "#111827",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(15,23,42,.04)",
                }}
              >
                Agriculture →
              </a>

              <a
                href={`/properties/city/${city}/na-plot`}
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  textDecoration: "none",
                  color: "#111827",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(15,23,42,.04)",
                }}
              >
                NA Plot →
              </a>
            </div>
          </section>

          <section
            style={{
              marginBottom: "40px",
              background: "#fff",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 15px 45px rgba(15,23,42,.06)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(32px,3vw,48px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "30px",
                color: "#111827",
              }}
            >
              Recent Listings
            </h2>

            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {properties.map((property: any) => (
                <a
                  key={property._id}
                  href={`/properties/${property.slug}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 24px",
                      borderRadius: "18px",
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      transition: "all .3s ease",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {property.title}
                      </h3>

                      <p
                        style={{
                          marginTop: "8px",
                          marginBottom: 0,
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        {property.categoryLabel}
                      </p>
                    </div>

                    <span
                      style={{
                        color: "#16a34a",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      View →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <StickySupport />
      <FloatingWhatsapp />
    </>
  );
}
