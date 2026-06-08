// src/components/property/ContactButton.tsx
"use client";

import { useState } from "react";
import ContactPopup from "./ContactPopup";

type Props = {
  propertyId: string;
  propertyName: string;
  agentName: string;
  agentPhone: string;
  postedBy: string;
};

export default function ContactButton({
  propertyId,
  propertyName,
  agentName,
  agentPhone,
  postedBy,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: "100%",
          marginTop: 16,
          padding: "14px",
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
          color: "white",
          border: "none",
          borderRadius: "14px",
          fontWeight: "700",
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 10px 20px -5px rgba(22,163,74,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span>📞</span>
        Contact {postedBy === "Owner" ? "Owner" : "Agent"} Directly
      </button>

      <ContactPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        propertyId={propertyId}
        propertyName={propertyName}
        agentName={agentName}
        agentPhone={agentPhone}
        postedBy={postedBy}
      />
    </>
  );
}