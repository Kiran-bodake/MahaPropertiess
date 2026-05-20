import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar as MegaNavbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();

  const blog = await Blog.findOne({
    s: slug,
    active: true,
  }).lean();

  const related = await Blog.find({
    cat: blog.cat,

    s: {
      $ne: blog.s,
    },

    active: true,
  })
    .limit(3)
    .lean();

  return (
    <>
      <MegaNavbar />

      <main>
        <div style={{ background: "#f9fafb", padding: "30px 0" }}>
          {/* 🔥 BREADCRUMB (FULL WIDTH TOP) */}
          <div
            style={{
              maxWidth: "1100px",
              margin: "auto",
              padding: "0 20px 10px",
            }}
          >
            <div style={{ fontSize: "15px", color: "#6b7280" }}>
              <Link href="/">Home</Link> {" > "}
              <Link href="/blogs">Blogs</Link> {" > "}
              <span style={{ fontWeight: 600 }}>{blog.t}</span>
            </div>
          </div>

          {/* 🔥 HERO (IMAGE LEFT - TEXT RIGHT) */}
          <div
            style={{
              maxWidth: "1100px",
              margin: "auto",
              padding: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
              gap: "30px",
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                height: "380px",
              }}
            >
              <Image
                fill
                src={blog.img}
                alt={blog.t}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* TEXT */}
            <div>
              {/* CATEGORY */}
              <span
                style={{
                  background: "#fef3c7",
                  color: "#b45309",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {blog.cat}
              </span>

              {/* TITLE */}
              <h1
                style={{
                  fontFamily: "var(--font-syne,Syne,serif)",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 900,
                  margin: "12px 0",
                  lineHeight: 1.3,
                  color: "#111827",
                }}
              >
                {blog.t}
              </h1>

              {/* META */}
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "13px",
                  marginBottom: "15px",
                }}
              >
                {blog.d} • {blog.r}
              </p>

              {/* EXCERPT */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  lineHeight: 1.7,
                }}
              >
                {blog.excerpt}
              </p>
            </div>
          </div>

          {/* 🔥 RELATED BLOGS */}
          {related.length > 0 && (
            <div
              style={{
                maxWidth: "1100px",
                margin: "auto",
                padding: "0 20px 60px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-syne,Syne,serif)",
                  fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
                  fontWeight: 800,
                  marginBottom: "20px",
                  color: "#111827",
                }}
              >
                Related Articles
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
                  gap: "16px",
                }}
              >
                {related.map((b) => (
                  <Link
                    key={b.s}
                    href={`/blogs/${b.s}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "14px",
                        overflow: "hidden",
                        border: "1px solid #eee",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ position: "relative", height: "160px" }}>
                        <Image
                          fill
                          src={b.img}
                          alt={b.t}
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      <div style={{ padding: "12px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: 700 }}>
                          {b.t}
                        </h3>
                        <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                          {b.d} • {b.r}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
