"use client";
import { useState, useEffect } from "react";

export function PropertySectionTabs() {
  const tabs = [
    ["overview", "Overview"],
    ["description", "Property Details"],
    ["amenities", "Amenities"],
    ["highlights", "Highlights"],
    ["location", "Location"],
  ];

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const sections = tabs
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible?.target?.id) {
          setActiveTab(visible.target.id);
        }
      },
      {
        rootMargin: "-150px 0px -60% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((section) => observer.observe(section!));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 100,
        zIndex: 40,

        background: "rgba(255,255,255,.88)",

        backdropFilter: "blur(14px)",

        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 6px 20px rgba(15,23,42,.04)",
        padding: "14px 18px",
      }}
    >
      <div
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            width: "max-content",
          }}
        >
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                const element = document.getElementById(id);

                if (element) {
                  const offset = 190;

                  const top =
                    element.getBoundingClientRect().top +
                    window.pageYOffset -
                    offset;

                  window.scrollTo({
                    top,
                    behavior: "smooth",
                  });
                }
              }}
              style={{
                height: 34,

                padding: "0 14px",

                borderRadius: 999,

                border:
                  activeTab === id ? "1px solid #16a34a" : "1px solid #e2e8f0",

                background: activeTab === id ? "#16a34a" : "#f8fafc",

                color: activeTab === id ? "#fff" : "#334155",

                boxShadow: "none",

                transition: "all .25s ease",

                fontWeight: 700,

                fontSize: ".82rem",

                cursor: "pointer",

                whiteSpace: "nowrap",
                minWidth: 120,
                flexShrink: 0,

                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
