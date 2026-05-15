"use client";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { use } from "react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* HERO */}
        <section
          style={{
            background:
              "linear-gradient(135deg,#052e16 0%, #166534 55%, #22c55e 100%)",

            color: "#ffffff",

            padding: "72px 20px",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,

                padding: "10px 16px",

                borderRadius: 999,

                background: "rgba(255,255,255,.22)",

                border: "1px solid rgba(255,255,255,.18)",

                marginBottom: 20,

                fontWeight: 700,

                fontSize: 13,

                color: "#ffffff",

                backdropFilter: "blur(10px)",
              }}
            >
              MahaProperties Support
            </div>

            <h1
              style={{
                margin: 0,

                fontSize: "clamp(2.2rem,5vw,4.3rem)",

                fontWeight: 900,

                lineHeight: 1.05,

                color: "#ffffff",

                letterSpacing: "-0.04em",
              }}
            >
              Contact Us
            </h1>

            <p
              style={{
                marginTop: 22,

                maxWidth: 720,

                lineHeight: 1.9,

                color: "#ffffff",

                fontSize: "1.02rem",

                fontWeight: 500,
              }}
            >
              Connect with MahaProperties for verified NA plots, agriculture
              land, commercial properties and investment opportunities in
              Nashik.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section
          style={{
            padding: "48px 16px 80px",
          }}
        >
          <div
            className="contactGrid"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.2fr .8fr",
              gap: 24,
            }}
          >
            {/* LEFT */}
            <div className="box">
              <h2
                style={{
                  marginTop: 0,
                  fontSize: "1.7rem",
                  fontWeight: 800,
                }}
              >
                Get In Touch
              </h2>

              <div className="contactCard">
                <div className="iconWrap">📞</div>

                <div>
                  <div className="cardTitle">Call Us</div>

                  <a
                    href="tel:02532629711"
                    style={{
                      color: "#16a34a",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    0253 262 9711
                  </a>
                </div>
              </div>

              <div className="contactCard">
                <div className="iconWrap">📧</div>

                <div>
                  <div className="cardTitle">Email</div>

                  <div>hello@mahaproperties.in</div>
                </div>
              </div>

              <div className="contactCard">
                <div className="iconWrap">📍</div>

                <div>
                  <div className="cardTitle">Office</div>

                  <div>Nashik, Maharashtra 422001</div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="box">
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "1.4rem",
                  fontWeight: 800,
                }}
              >
                Send Message
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: 16,
                  marginTop: 20,
                }}
              >
                <input placeholder="Your Name" className="field" />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="field"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      "",
                    );
                  }}
                />

                <input placeholder="Email Address" className="field" />

                <textarea
                  placeholder="Your Message"
                  rows={6}
                  className="field"
                />

                <button className="submitBtn">Submit Enquiry</button>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          .box{
            background:white;
            border-radius:24px;
            padding:28px;
            border:1px solid #e2e8f0;
            box-shadow:0 8px 30px rgba(0,0,0,.04);
          }

          .contactCard{
            display:flex;
            gap:14px;
            padding:18px;
            border-radius:18px;
            background:#f8fafc;
            border:1px solid #e2e8f0;
            margin-top:16px;
          }

          .iconWrap{
            width:46px;
            height:46px;
            border-radius:14px;
            background:#dcfce7;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:1.2rem;
          }

          .cardTitle{
            font-weight:800;
            margin-bottom:6px;
          }

          .field{
            width:100%;
            border:1px solid #dbeafe;
            background:#f8fafc;
            border-radius:14px;
            padding:14px 16px;
            outline:none;
            box-sizing:border-box;
          }

          .submitBtn{
            height:52px;
            border:none;
            border-radius:14px;
            background:#16a34a;
            color:white;
            font-weight:800;
            cursor:pointer;
          }

          @media(max-width:900px){
            .contactGrid{
              grid-template-columns:1fr !important;
            }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
