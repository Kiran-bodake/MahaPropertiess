// src/components/property/ContactPopup.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyName?: string;
  agentName?: string;
  agentPhone?: string;
  postedBy?: string;
};

const showcaseSlides = [
  {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400&auto=format&fit=crop",
    title: "Verified Premium Listings",
    desc: "100% verified NA plots, commercial spaces & investment properties.",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1400&auto=format&fit=crop",
    title: "Trusted Property Experts",
    desc: "Get instant support for pricing, site visits & documentation.",
  },
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    title: "Prime Nashik Locations",
    desc: "Discover high-growth investment opportunities in premium areas.",
  },
];

export default function ContactPopup({
  open,
  onClose,
  propertyId = "unknown-property-id",
  propertyName = "Unknown Property",
  agentName = "Property Expert",
  agentPhone = "Not Available",
  postedBy = "Agency",
}: Props) {
  const [selected, setSelected] = useState("Buy");
  const [activeSlide, setActiveSlide] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState<any>(null);

  const goNext = useCallback(() => {
    setActiveSlide((p) => p === showcaseSlides.length - 1 ? 0 : p + 1);
  }, []);

  const goPrev = useCallback(() => {
    setActiveSlide((p) => p === 0 ? showcaseSlides.length - 1 : p - 1);
  }, []);

  const fetchThankYouMessage = useCallback(async () => {
    try {
      const res = await fetch("/api/thankyou-messages?active=true");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.messages && data.messages.length > 0) {
        setThankYouMessage(data.messages[0]);
      } else {
        setThankYouMessage({
          _id: "default",
          title: "Thank You!",
          message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
          buttonText: "Close",
          backgroundColor: "#16a34a",
          icon: "✓"
        });
      }
    } catch (error) {
      console.error("Error fetching thank you message:", error);
      setThankYouMessage({
        _id: "default",
        title: "Thank You!",
        message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
        buttonText: "Close",
        backgroundColor: "#16a34a",
        icon: "✓"
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!name || !phone || !email) {
      toast.error("Please fill all fields");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      toast.error("Invalid mobile number. Please enter 10 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          propertyName,
          name,
          mobileNumber: cleanPhone,
          email,
          interest: selected,
          whatsappConsent,
          agentName,
          agentPhone,
          postedBy,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        await fetchThankYouMessage();
        setShowThankYou(true);
        
        setName("");
        setPhone("");
        setEmail("");
        setSelected("Buy");
        setWhatsappConsent(true);
        
        setTimeout(() => {
          setShowThankYou(false);
          onClose();
        }, 5000);
      } else {
        toast.error(data.message || "Failed to save information");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchThankYouMessage();
      const timer = setInterval(goNext, 3500);
      return () => clearInterval(timer);
    }
  }, [open, goNext, fetchThankYouMessage]);

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="closeBtn" aria-label="Close Popup">
            ×
          </button>

          {/* LEFT PANEL */}
          <div className="leftPanel">
            <div className="slider">
              {showcaseSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`slide ${activeSlide === index ? "active" : ""}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="slideOverlay" />
                  <div className="slideContent">
                    <span className="brandBadge">★ MAHAPROPERTYS</span>
                    <h2 className="slideTitle">{slide.title}</h2>
                    <p className="slideDesc">{slide.desc}</p>
                  </div>
                </div>
              ))}
              <button type="button" className="navArrow navArrow--left" onClick={goPrev}>‹</button>
              <button type="button" className="navArrow navArrow--right" onClick={goNext}>›</button>
              <div className="dots">
                {showcaseSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${activeSlide === index ? "activeDot" : ""}`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="rightPanel">
            <div className="rightPanelContent">
              <div className="header">
                <h2>Contact Property Owner</h2>
                <p className="headerDescription">Get pricing details, brochures, site visit support and expert consultation instantly.</p>
              </div>

              {/* AGENT INFO CARD */}
              <div className="agentInfoCard">
                <div className="agentHeader">
                  <div className="agentIcon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="agentInfo">
                    <div className="agentName">{agentName}</div>
                    <div className="agentRole">{postedBy}</div>
                  </div>
                  {agentPhone !== "Not Available" && (
                    <a href={`tel:${agentPhone}`} className="callBtn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92V19C22.001 19.7906 21.8119 20.5701 21.4503 21.2693C21.0887 21.9685 20.5665 22.5631 19.9317 23C19.2969 23.4369 18.5712 23.7027 17.8135 23.7748C17.0559 23.8469 16.2939 23.7231 15.6 23.414C12.757 22.2765 10.1888 20.5002 8.07998 18.22C5.79999 16.1099 4.02456 13.543 2.88798 10.7C2.579 10.006 2.45511 9.24404 2.52713 8.48633C2.59915 7.72863 2.86474 7.00298 3.30155 6.36822C3.73836 5.73346 4.33287 5.21126 5.03206 4.84977C5.73125 4.48828 6.51072 4.29925 7.30131 4.30005H9.40001C10.1786 4.29647 10.9361 4.53153 11.582 4.97334C12.2279 5.41515 12.7311 6.04151 13.021 6.77005L13.94 9.08005C14.1826 9.68853 14.2279 10.3615 14.0685 10.9997C13.9091 11.6379 13.5556 12.2025 13.065 12.6101L11.654 13.8111C12.6967 15.4166 14.1312 16.7537 15.828 17.6861L17.045 16.2851C17.4568 15.7996 18.0204 15.4495 18.6542 15.2913C19.2881 15.1332 19.9552 15.1761 20.559 15.4131L22.788 16.3211C23.5166 16.6111 24.143 17.1144 24.5848 17.7604C25.0266 18.4064 25.2616 19.164 25.258 19.9427L24.999 20.92" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Call
                    </a>
                  )}
                </div>
                <div className="agentDetails">
                  <div className="detailBadge">
                    <span>⏱️ Response: Within 30 mins</span>
                  </div>
                  <div className="detailBadge">
                    <span>✓ Verified Professional</span>
                  </div>
                </div>
              </div>

              <div className="section">
                <label className="label">I am interested in</label>
                <div className="radioWrap">
                  {["Buy", "Rent", "Investment"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelected(item)}
                      className={selected === item ? "pillBtn active" : "pillBtn"}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <label className="checkWrap">
                <input
                  type="checkbox"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                />
                <span>Get instant updates on WhatsApp</span>
              </label>

              <button className="submitBtn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Get Contact Details"}
              </button>

              <div className="trustInfo">🔒 Your information is safe & secure with MahaPropertys</div>
            </div>
          </div>
        </div>
      </div>

      {/* THANK YOU MODAL */}
      {showThankYou && thankYouMessage && (
        <div className="thankyouOverlay">
          <div className="thankyouModal" style={{ borderTopColor: thankYouMessage.backgroundColor || "#16a34a" }}>
            <div className="thankyouIcon" style={{ backgroundColor: thankYouMessage.backgroundColor || "#16a34a" }}>
              {thankYouMessage.icon || "✓"}
            </div>
            <h2 className="thankyouTitle">{thankYouMessage.title || "Thank You!"}</h2>
            <p className="thankyouMessage">{thankYouMessage.message || "Your property inquiry has been submitted successfully. Our expert will contact you shortly."}</p>
            <div className="thankyouDetails">
              <div className="detailItem">
                <span className="detailLabel">Property:</span>
                <span className="detailValue">{propertyName}</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Interest:</span>
                <span className="detailValue">{selected}</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Agent:</span>
                <span className="detailValue">{agentName}</span>
              </div>
            </div>
            <button 
              className="thankyouButton" 
              style={{ backgroundColor: thankYouMessage.backgroundColor || "#16a34a" }}
              onClick={() => {
                setShowThankYou(false);
                onClose();
              }}
            >
              {thankYouMessage.buttonText || "Close"}
            </button>
            <div className="thankyouTimer">Closing in 5 seconds...</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(8px);
        }

        .popup {
          width: 100%;
          max-width: 1000px;
          height: 620px;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .closeBtn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .closeBtn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.05);
        }

        /* LEFT PANEL */
        .leftPanel {
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .slider {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          background-size: cover;
          background-position: center;
          padding: 30px;
          display: flex;
          align-items: flex-end;
        }

        .slide.active {
          opacity: 1;
        }

        .slideOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2));
        }

        .slideContent {
          position: relative;
          z-index: 2;
          color: white;
        }

        /* PROFESSIONAL GRADIENT TEXT FOR TITLES */
        .slideTitle {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #ffffff 0%, #d1fae5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .slideDesc {
          font-size: 0.9rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.85);
          max-width: 90%;
        }

        .brandBadge {
          background: #16a34a;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 12px;
        }

        .navArrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 20px;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }

        .navArrow:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .navArrow--left {
          left: 12px;
        }

        .navArrow--right {
          right: 12px;
        }

        .dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.2s;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .activeDot {
          background: #22c55e;
          width: 24px;
          border-radius: 4px;
        }

        /* RIGHT PANEL */
        .rightPanel {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: white;
          overflow: hidden;
        }

        .rightPanelContent {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
        }

        .rightPanelContent::-webkit-scrollbar {
          width: 4px;
        }

        .rightPanelContent::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .rightPanelContent::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 10px;
        }

        .header h2 {
          font-size: 1.5rem;
          margin: 0 0 6px 0;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .headerDescription {
          color: #475569;
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
        }

        /* AGENT INFO CARD */
        .agentInfoCard {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 16px;
          padding: 14px;
          border: 1px solid #bbf7d0;
        }

        .agentHeader {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .agentIcon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .agentInfo {
          flex: 1;
        }

        .agentName {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
        }

        .agentRole {
          font-size: 11px;
          color: #16a34a;
          font-weight: 600;
        }

        .callBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .callBtn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
        }

        .agentDetails {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .detailBadge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: white;
          border-radius: 8px;
          font-size: 11px;
          color: #16a34a;
          font-weight: 500;
        }

        .section {
          margin-top: 0;
        }

        .label {
          font-weight: 700;
          margin-bottom: 8px;
          display: block;
          font-size: 13px;
          color: #0f172a;
        }

        .radioWrap {
          display: flex;
          gap: 10px;
        }

        .pillBtn {
          flex: 1;
          height: 38px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1.5px solid #d1fae5;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 13px;
          color: #334155;
        }

        .pillBtn:hover {
          border-color: #16a34a;
          color: #16a34a;
        }

        .pillBtn.active {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          border-color: #16a34a;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          padding: 0 14px;
          font-size: 14px;
          transition: all 0.2s;
          outline: none;
          color: #1e293b;
        }

        .input:hover {
          border-color: #86efac;
        }

        .input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .input::placeholder {
          color: #94a3b8;
        }

        .checkWrap {
          display: flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
        }

        .checkWrap input {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #16a34a;
        }

        .checkWrap span {
          color: #475569;
          font-size: 12px;
        }

        .submitBtn {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submitBtn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }

        .submitBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .trustInfo {
          text-align: center;
          color: #94a3b8;
          font-size: 10px;
        }

        /* THANK YOU MODAL */
        .thankyouOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(8px);
        }

        .thankyouModal {
          background: white;
          border-radius: 24px;
          padding: 32px;
          max-width: 420px;
          width: 90%;
          text-align: center;
          border-top: 5px solid #16a34a;
          animation: fadeInUp 0.3s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .thankyouIcon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 40px;
          font-weight: bold;
          color: white;
        }

        .thankyouTitle {
          font-size: 24px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
        }

        .thankyouMessage {
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .thankyouDetails {
          background: #f8fafc;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 20px;
          text-align: left;
        }

        .detailItem {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 13px;
        }

        .detailLabel {
          font-weight: 600;
          color: #64748b;
        }

        .detailValue {
          color: #0f172a;
          font-weight: 500;
        }

        .thankyouButton {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .thankyouButton:hover {
          transform: translateY(-1px);
        }

        .thankyouTimer {
          margin-top: 12px;
          font-size: 11px;
          color: #94a3b8;
        }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .popup {
            grid-template-columns: 1fr;
            height: auto;
            max-height: 90vh;
            width: 95%;
          }

          .leftPanel {
            display: none;
          }

          .rightPanel {
            height: auto;
          }

          .rightPanelContent {
            max-height: 80vh;
          }
        }

        @media (max-width: 480px) {
          .rightPanelContent {
            padding: 18px;
          }

          .header h2 {
            font-size: 1.3rem;
          }

          .radioWrap {
            flex-wrap: wrap;
          }

          .pillBtn {
            min-width: 80px;
          }

          .agentHeader {
            flex-wrap: wrap;
          }

          .callBtn {
            width: 100%;
            justify-content: center;
          }

          .thankyouModal {
            padding: 24px 20px;
          }

          .thankyouTitle {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}