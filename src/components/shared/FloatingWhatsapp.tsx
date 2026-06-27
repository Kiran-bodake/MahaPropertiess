// src/components/shared/FloatingWhatsapp.tsx

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  return (
    <>
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 9999,

          width: "58px",
          height: "58px",

          borderRadius: "50%",
          background: "#25d366",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "#fff",

          boxShadow: "none",

          border: "2px solid rgba(255,255,255,.25)",

          animation: "waFloat 3s ease-in-out infinite",

          textDecoration: "none",
        }}
      >
        <FaWhatsapp size={30} />
      </a>
    </>
  );
}
