"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

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
            WHY INVEST TODAY
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 3vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#111827",
              maxWidth: "900px",
            }}
          >
            The Economic Forces Powering Nashik's Future
          </h2>

          {/* ADD HERE */}
          <p
            style={{
              marginTop: "24px",
              maxWidth: "800px",
              fontSize: "17px",
              lineHeight: 1.8,
              color: "#4b5563",
            }}
          >
            Discover the key industries, infrastructure projects, and growth
            drivers shaping Nashik's long-term real estate potential.
          </p>
        </div>

        {/* SLIDER */}
        <Swiper
          className="whyInvestSwiper"
          modules={[Navigation, Pagination, Autoplay]}
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
              <div className="investSlide">
                {/* IMAGE */}
                <motion.div
                  className="investImage"
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
                    overflow: "hidden",
                    borderRadius: "40px",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    style={{
                      objectFit: "cover",
                      transition: "transform .7s ease",
                    }}
                  />
                </motion.div>

                {/* CONTENT */}
                <motion.div
                  className="investContent"
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
                    className="investTitle"
                    style={{
                      marginTop: "28px",
                      marginBottom: 0,
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
                    className="investDescription"
                    style={{
                      marginTop: "28px",
                      color: "#4b5563",
                    }}
                  >
                    {item.description}
                  </p>

                  {/* IMPACT CARD */}
                  <div
                    className="impactCard"
                    style={{
                      marginTop: "36px",
                      borderRadius: "28px",
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
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
                    href={item.link}
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
                      boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
                      transition: "all .3s ease",
                    }}
                  >
                    Explore Investment Opportunities
                  </Link>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* SWIPER CUSTOM STYLE */}
      <style jsx global>{`
        .investSlide {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 48px;
        }

        .investImage {
          height: 520px;
        }

        .investTitle {
          font-size: 52px;
        }

        .investDescription {
          font-size: 17px;
          line-height: 1.9;
        }

        .impactCard {
          padding: 28px;
        }

        .sectionTitle {
          font-size: 64px;
        }

        @media (max-width: 1024px) {
          .investSlide {
            gap: 32px;
          }

          .investImage {
            height: 420px;
          }

          .investTitle {
            font-size: 42px;
          }

          .sectionTitle {
            font-size: 44px;
          }
        }

        @media (max-width: 768px) {
          .investSlide {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .investImage {
            height: 280px;
            order: 1;
          }

          .investContent {
            order: 2;
          }

          .investTitle {
            font-size: 34px;
          }

          .investDescription {
            font-size: 16px;
            line-height: 1.7;
          }

          .impactCard {
            padding: 20px;
          }

          .sectionTitle {
            font-size: 32px;
            line-height: 1.2;
          }

          .whyInvestSwiper .swiper-button-prev,
          .whyInvestSwiper .swiper-button-next {
            display: none;
          }
        }

        .whyInvestSwiper {
          overflow: hidden;
        }

        .whyInvestSwiper .swiper-pagination {
          position: relative;
          margin-top: 42px;
        }

        .whyInvestSwiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          opacity: 1;
          background: #d1d5db;
          transition: all 0.3s ease;
        }

        .whyInvestSwiper .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 999px;
          background: #16a34a;
        }

        .whyInvestSwiper .swiper-button-prev,
        .whyInvestSwiper .swiper-button-next {
          width: auto;
          height: auto;

          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 0;

          transition: all 0.25s ease;
        }

        .whyInvestSwiper .swiper-button-prev:hover,
        .whyInvestSwiper .swiper-button-next:hover {
          transform: scale(1.1);
        }

        .whyInvestSwiper .swiper-button-prev,
        .whyInvestSwiper .swiper-button-next {
          transform: scale(1.8);
          color: #16a34a !important;
        }
      `}</style>
    </section>
  );
}
