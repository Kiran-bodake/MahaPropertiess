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
    <section className="overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* HEADER */}
        <div className="mb-16 max-w-4xl md:mb-20 lg:mb-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Why Invest In Nashik
          </p>

          <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 md:text-6xl">
            A rapidly growing investment destination powered by tourism,
            industry, education, and infrastructure.
          </h2>
        </div>

        {/* SLIDER */}
        <Swiper
          className="whyInvestSwiper overflow-hidden"
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={30}
        >
          {investmentReasons.map((item) => (
            <SwiperSlide key={item.title}>
              <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] xl:gap-12">
                {/* IMAGE */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-[320px] overflow-hidden rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] md:h-[520px]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                </motion.div>

                {/* CONTENT */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pr-1 md:pr-8"
                >
                  <div className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
                    {item.stat}
                  </div>

                  <h3 className="mt-6 text-4xl font-black leading-tight tracking-[-0.03em] text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    {item.description}
                  </p>

                  {/* IMPACT CARD */}
                  <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                    <h4 className="text-lg font-bold text-gray-900">
                      Investment Impact
                    </h4>

                    <p className="mt-3 leading-8 text-gray-600">
                      {item.impact}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/properties"
                    className="
mt-10
inline-flex
h-14
items-center
justify-center
rounded-2xl
bg-green-600
px-8
font-semibold
text-white
shadow-[0_15px_40px_rgba(0,0,0,0.05)]
transition-all
duration-300
hover:-translate-y-1
hover:bg-green-700
"
                  >
                    Explore Investment Opportunities
                  </Link>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* SWIPER CUSTOM STYLES */}
      <style jsx global>{`
        .whyInvestSwiper {
          padding-left: 0;
          padding-right: 0;
        }

        .whyInvestSwiper .swiper {
          overflow: hidden;
        }

        .whyInvestSwiper .swiper-button-prev,
        .whyInvestSwiper .swiper-button-next {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }

        .whyInvestSwiper .swiper-button-prev:hover,
        .whyInvestSwiper .swiper-button-next:hover {
          transform: translateY(-2px);
          background: white;
        }

        .whyInvestSwiper .swiper-button-prev::after,
        .whyInvestSwiper .swiper-button-next::after {
          font-size: 18px;
          font-weight: 800;
          color: #16a34a;
        }

        .whyInvestSwiper .swiper-button-prev {
          left: 12px;
        }

        .whyInvestSwiper .swiper-button-next {
          right: 12px;
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

        @media (max-width: 1024px) {
          .whyInvestSwiper {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        @media (max-width: 768px) {
          .whyInvestSwiper {
            padding-left: 16px;
            padding-right: 16px;
          }

          .whyInvestSwiper .swiper-button-prev,
          .whyInvestSwiper .swiper-button-next {
            width: 46px;
            height: 46px;
          }

          .whyInvestSwiper .swiper-button-prev::after,
          .whyInvestSwiper .swiper-button-next::after {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
}
