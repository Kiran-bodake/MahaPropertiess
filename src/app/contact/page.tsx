"use client";

import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

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
        <section className="heroSection">
          <div className="heroGlowOne" />
          <div className="heroGlowTwo" />

          <div className="heroContainer">
            <div className="heroBadge">MahaProperties Support</div>

            <h1 className="heroTitle">Contact Us</h1>

            <p className="heroSubtitle">
              Connect with MahaProperties for verified NA plots, agriculture
              land, commercial properties and investment opportunities in
              Nashik.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contactSection">
          <div className="contactWrapper">
            <div className="premiumCard">
              {/* LEFT */}
              <div className="leftPanel">
                <div className="miniTag">CLIENT SUPPORT</div>

                <h2 className="mainHeading">
                  Have a Question?
                  <br />
                  Let’s Get in Touch 👋
                </h2>

                <p className="subText">
                  Fill up the form and our team will get back to you within 24
                  hours regarding your property enquiry or investment related
                  questions.
                </p>

                <div className="formGrid">
                  <div>
                    <label className="label">Full Name</label>

                    <input
                      placeholder="Enter your full name"
                      className="premiumField"
                    />
                  </div>

                  <div>
                    <label className="label">Email Address</label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="premiumField"
                    />
                  </div>

                  <div>
                    <label className="label">Phone Number</label>

                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      className="premiumField"
                      maxLength={10}
                      inputMode="numeric"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /\D/g,
                          "",
                        );
                      }}
                    />
                  </div>

                  <div>
                    <label className="label">Message</label>

                    <textarea
                      rows={5}
                      placeholder="Write your message..."
                      className="premiumField textarea"
                    />
                  </div>

                  <button className="premiumBtn">Submit Enquiry</button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="rightPanel">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop"
                  alt="office"
                  className="officeImage"
                />

                <div className="overlayContent">
                  <div className="overlayBlock">
                    <span className="overlayLabel">Office Address</span>

                    <h4>Nashik, Maharashtra 422001</h4>
                  </div>

                  <div className="overlayBlock">
                    <span className="overlayLabel">Working Hours</span>

                    <h4>
                      Monday to Saturday
                      <br />
                      9:00 AM to 8:00 PM
                    </h4>
                  </div>

                  <div className="overlayBlock">
                    <span className="overlayLabel">Contact Us</span>

                    <h4>+91 2532 629 711</h4>

                    <p>hello@mahaproperties.in</p>
                  </div>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    className="whatsappBtn"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          *{
            box-sizing:border-box;
          }

          .heroSection{
            position:relative;

            overflow:hidden;

            background:
              linear-gradient(
                135deg,
                #ecfdf5 0%,
                #f0fdf4 40%,
                #ffffff 100%
              );

            padding:90px 20px 140px;
          }

          .heroContainer{
            max-width:1200px;

            margin:0 auto;

            position:relative;

            z-index:2;
          }

          .heroBadge{
            display:inline-flex;

            align-items:center;

            justify-content:center;

            padding:10px 18px;

            border-radius:999px;

            background:#dcfce7;

            color:#166534;

            border:1px solid #bbf7d0;

            font-size:.82rem;

            font-weight:800;

            letter-spacing:.04em;

            margin-bottom:24px;
          }

          .heroTitle{
            margin:0;

            font-size:clamp(3rem,7vw,5.3rem);

            line-height:.95;

            font-weight:900;

            letter-spacing:-0.06em;

            color:#0f172a;
          }

          .heroSubtitle{
            margin-top:24px;

            max-width:760px;

            line-height:1.9;

            color:#475569;

            font-size:1.05rem;

            font-weight:500;
          }

          .heroGlowOne{
            position:absolute;

            width:420px;
            height:420px;

            border-radius:50%;

            background:#bbf7d0;

            filter:blur(120px);

            opacity:.55;

            top:-100px;
            left:-100px;
          }

          .heroGlowTwo{
            position:absolute;

            width:340px;
            height:340px;

            border-radius:50%;

            background:#dcfce7;

            filter:blur(120px);

            opacity:.8;

            bottom:-120px;
            right:-80px;
          }

          .contactSection{
            padding:0 16px 100px;

            margin-top:-70px;

            position:relative;

            z-index:5;
          }

          .contactWrapper{
            max-width:1220px;

            margin:0 auto;
          }

          .premiumCard{
            display:grid;

            grid-template-columns:1.08fr .92fr;

            gap:40px;

            background:white;

            border-radius:34px;

            padding:36px;

            border:1px solid #e2e8f0;

            box-shadow:
              0 20px 60px rgba(15,23,42,.08);
          }

          .leftPanel{
            color:#0f172a;
          }

          .miniTag{
            display:inline-flex;

            align-items:center;

            padding:8px 16px;

            border-radius:999px;

            background:#f0fdf4;

            border:1px solid #bbf7d0;

            color:#166534;

            font-size:.78rem;

            font-weight:800;

            letter-spacing:.08em;

            margin-bottom:26px;
          }

          .mainHeading{
            margin:0;

            font-size:clamp(2.2rem,4vw,4rem);

            line-height:1.04;

            font-weight:900;

            letter-spacing:-0.05em;

            color:#0f172a;
          }

          .subText{
            margin-top:22px;

            color:#64748b;

            line-height:1.9;

            font-size:1rem;

            max-width:620px;
          }

          .formGrid{
            display:grid;

            gap:22px;

            margin-top:40px;
          }

          .label{
            display:block;

            margin-bottom:10px;

            font-size:.92rem;

            font-weight:700;

            color:#0f172a;
          }

          .premiumField{
            width:100%;

            background:#f8fafc;

            border:1px solid #e2e8f0;

            color:#0f172a;

            border-radius:18px;

            padding:16px 18px;

            outline:none;

            transition:.25s;

            font-size:.96rem;
          }

          .premiumField::placeholder{
            color:#94a3b8;
          }

          .premiumField:focus{
            border-color:#22c55e;

            background:white;

            box-shadow:
              0 0 0 4px rgba(34,197,94,.12);
          }

          .textarea{
            resize:none;
          }

          .premiumBtn{
            height:60px;

            border:none;

            border-radius:18px;

            background:
              linear-gradient(
                135deg,
                #16a34a 0%,
                #22c55e 100%
              );

            color:white;

            font-weight:800;

            font-size:1rem;

            cursor:pointer;

            transition:.28s;

            box-shadow:
              0 10px 25px rgba(34,197,94,.25);
          }

          .premiumBtn:hover{
            transform:translateY(-2px);
          }

          .rightPanel{
            position:relative;

            min-height:680px;

            border-radius:30px;

            overflow:hidden;
          }

          .officeImage{
            width:100%;
            height:100%;

            object-fit:cover;
          }

          .rightPanel::after{
  content:"";

  position:absolute;

  inset:0;

  background:
    linear-gradient(
      to top,
      rgba(0,0,0,.88) 0%,
      rgba(0,0,0,.72) 35%,
      rgba(0,0,0,.35) 65%,
      rgba(0,0,0,.12) 100%
    );

  z-index:1;
}
.overlayContent{
  position:absolute;

  inset:0;

  z-index:2;

  padding:36px;

  display:flex;

  flex-direction:column;

  justify-content:flex-end;

  color:white;

  text-shadow:
    0 2px 10px rgba(0,0,0,.65);
}

          .overlayBlock{
            margin-top:24px;
          }

          .overlayLabel{
            font-size:.82rem;

            color:rgba(255,255,255,.72);

            display:block;

            margin-bottom:10px;
          }

          .overlayBlock h4{
  margin:0;

  font-size:1.18rem;

  line-height:1.6;

  font-weight:800;

  color:#ffffff;
}

          .overlayBlock p{
  margin-top:10px;

  color:rgba(255,255,255,.92);

  font-weight:500;
}
  .overlayLabel{
  font-size:.82rem;

  color:rgba(255,255,255,.78);

  display:block;

  margin-bottom:10px;

  font-weight:700;

  letter-spacing:.03em;

  text-transform:uppercase;
}
          .whatsappBtn{
            margin-top:30px;

            display:flex;

            align-items:center;

            justify-content:center;

            height:56px;

            border-radius:18px;

            background:#22c55e;

            color:white;

            text-decoration:none;

            font-weight:800;

            transition:.25s;
          }

          .whatsappBtn:hover{
            background:#16a34a;
          }

          @media(max-width:980px){

            .premiumCard{
              grid-template-columns:1fr;

              padding:24px;
            }

            .rightPanel{
              min-height:420px;
            }
          }

          @media(max-width:640px){

            .heroTitle{
              font-size:3rem;
            }

            .heroSubtitle{
              font-size:.95rem;
            }

            .mainHeading{
              font-size:2.2rem;
            }

            .premiumCard{
              border-radius:26px;

              padding:20px;
            }

            .rightPanel{
              min-height:340px;

              border-radius:22px;
            }

            .overlayContent{
              padding:24px;
            }

            .premiumBtn,
            .whatsappBtn{
              height:54px;
            }
          }
            /* =========================
   LARGE TABLETS
========================= */

@media(max-width:1024px){

  .premiumCard{
    grid-template-columns:1fr;

    gap:28px;

    padding:28px;
  }

  .rightPanel{
    min-height:480px;
  }

  .mainHeading{
    font-size:2.8rem;
  }
}

/* =========================
   TABLETS
========================= */

@media(max-width:768px){

  .heroSection{
    padding:70px 18px 120px;
  }

  .heroTitle{
    font-size:3.3rem;

    line-height:1;
  }

  .heroSubtitle{
    font-size:.96rem;

    line-height:1.8;

    margin-top:18px;
  }

  .contactSection{
    margin-top:-60px;

    padding:0 14px 70px;
  }

  .premiumCard{
    padding:22px;

    border-radius:28px;

    gap:24px;
  }

  .mainHeading{
    font-size:2.4rem;
  }

  .subText{
    font-size:.95rem;

    line-height:1.8;
  }

  .formGrid{
    margin-top:28px;

    gap:18px;
  }

  .rightPanel{
    min-height:420px;

    border-radius:24px;
  }

  .overlayContent{
    padding:24px;
  }

  .overlayBlock{
    margin-top:18px;
  }

  .overlayBlock h4{
    font-size:1rem;
  }
}
/* =========================
   MOBILE DEVICES
========================= */

@media(max-width:640px){

  .heroSection{
    padding:60px 16px 100px;
  }

  .heroBadge{
    font-size:.72rem;

    padding:8px 14px;
  }

  .heroTitle{
    font-size:2.5rem;

    letter-spacing:-0.04em;
  }

  .heroSubtitle{
    font-size:.92rem;

    line-height:1.7;
  }

  .contactSection{
    margin-top:-50px;

    padding:0 12px 60px;
  }

  .premiumCard{
    padding:18px;

    border-radius:22px;

    gap:20px;
  }

  .miniTag{
    font-size:.68rem;

    padding:7px 12px;

    margin-bottom:18px;
  }

  .mainHeading{
    font-size:2rem;

    line-height:1.08;
  }

  .subText{
    font-size:.9rem;

    margin-top:16px;
  }

  .label{
    font-size:.86rem;
  }

  .premiumField{
    height:54px;

    padding:0 15px;

    border-radius:14px;

    font-size:.92rem;
  }

  .textarea{
    height:120px;

    padding-top:14px;
  }

  .premiumBtn{
    height:52px;

    border-radius:14px;

    font-size:.94rem;
  }

  .rightPanel{
    min-height:340px;

    border-radius:18px;
  }

  .overlayContent{
    padding:20px;

    justify-content:flex-end;

    gap:10px;
  }

  .overlayLabel{
    font-size:.72rem;
  }

  .overlayBlock{
    margin-top:10px;
  }

  .overlayBlock h4{
    font-size:.95rem;

    line-height:1.5;
  }

  .overlayBlock p{
    font-size:.85rem;
  }

  .whatsappBtn{
    min-height:52px;

    width:100%;

    flex-shrink:0;

    border-radius:14px;

    font-size:.92rem;

    margin-top:18px;

    padding:0 18px;

    white-space:nowrap;
  }
}

/* =========================
   SMALL MOBILE
========================= */

@media(max-width:420px){

  .heroTitle{
    font-size:2.15rem;
  }

  .mainHeading{
    font-size:1.7rem;
  }

  .premiumCard{
    padding:16px;
  }

  .premiumField{
    font-size:.9rem;
  }

  .rightPanel{
    min-height:300px;
  }

  .overlayContent{
    padding:14px;
  }

  .overlayBlock{
    margin-top:14px;
  }

  .overlayBlock h4{
    font-size:.88rem;
  }

  .whatsappBtn{
    min-height:48px;

    font-size:.88rem;
  }
}
        `}</style>
      </main>

      <Footer />
    </>
  );
}
