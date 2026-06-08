"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type ThankYouMessage = {
  _id?: string;
  title: string;
  message: string;
  buttonText: string;
  backgroundColor: string;
  icon: string;
  isActive: boolean;
};

export function PropertyLeadForm({ propertyTitle }: { propertyTitle: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState<ThankYouMessage | null>(null);

  // Fetch active thank you message from database
  const fetchThankYouMessage = async () => {
    try {
      const res = await fetch("/api/thankyou-messages?active=true");
      const data = await res.json();
      if (data.success && data.messages && data.messages.length > 0) {
        setThankYouMessage(data.messages[0]);
      } else {
        // Default message if none configured
        setThankYouMessage({
          title: "Thank You!",
          message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
          buttonText: "Close",
          backgroundColor: "#16a34a",
          icon: "✓",
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error fetching thank you message:", error);
      // Default message on error
      setThankYouMessage({
        title: "Thank You!",
        message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
        buttonText: "Close",
        backgroundColor: "#16a34a",
        icon: "✓",
        isActive: true,
      });
    }
  };

  // Fetch message when component mounts
  useEffect(() => {
    fetchThankYouMessage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/property-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyTitle,
          customerName: name,
          email,
          phone: cleanPhone,
          message,
          inquiryType: "lead-form",
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Property Inquiry Saved");
        
        // Fetch latest thank you message before showing
        await fetchThankYouMessage();
        setShowThankYou(true);
        
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setSubmitted(true);
        
        // Auto close thank you modal after 5 seconds
        setTimeout(() => {
          setShowThankYou(false);
        }, 5000);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeThankYou = () => {
    setShowThankYou(false);
    // Optional: Reset submitted state after modal closes
    setTimeout(() => {
      setSubmitted(false);
    }, 300);
  };

  const inp: React.CSSProperties = {
    width: "100%",
    height: 52,
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "0 16px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
    minWidth: 0,
  };

  if (submitted && !showThankYou) {
    return (
      <div
        style={{
          padding: "14px 18px",
          background: "#fff8dc",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            marginBottom: "6px",
          }}
        >
          ✅
        </div>

        <p
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#92400e",
          }}
        >
          We'll call you back shortly!
        </p>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "0.85rem",
            color: "#a16207",
          }}
        >
          Thank you for your interest in {propertyTitle}.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          marginTop: "8px",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
          border: "1px solid #bbf7d0",
          borderRadius: "14px",
          padding: "18px 20px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#ca8a04",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            Quick Enquiry
          </div>

          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "1.45rem",
              color: "#14532d",
            }}
          >
            Interested in this property?
          </p>

        <p
          style={{
            margin: "3px 0 0",
            fontSize: "0.85rem",
            color: "#92400e",
          }}
        >
          Leave your details — our expert will call you back shortly.
        </p>
      </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div
            className="quickLeadGrid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              alignItems: "start",
            }}
          >
            {/* NAME */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name *"
              required
              style={inp}
            />

            {/* EMAIL */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address *"
              type="email"
              required
              style={inp}
            />

            {/* PHONE */}
            <input
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(value);
              }}
              placeholder="Phone number *"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              required
              style={inp}
            />

            {/* MESSAGE */}
            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message (optional)"
                rows={4}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  padding: 16,
                  fontSize: ".96rem",
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                  minHeight: 120,
                }}
              />
            </div>

            {/* BUTTON */}
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 52,
                  padding: "0 28px",
                  border: "none",
                  borderRadius: "14px",
                  background: "linear-gradient(to right,#15803d,#16a34a)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: ".96rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  opacity: loading ? 0.8 : 1,
                  boxShadow: "0 10px 20px rgba(22,163,74,.18)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? "Sending..." : "Get a Callback"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Professional Thank You Modal */}
      {showThankYou && thankYouMessage && (
        <div className="thankyouOverlay" onClick={closeThankYou}>
          <div 
            className="thankyouModal" 
            style={{ borderTopColor: thankYouMessage.backgroundColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="thankyouIcon" 
              style={{ backgroundColor: thankYouMessage.backgroundColor }}
            >
              {thankYouMessage.icon}
            </div>
            <h2 className="thankyouTitle">{thankYouMessage.title}</h2>
            <p className="thankyouMessage">{thankYouMessage.message}</p>
            
            <div className="thankyouDetails">
              <div className="detailRow">
                <span className="detailLabel">Property:</span>
                <span className="detailValue">{propertyTitle}</span>
              </div>
              <div className="detailRow">
                <span className="detailLabel">Name:</span>
                <span className="detailValue">{name}</span>
              </div>
              {phone && (
                <div className="detailRow">
                  <span className="detailLabel">Contact:</span>
                  <span className="detailValue">{phone}</span>
                </div>
              )}
            </div>

            <button 
              className="thankyouButton" 
              style={{ backgroundColor: thankYouMessage.backgroundColor }}
              onClick={closeThankYou}
            >
              {thankYouMessage.buttonText}
            </button>
            <div className="thankyouTimer">Closing in 5 seconds...</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .quickLeadGrid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Thank You Modal Styles */
        .thankyouOverlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        .thankyouModal {
          background: white;
          border-radius: 28px;
          padding: 40px;
          max-width: 450px;
          width: 90%;
          text-align: center;
          border-top: 6px solid #16a34a;
          animation: slideUp 0.4s ease;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .thankyouIcon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 48px;
          font-weight: bold;
          color: white;
          animation: scaleIn 0.5s ease;
        }

        .thankyouTitle {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .thankyouMessage {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .thankyouDetails {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }

        .detailRow {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .detailRow:last-child {
          border-bottom: none;
        }

        .detailLabel {
          font-weight: 600;
          color: #64748b;
        }

        .detailValue {
          color: #111827;
          font-weight: 500;
        }

        .thankyouButton {
          width: 100%;
          padding: 14px;
          background: #16a34a;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .thankyouButton:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .thankyouTimer {
          margin-top: 16px;
          font-size: 12px;
          color: #9ca3af;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .thankyouModal {
            padding: 30px 20px;
          }
          
          .thankyouTitle {
            font-size: 24px;
          }
          
          .thankyouIcon {
            width: 60px;
            height: 60px;
            font-size: 36px;
          }
          
          .detailRow {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}