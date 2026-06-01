"use client";

import {
  useEffect,
  useState
}
from "react";


export function PropertyActions({

  propertyMongoId,

  propertyId,

  propertyTitle

}:{

  propertyMongoId:string;

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

  const [reporting,setReporting] =
    useState(false);
const [user,setUser] =
  useState<any>(null);

  const [showSuccess, setShowSuccess] = useState(false);

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

            x !== propertyId

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

useEffect(() => {

  const savedUser =

    localStorage.getItem(
      "user"
    );

  if(savedUser){

    setUser(

      JSON.parse(savedUser)

    );

  }

},[]);

  /* REPORT PROPERTY */
  async function handleReport(){

    // VALIDATION
    if(

      !reportReason.trim()

    ){

      alert(
        "Please explain the issue"
      );

      return;

    }

    try{

      setReporting(true);

      console.log({

        propertyMongoId,

        propertyId,

        propertyTitle,

        reason:
          reportReason

      });

      const res =
        await fetch(

          "/api/property-report",

          {

            method:"POST",

            headers:{

              "Content-Type":
                "application/json"

            },

          body:JSON.stringify({

  propertyMongoId,

  propertyId,

  propertyTitle,

  reason:
    reportReason,

  reportedByUserId:
    user?._id || "",

  reportedByName:
    user?.name || "",

  reportedByPhone:
    user?.phone || ""

})
          }

        );

      const data =
        await res.json();
if(data.success){

  setShowReport(false);

  setReportReason("");

  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
  }, 3500);

}
      else{

       console.error(data.message);

      }

    }

    catch(error){

      console.error(error);

      console.error("Something went wrong");

    }

    finally{

      setReporting(false);

    }

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

                alert(
                  "Link copied"
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
                fontSize:".92rem",
                lineHeight:1.5
              }}
            >
              Please explain the issue
              with this property listing.
            </p>


            <textarea

              value={reportReason}

              onChange={(e) =>
                setReportReason(
                  e.target.value
                )
              }

              placeholder="Explain the issue with this property..."

              style={{

                minHeight:140,

                borderRadius:16,

                border:
                  "1px solid #e2e8f0",

                padding:16,

                resize:"none",

                outline:"none",

                fontFamily:"inherit",

                fontSize:14,

                lineHeight:1.6,

                background:"#f8fafc"

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

                disabled={reporting}

                style={{

                  flex:1,

                  height:48,

                  border:"none",

                  borderRadius:12,

                  background:"#dc2626",

                  color:"#fff",

                  cursor:"pointer",

                  fontWeight:700,

                  opacity:

                    reporting

                      ? .7

                      : 1

                }}

              >
                {

                  reporting

                    ? "Submitting..."

                    : "Submit Report"

                }
              </button>

            </div>

          </div>

        </div>

      )}
      {/* SUCCESS MODAL */}
{showSuccess && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      backdropFilter: "blur(6px)",
    }}
  >

    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        borderRadius: "28px",
        padding: "32px",
        textAlign: "center",
        boxShadow:
          "0 30px 80px rgba(15,23,42,.25)",
        animation:
          "successPop .35s ease-out",
      }}
    >

      <div
        style={{
          width: "90px",
          height: "90px",
          margin: "0 auto 18px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,#22c55e,#16a34a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "42px",
          fontWeight: 800,
        }}
      >
        ✓
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: 800,
          color: "#111827",
        }}
      >
        Report Submitted
      </h2>

      <p
        style={{
          marginTop: "12px",
          color: "#6b7280",
          lineHeight: 1.7,
          fontSize: "14px",
        }}
      >
        Thank you for helping improve
        MahaProperties.
        <br />
        Our moderation team will review
        this property shortly.
      </p>

      <button
        onClick={() =>
          setShowSuccess(false)
        }
        style={{
          marginTop: "22px",
          height: "48px",
          padding: "0 24px",
          border: "none",
          borderRadius: "14px",
          background: "#16a34a",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Done
      </button>

    </div>

  </div>

)}
  {/* ANIMATION */}
    <style jsx global>{`
      @keyframes successPop {
        from {
          opacity: 0;
          transform: scale(.85) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `}</style>


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

  maxWidth:420,

  background:"#fff",

  borderRadius:24,

  padding:24,

  display:"flex",

  flexDirection:"column",

  gap:14,

  boxShadow:
    "0 20px 50px rgba(0,0,0,.18)"

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