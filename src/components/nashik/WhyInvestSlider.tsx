"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import { motion } from "framer-motion";

import { investmentReasons } from "@/data/nashikData";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function WhyInvestSlider() {
  return (
    <section
      style={{
        overflow: "hidden",
        padding: "64px 0 96px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            marginBottom: "80px",
            maxWidth: "850px",
          }}
        >
          <p
            style={{
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#16a34a",
            }}
          >
            Why Invest In Nashik
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#111827",
            }}
          >
            A rapidly growing investment
            destination powered by tourism,
            industry, education, and
            infrastructure.
          </h2>
        </div>

        {/* SLIDER */}
        <Swiper
          className="whyInvestSwiper"
          modules={[
            Navigation,
            Pagination,
            Autoplay,
          ]}
          navigation
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={30}
        >
          {investmentReasons.map((item) => (
            <SwiperSlide key={item.title}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1.05fr .95fr",
                  alignItems: "center",
                  gap: "48px",
                }}
              >
                {/* IMAGE */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -40,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  style={{
                    position: "relative",
                    height: "520px",
                    overflow: "hidden",
                    borderRadius: "40px",
                    boxShadow:
                      "0 30px 80px rgba(0,0,0,0.15)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      transition:
                        "transform .7s ease",
                    }}
                  />
                </motion.div>

                {/* CONTENT */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  style={{
                    paddingRight: "10px",
                  }}
                >
                  {/* STAT */}
                  <div
                    style={{
                      display: "inline-flex",
                      borderRadius: "999px",
                      background: "#dcfce7",
                      padding: "10px 20px",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#15803d",
                    }}
                  >
                    {item.stat}
                  </div>

                  {/* TITLE */}
                  <h3
                    style={{
                      marginTop: "28px",
                      marginBottom: 0,
                      fontSize: "52px",
                      fontWeight: 900,
                      lineHeight: 1.1,
                      letterSpacing: "-0.03em",
                      color: "#111827",
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      marginTop: "28px",
                      fontSize: "20px",
                      lineHeight: 1.9,
                      color: "#4b5563",
                    }}
                  >
                    {item.description}
                  </p>

                  {/* IMPACT CARD */}
                  <div
                    style={{
                      marginTop: "36px",
                      borderRadius: "28px",
                      border:
                        "1px solid #e5e7eb",
                      background: "#ffffff",
                      padding: "28px",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.06)",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      Investment Impact
                    </h4>

                    <p
                      style={{
                        marginTop: "16px",
                        marginBottom: 0,
                        lineHeight: 1.9,
                        color: "#4b5563",
                        fontSize: "17px",
                      }}
                    >
                      {item.impact}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/properties"
                    style={{
                      marginTop: "40px",
                      display: "inline-flex",
                      height: "56px",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "18px",
                      background: "#16a34a",
                      padding: "0 32px",
                      fontWeight: 700,
                      color: "#ffffff",
                      textDecoration: "none",
                      boxShadow:
                        "0 15px 40px rgba(0,0,0,0.05)",
                      transition:
                        "all .3s ease",
                    }}
                  >
                    Explore Investment
                    Opportunities
                  </Link>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* SWIPER CUSTOM STYLE */}
      <style jsx global>{`
        .whyInvestSwiper {
          overflow: hidden;
        }

        .whyInvestSwiper .swiper-button-prev,
        .whyInvestSwiper .swiper-button-next {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 40px
            rgba(0, 0, 0, 0.1);
          border: 1px solid
            rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }

        .whyInvestSwiper
          .swiper-button-prev::after,
        .whyInvestSwiper
          .swiper-button-next::after {
          font-size: 18px;
          font-weight: 800;
          color: #16a34a;
        }

        .whyInvestSwiper
          .swiper-pagination {
          position: relative;
          margin-top: 42px;
        }

        .whyInvestSwiper
          .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          opacity: 1;
          background: #d1d5db;
          transition: all 0.3s ease;
        }

        .whyInvestSwiper
          .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 999px;
          background: #16a34a;
        }
      `}</style>
    </section>
  );
}