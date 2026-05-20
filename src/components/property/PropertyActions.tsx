"use client";

import {
  useEffect,
  useState
} from "react";



export function PropertyActions({
  propertyId,
  propertyTitle
}:{
  propertyId:string;
  propertyTitle:string;
}){

  const [saved,setSaved] =
    useState(false);

  const [showShare,setShowShare] =
    useState(false);

  const [showReport,setShowReport] =
    useState(false);

  const [reportReason,setReportReason] =
    useState("");


  const propertyUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";


  /* CHECK SAVED */
  useEffect(() => {

    const old =
      JSON.parse(
        localStorage.getItem(
          "savedProperties"
        ) || "[]"
      );

    setSaved(
      old.includes(
        propertyId
      )
    );

  }, [propertyId]);


  /* SAVE PROPERTY */
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


  /* REPORT PROPERTY */
  async function handleReport(){

    if(!reportReason){

     

      return;
    }

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

            reason:
              reportReason

          })
      }
    );

   
    setShowReport(false);

    setReportReason("");

  }



  return (

    <>

      {/* ACTION BUTTONS */}
      <div
        style={{
          display:"flex",
          flexWrap:"wrap",
          gap:10
        }}
      >

        {/* SAVE */}
        <ActionBtn
          label={
            saved
              ? "❤️ Saved"
              : "🤍 Save"
          }
          onClick={
            handleSave
          }
        />


        {/* SHARE */}
        <ActionBtn
          label="🔗 Share"
          onClick={() =>
            setShowShare(true)
          }
        />


        {/* REPORT */}
        <ActionBtn
          label="🚩 Report"
          danger
          onClick={() =>
            setShowReport(true)
          }
        />

      </div>



      {/* SHARE MODAL */}
      {showShare && (

        <div style={overlayStyle}>

          <div style={modalStyle}>

            <h3
              style={{
                margin:0,
                marginBottom:8
              }}
            >
              Share Property
            </h3>


            {/* WHATSAPP */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                propertyTitle +
                " " +
                propertyUrl
              )}`}
              target="_blank"
              style={shareBtn}
            >
              WhatsApp
            </a>


            {/* TELEGRAM */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                propertyUrl
              )}&text=${encodeURIComponent(
                propertyTitle
              )}`}
              target="_blank"
              style={shareBtn}
            >
              Telegram
            </a>


            {/* FACEBOOK */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                propertyUrl
              )}`}
              target="_blank"
              style={shareBtn}
            >
              Facebook
            </a>


            {/* COPY LINK */}
            <button
              onClick={() => {

                navigator.clipboard.writeText(
                  propertyUrl
                );

               
              }}
              style={shareBtn}
            >
              Copy Link
            </button>


            {/* MOBILE SHARE */}
            <button
              onClick={async () => {

                if(
                  navigator.share
                ){

                  await navigator.share({

                    title:
                      propertyTitle,

                    text:
                      "Check this property",

                    url:
                      propertyUrl,

                  });

                }

              }}
              style={shareBtn}
            >
              More Options
            </button>


            {/* CLOSE */}
            <button
              onClick={() =>
                setShowShare(false)
              }
              style={closeBtn}
            >
              Close
            </button>

          </div>

        </div>

      )}



      {/* REPORT MODAL */}
      {showReport && (

        <div style={overlayStyle}>

          <div style={modalStyle}>

            <h3
              style={{
                margin:0
              }}
            >
              Report Property
            </h3>


            <p
              style={{
                margin:0,
                color:"#64748b",
                fontSize:".92rem"
              }}
            >
              Tell us why you are
              reporting this property.
            </p>


            <textarea
              value={reportReason}

              onChange={(e) =>
                setReportReason(
                  e.target.value
                )
              }

              placeholder="Enter report reason..."

              style={{
                minHeight:120,
                borderRadius:12,
                border:"1px solid #e5e7eb",
                padding:14,
                resize:"none",
                outline:"none",
                fontFamily:"inherit"
              }}
            />


            <div
              style={{
                display:"flex",
                gap:10
              }}
            >

              {/* CANCEL */}
              <button
                onClick={() =>
                  setShowReport(false)
                }
                style={{
                  flex:1,
                  height:48,
                  borderRadius:12,
                  border:"1px solid #e5e7eb",
                  background:"#fff",
                  cursor:"pointer",
                  fontWeight:700
                }}
              >
                Cancel
              </button>


              {/* SUBMIT */}
              <button
                onClick={
                  handleReport
                }
                style={{
                  flex:1,
                  height:48,
                  border:"none",
                  borderRadius:12,
                  background:"#dc2626",
                  color:"#fff",
                  cursor:"pointer",
                  fontWeight:700
                }}
              >
                Submit Report
              </button>

            </div>

          </div>

        </div>

      )}

    </>

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
          700,

        fontSize:
          ".9rem",

        boxShadow:
          "0 2px 8px rgba(0,0,0,.05)"
      }}
    >
      {label}
    </button>

  );

}



/* COMMON STYLES */

const overlayStyle:
React.CSSProperties = {

  position:"fixed",

  inset:0,

  background:
    "rgba(0,0,0,.45)",

  display:"flex",

  alignItems:"center",

  justifyContent:"center",

  zIndex:9999,

};


const modalStyle:
React.CSSProperties = {

  width:"100%",

  maxWidth:360,

  background:"#fff",

  borderRadius:20,

  padding:24,

  display:"flex",

  flexDirection:"column",

  gap:12,

};


const shareBtn:
React.CSSProperties = {

  height:48,

  borderRadius:12,

  border:
    "1px solid #e5e7eb",

  display:"flex",

  alignItems:"center",

  justifyContent:"center",

  textDecoration:"none",

  color:"#111827",

  fontWeight:700,

  cursor:"pointer",

  background:"#fff",

};


const closeBtn:
React.CSSProperties = {

  marginTop:10,

  height:44,

  border:"none",

  borderRadius:12,

  background:"#111827",

  color:"#fff",

  fontWeight:700,

  cursor:"pointer",

};