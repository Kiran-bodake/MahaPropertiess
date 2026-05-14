"use client";

import { useState } from "react";

export function PropertyActions({
  propertyId,
  propertyTitle
}:{
  propertyId:string;
  propertyTitle:string;
}){

  const [saved,setSaved] =
    useState(false);

  async function handleShare(){

    const shareUrl =
      window.location.href;

    if(
      navigator.share
    ){

      await navigator.share({
        title:
          propertyTitle,
        url:
          shareUrl
      });

    }

    else{

      await navigator.clipboard
        .writeText(
          shareUrl
        );

      alert(
        "Link copied"
      );

    }

  }

  async function handleReport(){

    const reason =
      prompt(
        "Why are you reporting this property?\n\nExamples:\nFake Listing\nSpam\nWrong Price"
      );

    if(!reason)
      return;

    await fetch(
      "/api/property-report",
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({

            propertyId,

            propertyTitle,

            reason

          })
      }
    );

    alert(
      "Report submitted"
    );

  }

  function handleSave(){

    const key =
      "savedProperties";

    const old =
      JSON.parse(
        localStorage.getItem(
          key
        ) || "[]"
      );

    let updated =
      old;

    if(
      old.includes(
        propertyId
      )
    ){

      updated =
        old.filter(
          (
            x:string
          )=>
            x !==
            propertyId
        );

      setSaved(
        false
      );

    }

    else{

      updated = [
        ...old,
        propertyId
      ];

      setSaved(
        true
      );

    }

    localStorage
      .setItem(
        key,
        JSON.stringify(
          updated
        )
      );

  }

  return (

    <div
      style={{
        display:"flex",
        gap:12,
        marginTop:18
      }}
    >

      <ActionBtn
        label={
          saved
            ? "Saved"
            : "Save"
        }
        onClick={
          handleSave
        }
      />

      <ActionBtn
        label="Share"
        onClick={
          handleShare
        }
      />

      <ActionBtn
        label="Report"
        danger
        onClick={
          handleReport
        }
      />

    </div>

  );

}

function ActionBtn({
  label,
  onClick,
  danger
}:any){

  return(

    <button
      onClick={
        onClick
      }
      style={{
        padding:
          "10px 16px",

        border:"none",

        borderRadius:
          12,

        cursor:
          "pointer",

        background:
          danger
            ? "#fef2f2"
            : "#f8fafc",

        color:
          danger
            ? "#dc2626"
            : "#334155",

        fontWeight:
          600
      }}
    >
      {label}
    </button>

  );

}