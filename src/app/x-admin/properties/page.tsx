"use client";

import { useEffect, useState } from "react";

type Property = {
  _id: string;
  propertyId?: string;
  title: string;
  description?: string;
  category?: string;
  status: string;
  approvalStatus?: string;
  premium?: boolean;
  price?: number;
  city?: string;
  state?: string;
  locality?: string;
  agentName?: string;
  agentPhone?: string;
  createdAt?: string;
  image?: string;
  images?: string[];
};

export default function PropertiesPage() {

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState<"all"|"pending"|"approved"|"rejected">(
      "pending"
    );

  const [mine, setMine] = useState(false);

  const [showGallery,setShowGallery] =
    useState(false);

  const [activeImage,setActiveImage] =
    useState(0);

  const [

    galleryImages,

    setGalleryImages

  ] = useState<string[]>([]);



  async function loadProperties() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/properties?approval=${filter}&mine=${mine}`
      );
      const data = await res.json();
      setProperties(data.properties ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, [filter, mine]);




  const approveProperty =
    async (id: string) => {
    if (!confirm("Approve this property?")) return;
    try {
      const res = await fetch("/api/admin/properties/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        // reload list to reflect new state
        await loadProperties();
      }
    } catch (error) {
      console.error(error);
    }
    };




  const rejectProperty =
    async (id: string) => {
    if (!confirm("Reject this property?")) return;
    try {
      const res = await fetch("/api/admin/properties/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        await loadProperties();
      }
    } catch (error) {
      console.error(error);
    }
    };




  function formatPrice(

    price:number

  ){

    return `₹ ${

      Number(

        price || 0

      ).toLocaleString(

        "en-IN"

      )

    }`;

  }




  const navBtnLeft:any = {

    position:"absolute",

    left:20,

    top:"50%",

    transform:"translateY(-50%)",

    width:60,

    height:60,

    borderRadius:"50%",

    border:"none",

    fontSize:36,

    background:"#fff",

    cursor:"pointer"

  };



  const navBtnRight:any = {

    position:"absolute",

    right:20,

    top:"50%",

    transform:"translateY(-50%)",

    width:60,

    height:60,

    borderRadius:"50%",

    border:"none",

    fontSize:36,

    background:"#fff",

    cursor:"pointer"

  };




  return (

    <section
      style={{

        minHeight: "100vh",

        background: "#f8fafc",

        padding: "24px"

      }}
    >

      {/* Header */}
      <div
        style={{

          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom:
            "24px"

        }}
      >

        <div>

          <h1
            style={{

              fontSize: "28px",

              fontWeight: 800,

              margin: 0

            }}
          >

            Property Approval Panel

          </h1>

          <p
            style={{

              color: "#64748b",

              marginTop: "6px"

            }}
          >

            Review submitted properties

          </p>

        </div>



        <button

          onClick={() =>

            window.location.href =

              "/x-admin/post-property"

          }

          style={{

            background:
              "#16a34a",

            color:
              "#fff",

            border:
              "none",

            padding:
              "12px 18px",

            borderRadius:
              "12px",

            fontWeight:
              700,

            cursor:
              "pointer"

          }}

        >

          + Post Property

        </button>

      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setFilter("pending")} style={{ padding: "8px 12px", borderRadius: 10, border: filter === "pending" ? "2px solid #0f172a" : "1px solid #e2e8f0", background: filter === "pending" ? "#0f172a" : "#fff", color: filter === "pending" ? "#fff" : "#0f172a", cursor: "pointer", fontWeight: 700 }}>Pending</button>
          <button onClick={() => setFilter("approved")} style={{ padding: "8px 12px", borderRadius: 10, border: filter === "approved" ? "2px solid #16a34a" : "1px solid #e2e8f0", background: filter === "approved" ? "#16a34a" : "#fff", color: filter === "approved" ? "#fff" : "#0f172a", cursor: "pointer", fontWeight: 700 }}>Approved</button>
          <button onClick={() => setFilter("rejected")} style={{ padding: "8px 12px", borderRadius: 10, border: filter === "rejected" ? "2px solid #dc2626" : "1px solid #e2e8f0", background: filter === "rejected" ? "#dc2626" : "#fff", color: filter === "rejected" ? "#fff" : "#0f172a", cursor: "pointer", fontWeight: 700 }}>Rejected</button>
          <button onClick={() => setFilter("all")} style={{ padding: "8px 12px", borderRadius: 10, border: filter === "all" ? "2px solid #64748b" : "1px solid #e2e8f0", background: filter === "all" ? "#64748b" : "#fff", color: filter === "all" ? "#fff" : "#0f172a", cursor: "pointer", fontWeight: 700 }}>All</button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", color: "#475569", fontWeight: 600 }}>
            <input type="checkbox" checked={mine} onChange={() => setMine(prev => !prev)} />
            My Properties
          </label>
        </div>
      </div>




      {loading ? (

        <p>
          Loading...
        </p>

      ) : (

        <div
          style={{

            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fill,minmax(330px,1fr))",

            gap:
              "18px"

          }}
        >

          {properties.map(

            (
              property
            ) => (

              <div

                key={
                  property._id
                }

                style={{

                  background:
                    "#fff",

                  borderRadius:
                    "16px",

                  overflow:
                    "hidden",

                  border:
                    "1px solid #e2e8f0",

                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.06)"

                }}

              >

                {/* IMAGE */}
                <div
                  style={{

                    height:
                      "180px",

                    position:
                      "relative"

                  }}
                >

                  <img

                    onClick={() => {

                      setGalleryImages(

                        property.images?.length

                          ?

                          property.images

                          :

                          [

                            property.image ||

                            "/maha.png"

                          ]

                      );

                      setActiveImage(0);

                      setShowGallery(true);

                    }}

                    src={

                      property.image ||

                      "/maha.png"

                    }

                    alt={
                      property.title
                    }

                    style={{

                      width:
                        "100%",

                      height:
                        "100%",

                      objectFit:
                        "cover",

                      cursor:
                        "pointer"

                    }}
                  />

                </div>




                {/* CONTENT */}
                <div
                  style={{

                    padding:
                      "16px"

                  }}
                >

                  <h2
                    style={{

                      fontSize:
                        "18px",

                      margin:
                        "0 0 10px",

                      fontWeight:
                        800

                    }}
                  >

                    {
                      property.title
                    }

                  </h2>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{property.category || "-"}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ padding: "6px 10px", borderRadius: 999, fontWeight: 700, fontSize: 12, background: property.approvalStatus === "approved" ? "#dcfce7" : property.approvalStatus === "rejected" ? "#fee2e2" : "#e2e8f0", color: property.approvalStatus === "approved" ? "#166534" : property.approvalStatus === "rejected" ? "#991b1b" : "#0f172a" }}>{property.approvalStatus || "pending"}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{property.createdAt ? new Date(property.createdAt).toLocaleDateString("en-IN") : "-"}</div>
                      </div>
                    </div>




                  <div
                    style={{

                      display:
                        "grid",

                      gap:
                        "6px",

                      fontSize:
                        "13px",

                      color:
                        "#475569"

                    }}
                  >

                    <div>

                      💰 {

                        formatPrice(

                          property.price || 0

                        )

                      }

                    </div>


                    <div>

                      📍

                      {
                        property.city
                      },

                      {" "}

                      {
                        property.state
                      }

                    </div>


                    <div>

                      👤

                      {
                        property.agentName
                      }

                    </div>


                    <div>

                      📞

                      {
                        property.agentPhone
                      }

                    </div>

                  </div>




                  {/* BUTTONS */}
                  <div
                    style={{

                      display:
                        "grid",

                      gap:
                        "10px",

                      marginTop:
                        "18px"

                    }}
                  >

                    <button

                      onClick={() =>

                        window.location.href =

                          `/x-admin/properties/${property._id}`

                      }

                      style={{

                        height:
                          "42px",

                        background:
                          "#0f172a",

                        color:
                          "#fff",

                        border:
                          "none",

                        borderRadius:
                          "10px",

                        fontWeight:
                          700,

                        cursor:
                          "pointer"

                      }}

                    >

                      View Details

                    </button>




                    <div
                      style={{

                        display:
                          "flex",

                        gap:
                          "10px"

                      }}
                    >

                      <button

                        onClick={() =>

                          approveProperty(
                            property._id
                          )

                        }

                        style={{

                          flex:
                            1,

                          height:
                            "42px",

                          background:
                            "#16a34a",

                          color:
                            "#fff",

                          border:
                            "none",

                          borderRadius:
                            "10px",

                          cursor:
                            "pointer"

                        }}

                      >

                        Approve

                      </button>




                      <button

                        onClick={() =>

                          rejectProperty(
                            property._id
                          )

                        }

                        style={{

                          flex:
                            1,

                          height:
                            "42px",

                          background:
                            "#dc2626",

                          color:
                            "#fff",

                          border:
                            "none",

                          borderRadius:
                            "10px",

                          cursor:
                            "pointer"

                        }}

                      >

                        Reject

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )

          )}

        </div>

      )}




      {/* FULLSCREEN GALLERY */}
      {

        showGallery && (

          <div
            style={{

              position:"fixed",

              inset:0,

              background:
                "rgba(0,0,0,.92)",

              zIndex:9999,

              display:"flex",

              alignItems:"center",

              justifyContent:"center",

              flexDirection:"column"

            }}
          >

            {/* CLOSE */}
            <button

              onClick={() =>

                setShowGallery(false)

              }

              style={{

                position:"absolute",

                top:20,

                right:20,

                width:46,

                height:46,

                borderRadius:"50%",

                border:"none",

                background:"#fff",

                fontSize:20,

                cursor:"pointer",

                fontWeight:700

              }}

            >

              ✕

            </button>




            {/* MAIN IMAGE */}
            <img

              src={

                galleryImages[activeImage]

              }

              style={{

                width:"90%",

                maxWidth:"1200px",

                maxHeight:"80vh",

                objectFit:"contain",

                borderRadius:"16px"

              }}

            />




            {/* NAVIGATION */}
            {

              galleryImages.length > 1 && (

                <>

                  {/* PREV */}
                  <button

                    onClick={() =>

                      setActiveImage(

                        prev =>

                          prev === 0

                          ?

                          galleryImages.length - 1

                          :

                          prev - 1

                      )

                    }

                    style={navBtnLeft}

                  >

                    ‹

                  </button>




                  {/* NEXT */}
                  <button

                    onClick={() =>

                      setActiveImage(

                        prev =>

                          prev ===

                          galleryImages.length - 1

                          ?

                          0

                          :

                          prev + 1

                      )

                    }

                    style={navBtnRight}

                  >

                    ›

                  </button>

                </>

              )

            }

          </div>

        )

      }

    </section>

  );

}