import Link from "next/link";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

const tools = [
  {
    title: "EMI Calculator",
    desc: "Calculate monthly home loan EMI instantly.",
    href: "/tools/emi-calculator",
    icon: "🧮",
  },
  {
    title: "Area Converter",
    desc: "Convert Sq Ft, Guntha, Acre & Sq Meter.",
    href: "/tools/area-converter",
    icon: "📐",
  },
  {
    title: "Stamp Duty Calculator",
    desc: "Estimate Maharashtra registration charges.",
    href: "/tools/stamp-duty-calculator",
    icon: "📑",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 16px",
        }}
      >
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 900,
            marginBottom: 12,
          }}
        >
          Property Tools
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: 32,
          }}
        >
          Useful calculators for property buyers and investors.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 36 }}>{tool.icon}</div>

                <h2>{tool.title}</h2>

                <p>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
