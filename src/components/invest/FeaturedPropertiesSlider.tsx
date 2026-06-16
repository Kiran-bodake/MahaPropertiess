// components/invest/FeaturedPropertiesSlider.tsx

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import HomePropertyCard from "@/components/property/HomePropertyCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedPropertiesSlider({
  properties,
}: {
  properties: any[];
}) {
  return (
    <>
      <Swiper
        className="hotLocalitiesSwiper"
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={16}
        slidesPerGroup={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
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
                  ? `${property.locality}, ${property.city || ""}`
                  : property.city || "",

                area: property.area
                  ? `${property.area.toLocaleString()} ${property.areaUnit || ""}`
                  : "-",

                rera: property.isRERA,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
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
          width: 28px !important;
          height: 28px !important;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .hotLocalitiesSwiper .swiper-button-prev::after,
        .hotLocalitiesSwiper .swiper-button-next::after {
          font-size: 10px;
          font-weight: 900;
          color: #16a34a;
        }
      `}</style>
    </>
  );
}
