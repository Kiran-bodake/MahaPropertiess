"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({
  images,
  title
}:{
  images:string[];
  title:string;
}){

  const [active,setActive] =
    useState(0);

  /* DEFAULT IMAGE */
  const safeImages =
    images?.length
      ? images
      : [
          "/maha.png"
        ];

  function nextImage(){

    setActive(
      (
        prev
      )=>
        prev === safeImages.length - 1
          ? 0
          : prev + 1
    );

  }

  function prevImage(){

    setActive(
      (
        prev
      )=>
        prev === 0
          ? safeImages.length - 1
          : prev - 1
    );

  }

  return (

    <div>

      {/* MAIN IMAGE */}
      <div
        style={{
          position:"relative",

          width:"100%",

          height:
            "clamp(260px,45vw,520px)",

          overflow:"hidden",

          borderRadius:
            "16px 16px 0 0"
        }}
      >

        <Image
          src={
            safeImages[
              active
            ]
          }

          alt={
            title
          }

          fill

          priority

          style={{
            objectFit:"cover"
          }}
        />

        {/* PREV */}
        {safeImages.length > 1 && (

          <button
            onClick={
              prevImage
            }

            style={{
              position:"absolute",

              left:12,

              top:"50%",

              transform:
                "translateY(-50%)",

              width:38,

              height:38,

              border:"none",

              borderRadius:"50%",

              cursor:"pointer",

              fontSize:"16px",

              background:
                "rgba(255,255,255,.92)",

              zIndex:10
            }}
          >
            ←
          </button>

        )}

        {/* NEXT */}
        {safeImages.length > 1 && (

          <button
            onClick={
              nextImage
            }

            style={{
              position:"absolute",

              right:12,

              top:"50%",

              transform:
                "translateY(-50%)",

              width:38,

              height:38,

              border:"none",

              borderRadius:"50%",

              cursor:"pointer",

              fontSize:"16px",

              background:
                "rgba(255,255,255,.92)",

              zIndex:10
            }}
          >
            →
          </button>

        )}

        {/* IMAGE COUNT */}
        <div
          style={{
            position:"absolute",

            right:12,

            bottom:12,

            background:
              "rgba(0,0,0,.6)",

            color:"#fff",

            padding:
              "5px 10px",

            borderRadius:999,

            fontSize:".8rem",

            zIndex:10
          }}
        >
          {active + 1} / {
            safeImages.length
          }
        </div>

      </div>

      {/* THUMBNAILS */}
      {safeImages.length > 1 && (

        <div
          style={{
            display:"flex",

            gap:8,

            padding:
              "12px",

            background:"#fff",

            overflowX:"auto",

            scrollbarWidth:
              "none",

            msOverflowStyle:
              "none"
          }}
        >

          {safeImages.map(
            (
              img,
              index
            )=>(
              <div
                key={index}

                onClick={()=>
                  setActive(
                    index
                  )
                }

                style={{
                  position:"relative",

                  minWidth:72,

                  width:72,

                  height:54,

                  borderRadius:10,

                  overflow:"hidden",

                  cursor:"pointer",

                  flexShrink:0,

                  border:
                    active === index
                      ? "2px solid #16a34a"
                      : "1px solid #e2e8f0"
                }}
              >

                <Image
                  src={img}

                  alt={title}

                  fill

                  style={{
                    objectFit:"cover"
                  }}
                />

              </div>
            )
          )}

        </div>

      )}

    </div>

  );

}