"use client";

import Image from "next/image";
import Link from "next/link";
import HomePropertyCard from "@/components/property/HomePropertyCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HotLocalities({ properties }: { properties: any[] }) {
  return (
    <section
      style={{
        padding: "64px 20px 96px",
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
            maxWidth: "1000px",
          }}
        >
          <p
            style={{
              marginBottom: "14px",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#16a34a",
            }}
          >
            Investment Opportunities
          </p>

          <h2
            style={{
              fontSize: "clamp(34px,3vw,56px)",
              whiteSpace: "nowrap",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#111827",
              margin: 0,
              maxWidth: "800px",
            }}
          >
            High-Growth Investment Localities In Nashik
          </h2>
        </div>

        {/* GRID */}
        <div style={{ position: "relative" }}>
          <Swiper
            className="hotLocalitiesSwiper"
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: 1.1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
              1500: {
                slidesPerView: 4,
              },
            }}
          >
            {properties.map((property, i) => (
              <SwiperSlide key={property._id} style={{ height: "auto" }}>
                <HomePropertyCard
                  vis={true}
                  d={i * 0.05}
                  p={{
                    ...property,

                    img: property.image,

                    t: property.title,

                    pr: property.price
                      ? `₹${Number(property.price).toLocaleString("en-IN")}`
                      : "Price on Request",

                    cat: property.category,

                    loc: property.locality
                      ? `${property.locality}, ${property.city || "Nashik"}`
                      : "Nashik",

                    area: property.area
                      ? `${property.area.toLocaleString()} ${property.areaUnit || ""}`
                      : "-",

                    rera: property.isRERA,
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style jsx global>{`
        .hotLocalitiesSwiper {
          padding: 10px 6px 60px;
        }

        .hotLocalitiesSwiper .swiper-slide {
          height: auto;
        }

        .hotLocalitiesSwiper .swiper-pagination {
          position: absolute !important;
          bottom: 10px !important;
          left: 50%;
          transform: translateX(-50%);
          width: auto !important;
        }

        .hotLocalitiesSwiper .swiper-button-prev,
        .hotLocalitiesSwiper .swiper-button-next {
          top: auto !important;
          bottom: 0px !important;
          width: 40px;
          height: 40px;
        }

        .hotLocalitiesSwiper .swiper-button-prev {
          left: calc(50% - 90px);
        }

        .hotLocalitiesSwiper .swiper-button-next {
          right: calc(50% - 90px);
        }

        .hotLocalitiesSwiper .swiper-button-prev,
        .hotLocalitiesSwiper .swiper-button-next {
          border-radius: 999px;
          background: #fff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .hotLocalitiesSwiper .swiper-button-prev::after,
        .hotLocalitiesSwiper .swiper-button-next::after {
          font-size: 16px;
          color: #16a34a;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}
