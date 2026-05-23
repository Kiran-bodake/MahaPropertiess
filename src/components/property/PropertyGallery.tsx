"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({
  images,
  title,
  price,
}: {
  images: string[];
  title: string;
  price: number;
}) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  /* DEFAULT IMAGE */
  const safeImages = images?.length ? images : ["/maha.png"];

  function nextImage() {
    setActive((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }

  function prevImage() {
    setActive((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }

  return (
    <div>
      {/* MAIN IMAGE */}
      <div
        style={{
          position: "relative",

          width: "100%",

          height: "clamp(260px,45vw,520px)",

          overflow: "hidden",

          borderRadius: "16px 16px 0 0",
        }}
      >
        <Image
          src={safeImages[active]}
          alt={title}
          fill
          priority
          onClick={() => setFullscreen(true)}
          style={{
            objectFit: "cover",
            cursor: "zoom-in",
          }}
        />

        {/* PREV */}
        {safeImages.length > 1 && (
          <button
            onClick={prevImage}
            style={{
              position: "absolute",

              left: 12,

              top: "50%",

              transform: "translateY(-50%)",

              width: 38,

              height: 38,

              border: "none",

              borderRadius: "50%",

              cursor: "pointer",

              fontSize: "16px",

              background: "rgba(255,255,255,.92)",

              zIndex: 10,
            }}
          >
            ←
          </button>
        )}

        {/* NEXT */}
        {safeImages.length > 1 && (
          <button
            onClick={nextImage}
            style={{
              position: "absolute",

              right: 12,

              top: "50%",

              transform: "translateY(-50%)",

              width: 38,

              height: 38,

              border: "none",

              borderRadius: "50%",

              cursor: "pointer",

              fontSize: "16px",

              background: "rgba(255,255,255,.92)",

              zIndex: 10,
            }}
          >
            →
          </button>
        )}

        {/* IMAGE COUNT */}
        <div
          style={{
            position: "absolute",

            right: 12,

            bottom: 12,

            background: "rgba(0,0,0,.6)",

            color: "#fff",

            padding: "5px 10px",

            borderRadius: 999,

            fontSize: ".8rem",

            zIndex: 10,
          }}
        >
          {active + 1} / {safeImages.length}
        </div>
      </div>

      {/* THUMBNAILS + PRICE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          padding: "12px 16px",
          background: "#fff",
          flexWrap: "wrap",
        }}
      >
        {/* THUMBNAILS */}
        {safeImages.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              flex: 1,
            }}
          >
            {safeImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setActive(index)}
                style={{
                  position: "relative",

                  minWidth: 72,

                  width: 72,

                  height: 54,

                  borderRadius: 10,

                  overflow: "hidden",

                  cursor: "pointer",

                  flexShrink: 0,

                  border:
                    active === index
                      ? "2px solid #16a34a"
                      : "1px solid #e2e8f0",
                }}
              >
                <Image
                  src={img}
                  alt={title}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* PRICE */}
        <div
          style={{
            background: "#0f172a",

            color: "#fff",

            fontWeight: 800,

            fontSize: "clamp(.95rem,3vw,1.2rem)",

            padding:
              typeof window !== "undefined" && window.innerWidth < 768
                ? "9px 14px"
                : "12px 20px",

            borderRadius: 14,

            whiteSpace: "nowrap",

            boxShadow: "0 8px 18px rgba(0,0,0,.12)",

            lineHeight: 1,

            flexShrink: 0,
          }}
        >
          ₹{price.toLocaleString("en-IN")}
        </div>
      </div>
      {/* FULLSCREEN PREVIEW */}
      {fullscreen && (
        <div
          onClick={() => setFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.72)",
            backdropFilter: "blur(18px)",
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 1500,
              height: "90vh",
              borderRadius: 28,
              overflow: "hidden",
            }}
          >
            <Image
              src={safeImages[active]}
              alt={title}
              fill
              priority
              style={{
                objectFit: "contain",
                background: "#000",
              }}
            />

            {/* CLOSE */}
            <button
              onClick={() => setFullscreen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,.18)",
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            {/* PREV */}
            {safeImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                style={{
                  position: "absolute",

                  left: 18,

                  top: "50%",

                  transform: "translateY(-50%)",

                  width: 54,

                  height: 54,

                  borderRadius: "50%",

                  border: "1px solid rgba(255,255,255,.18)",

                  background: "rgba(255,255,255,.12)",

                  color: "#fff",

                  fontSize: 24,

                  cursor: "pointer",

                  backdropFilter: "blur(10px)",

                  zIndex: 20,
                }}
              >
                ←
              </button>
            )}
            {/* NEXT */}
            {safeImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                style={{
                  position: "absolute",

                  right: 18,

                  top: "50%",

                  transform: "translateY(-50%)",

                  width: 54,

                  height: 54,

                  borderRadius: "50%",

                  border: "1px solid rgba(255,255,255,.18)",

                  background: "rgba(255,255,255,.12)",

                  color: "#fff",

                  fontSize: 24,

                  cursor: "pointer",

                  backdropFilter: "blur(10px)",

                  zIndex: 20,
                }}
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
