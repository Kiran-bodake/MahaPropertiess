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
          ) =>
            x !==
            propertyId
        );

      setSaved(false);

    }

    else{

      updated = [
        ...old,
        propertyId
      ];

      setSaved(true);

    }

    localStorage.setItem(
      key,
      JSON.stringify(
        updated
      )
    );

  }

  async function handleShare(){

    await navigator.clipboard
      .writeText(
        window.location.href
      );

    alert(
      "Link copied"
    );

  }

  async function handleReport(){

    const reason =
      prompt(
        "Why are you reporting this property?"
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

  return (

    <div
      style={{
        display:"flex",
        flexWrap:"wrap",
        gap:10
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

  return (

    <button
      onClick={
        onClick
      }
      style={{
        padding:
          "8px 14px",

        border:"none",

        borderRadius:
          10,

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