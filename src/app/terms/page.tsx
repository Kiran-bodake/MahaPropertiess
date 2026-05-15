import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "40px 16px 80px",
        }}
      >
        <div className="termsBox">
          <div className="tag">MahaProperties Legal</div>

          <h1 className="title">Terms of Use</h1>

          <Section
            title="Acceptance Of Terms"
            text="By accessing MahaProperties website, users agree to comply with all terms and conditions."
          />

          <Section
            title="Property Information"
            text="Property listings are provided for informational purposes only."
          />

          <Section
            title="User Responsibilities"
            text="Users must provide accurate information while using the platform."
          />

          <Section
            title="Limitation Of Liability"
            text="MahaProperties shall not be held responsible for indirect losses."
          />
        </div>

        <style>{`
          .termsBox{
            max-width:980px;
            margin:0 auto;
            background:white;
            border-radius:24px;
            padding:32px 28px;
            border:1px solid #e2e8f0;
            box-shadow:0 8px 30px rgba(0,0,0,.04);
          }

          .tag{
            display:inline-flex;
            padding:8px 14px;
            border-radius:999px;
            background:#dcfce7;
            color:#166534;
            font-weight:700;
            margin-bottom:18px;
            font-size:13px;
          }

          .title{
            margin-top:0;
            font-size:clamp(2rem,4vw,3rem);
            font-weight:900;
            color:#0f172a;
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}

function Section({ title, text }: any) {
  return (
    <section
      style={{
        marginTop: 34,
      }}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 800,
          color: "#166534",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#475569",
          lineHeight: 1.9,
        }}
      >
        {text}
      </p>
    </section>
  );
}
