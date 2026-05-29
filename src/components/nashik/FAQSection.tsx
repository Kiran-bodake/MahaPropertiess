"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Nashik good for real estate investment?",
    answer:
      "Yes. Nashik is experiencing rapid growth due to infrastructure projects, industrial development, educational migration, tourism, and future infrastructure expansion.",
  },

  {
    question: "Which areas in Nashik have highest appreciation potential?",
    answer:
      "Gangapur Road, Pathardi, Trimbak Road, and Nashik Road are among the fastest-growing investment corridors due to connectivity and infrastructure development.",
  },

  {
    question: "Will the bullet train impact property prices?",
    answer:
      "Major connectivity projects historically increase land appreciation and attract commercial and residential development across surrounding regions.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      style={{
        padding: "0px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "80px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#16a34a",
            }}
          >
            FAQs
          </p>

          <h2
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#111827",
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ LIST */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                style={{
                  overflow: "hidden",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                  transition: "all .3s ease",
                }}
              >
                {/* QUESTION */}
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    padding: "24px 32px",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "all .3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "transparent";
                  }}
                >
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {faq.question}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      width: "40px",
                      height: "40px",
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "999px",
                      background: "#ecfdf5",
                      transition: "all .3s ease",
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <ChevronDown
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "#16a34a",
                      }}
                    />
                  </div>
                </button>

                {/* ANSWER */}
                <div
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "all .35s ease-in-out",
                  }}
                >
                  <div
                    style={{
                      borderTop: "1px solid #f3f4f6",
                      padding: "24px 32px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "17px",
                        lineHeight: 1.9,
                        color: "#4b5563",
                        margin: 0,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}