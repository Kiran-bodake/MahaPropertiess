import Link from "next/link";
import Image from "next/image";
import { Navbar as MegaNavbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const res = await fetch("http://localhost:3000/api/properties", {
  cache: "no-store",
});

const properties = await res.json();

export default async function LocalityPage({ params }: Props) {
  const { slug } = await params;

  const localityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const filtered = properties.filter((p: any) => {
    const locality = (p.locality || p.location || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return locality.includes(slug.toLowerCase());
  });

  const currentProperty = filtered[0];

  const nearbyProperties = currentProperty
    ? properties
        .filter((p: any) => {
          return (
            p.city === currentProperty.city && p.slug !== currentProperty.slug
          );
        })
        .slice(0, 4)
    : [];

  return (
    <>
      <MegaNavbar />

      <main
        style={{
          background: "#f3f6fb",
          minHeight: "100vh",
          padding: "30px 0 60px",
        }}
      >
        <div
          style={{
            maxWidth: "1350px",
            margin: "auto",
            padding: "0 18px",
          }}
        >
          {/* BREADCRUMB */}
          <div
            style={{
              marginBottom: "18px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Home
            </Link>{" "}
            {" > "}
            <Link
              href="/localities"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Localities
            </Link>{" "}
            {" > "}
            <span
              style={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {localityName}
            </span>
          </div>

          {/* HERO */}
          <section className="hero">
            <div>
              <span className="heroBadge">Premium Nashik Locality</span>

              <h1>Properties in {localityName}</h1>

              <p>
                Explore verified NA plots, agriculture land, commercial spaces,
                industrial sheds and investment opportunities available in{" "}
                {localityName}, Nashik.
              </p>
            </div>
          </section>

          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <span className="topLabel">PROPERTY RESULTS</span>

              <h2>{filtered.length} Properties Available</h2>
            </div>

            <p>Verified listings updated daily</p>
          </div>

          {/* PROPERTY LIST */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {filtered.map((p: any) => (
              <Link
                key={p.id}
                href={`/properties/${p.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <article className="propertyCard">
                  {/* IMAGE */}
                  <div className="imageWrap">
                    <Image
                      fill
                      src={p.img}
                      alt={p.title}
                      style={{
                        objectFit: "cover",
                      }}
                    />

                    <div className="verified">VERIFIED</div>

                    {p.badge && <div className="badge">{p.badge}</div>}

                    <div className="photoCount">📸 3</div>

                    <button type="button" className="favBtn">
                      ♡
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="cardContent">
                    <div>
                      <div className="category">{p.category}</div>

                      <h3 className="title">{p.title}</h3>

                      <p className="location">📍 {p.locality}</p>

                      <div className="features">
                        <div className="feature">📐 {p.area}</div>

                        <div className="feature">👁 {p.views || 0} views</div>

                        {p.rera && <div className="rera">RERA Approved</div>}
                      </div>
                    </div>

                    <div className="footerRow">
                      <div>
                        <div className="price">{p.price}</div>

                        <span className="neg">Negotiable</span>
                      </div>

                      <div className="btns">
                        <button type="button" className="secondaryBtn">
                          Contact
                        </button>

                        <button type="button" className="primaryBtn">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* EMPTY */}
          {filtered.length === 0 && (
            <div className="empty">
              <div className="emptyIcon">🏚️</div>

              <h3>No properties found</h3>

              <p>No listings available for this locality.</p>
            </div>
          )}

          {/* Nearby Properties */}
          {nearbyProperties.length > 0 && (
            <section style={{ marginTop: "32px" }}>
              {/* Header */}
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
                  {/* Similar Properties */}
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Nearby Properties
                </h2>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "0.9rem",
                  }}
                >
                  Based on location:
                  <strong> {currentProperty.locality}</strong>
                </p>
              </div>

              {/* Grid */}
              <div className="relatedGrid">
                {nearbyProperties.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/properties/${p.slug}`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <article className="relatedCard">
                      {/* Image */}
                      <div className="relatedImageWrap">
                        <Image
                          src={p.img}
                          alt={p.title}
                          fill
                          className="relatedImage"
                        />

                        {/* Category Badge */}
                        <div className="relatedBadge">{p.category}</div>

                        {/* Zero Brokerage */}
                        <div className="relatedZero">Zero Brokerage</div>
                      </div>

                      {/* Content */}
                      <div className="relatedContent">
                        <h3>{p.title}</h3>

                        <p>📍 {p.locality}</p>

                        <div className="relatedBottom">
                          <span> {p.price}</span>

                          <button type="button">View Details →</button>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* STYLES */}
        {/* STYLES */}
        <style>{`
  .hero {
    background: linear-gradient(135deg, #052e16, #166534, #22c55e);
    border-radius: 24px;
    padding: 32px;
    color: white;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .heroBadge {
    display: inline-flex;
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 14px;
  }

  .hero h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    line-height: 1.1;
    color: white;
  }

  .hero p {
    margin-top: 14px;
    max-width: 720px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
  }

  .topbar {
    background: white;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    flex-wrap: wrap;
    gap: 10px;
  }

  .topLabel {
    color: #16a34a;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.6px;
  }

  .topbar h2 {
    margin: 6px 0 0;
    color: #111827;
  }

  .topbar p {
    color: #64748b;
    font-size: 14px;
  }

  .propertyCard {
    display: grid;
    grid-template-columns: 260px 1fr;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: 0.25s ease;
  }

  .propertyCard:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.08);
  }

  .imageWrap {
    position: relative;
    min-height: 220px;
  }

  .verified,
  .badge,
  .photoCount {
    position: absolute;
    z-index: 10;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 10px;
    color: white;
    font-weight: 700;
  }

  .verified {
    top: 12px;
    left: 12px;
    background: #16a34a;
  }

  .badge {
    bottom: 12px;
    left: 12px;
    background: black;
  }

  .photoCount {
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
  }

  .favBtn {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.95);
    cursor: pointer;
    font-size: 22px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .cardContent {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .category {
    display: inline-flex;
    width: fit-content;
    padding: 7px 12px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #166534;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .title {
    margin: 0;
    font-size: 1.45rem;
    font-weight: 800;
    color: #111827;
  }

  .location {
    margin-top: 8px;
    color: #64748b;
    font-size: 15px;
  }

  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .feature,
  .rera {
    padding: 9px 12px;
    border-radius: 12px;
    font-size: 12px;
  }

  .feature {
    background: #f1f5f9;
    color: #334155;
  }

  .rera {
    background: #fee2e2;
    color: #b91c1c;
    font-weight: 700;
  }

  .footerRow {
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    font-size: 2rem;
    font-weight: 900;
    color: #166534;
  }

  .neg {
    font-size: 13px;
    color: #64748b;
  }

  .btns {
    display: flex;
    gap: 10px;
  }

  .primaryBtn,
  .secondaryBtn {
    height: 44px;
    padding: 0 18px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .primaryBtn {
    border: none;
    background: #16a34a;
    color: white;
  }

  .secondaryBtn {
    border: 1px solid #d1d5db;
    background: white;
    color: #111827;
  }

  .empty {
    background: white;
    padding: 50px;
    border-radius: 22px;
    text-align: center;
    margin-top: 20px;
  }

  .emptyIcon {
    font-size: 46px;
  }

  .empty h3 {
    margin-top: 12px;
    color: #111827;
  }

  .empty p {
    color: #64748b;
  }

  /* RELATED PROPERTIES */

  .relatedGrid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(240px, 280px)
  );
  gap: 14px;
   justify-content: start;
}

  .relatedCard {
    background: white;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: 0.22s ease;
  }

  .relatedCard:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  .relatedImageWrap {
    position: relative;
    height: 165px;
  }

  .relatedImage {
    object-fit: cover;
  }

  .relatedBadge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #16a34a;
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
    text-transform: uppercase;
  }

  .relatedZero {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #dcfce7;
    color: #166534;
    font-size: 10px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
  }

  .relatedContent {
    padding: 14px;
  }

  .relatedContent h3 {
    margin: 0;
    font-size: 0.98rem;
    line-height: 1.35;
    font-weight: 800;
    color: #0f172a;
  }

  .relatedContent p {
    margin-top: 8px;
    color: #64748b;
    font-size: 0.86rem;
  }

  .relatedBottom {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .relatedBottom span {
    font-size: 1.15rem;
    font-weight: 900;
    color: #0f766e;
  }

  .relatedBottom button {
    height: 34px;
    padding: 0 13px;
    border: none;
    border-radius: 10px;
    background: #dcfce7;
    color: #16a34a;
    font-weight: 700;
    font-size: 0.82rem;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 24px;
    }

    .propertyCard {
      grid-template-columns: 1fr;
    }

    .footerRow {
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }

    .btns {
      width: 100%;
    }

    .primaryBtn,
    .secondaryBtn {
      width: 100%;
    }

    .topbar {
      flex-direction: column;
      align-items: flex-start;
    }

    .relatedBottom {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .relatedBottom button {
      width: 100%;
    }
  }
`}</style>
      </main>

      <Footer />
    </>
  );
}
