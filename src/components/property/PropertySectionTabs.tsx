"use client";

export function PropertySectionTabs() {
  const tabs = [
    ["overview", "Overview"],
    ["description", "Description"],
    ["amenities", "Amenities"],
    ["highlights", "Highlights"],
    ["location", "Location"],
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 100,
        zIndex: 40,

        background: "rgba(255,255,255,.88)",
        width: "100%",
        marginLeft: 0,
        marginRight: 0,

        backdropFilter: "blur(14px)",

        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 6px 20px rgba(15,23,42,.04)",
        padding: "14px 18px",

        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "grid",

          gridTemplateColumns: "repeat(5,minmax(0,1fr))",

          gap: 12,

          width: "100%",
        }}
      >
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
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

              border: "1px solid #e2e8f0",

              background: "#f8fafc",

              color: "#334155",

              fontWeight: 700,

              fontSize: ".82rem",

              cursor: "pointer",

              whiteSpace: "nowrap",

              flexShrink: 0,
              minWidth: 118,
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
  );
}
