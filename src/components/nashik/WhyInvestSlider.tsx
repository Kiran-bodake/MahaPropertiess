"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { motion } from "framer-motion";

import { investmentReasons } from "@/data/nashikData";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function WhyInvestSlider() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#fcfffd] via-[#f3faf5] to-[#fcfffd] py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
            Why Invest In Nashik
          </p>

          <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.03em] text-gray-900 md:text-6xl">
            A rapidly growing investment destination powered by tourism,
            industry, education, and infrastructure.
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          spaceBetween={30}
        >
          {investmentReasons.map((item) => (
            <SwiperSlide key={item.title}>
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-[420px] overflow-hidden rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] md:h-[580px]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
                    {item.stat}
                  </div>

                  <h3 className="mt-6 text-4xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900">
                      Investment Impact
                    </h4>

                    <p className="mt-2 text-gray-600">{item.impact}</p>
                  </div>

                  <button className="mt-8 rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/30 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700">
                    Explore Investment Opportunities
                  </button>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
