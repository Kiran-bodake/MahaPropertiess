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
};

export default function PropertiesPage() {

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    (async () => {

      try {

        const res =
          await fetch(
            "/api/admin/properties"
          );

        const data =
          await res.json();

        setProperties(
          data.properties ?? []
        );

      }

      catch (error) {

        console.error(error);

      }

      finally {

        setLoading(false);

      }

    })();

  }, []);


  const approveProperty =
    async (id: string) => {

      try {

        const res =
          await fetch(

            "/api/admin/properties/approve",

            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body: JSON.stringify({
                id
              })

            }

          );

        const data =
          await res.json();

        if (data.success) {

          setProperties(

            prev =>

              prev.filter(

                item =>

                  item._id !== id

              )

          );

        }

      }

      catch (error) {

        console.error(error);

      }

    };


  const rejectProperty =
    async (id: string) => {

      try {

        const res =
          await fetch(

            "/api/admin/properties/reject",

            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body: JSON.stringify({
                id
              })

            }

          );

        const data =
          await res.json();

        if (data.success) {

          setProperties(

            prev =>

              prev.filter(

                item =>

                  item._id !== id

              )

          );

        }

      }

      catch (error) {

        console.error(error);

      }

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

                {/* Image */}
                <div
                  style={{

                    height:
                      "180px",

                    position:
                      "relative"

                  }}
                >

                  <img
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
                        "cover"

                    }}
                  />

                </div>


                {/* Content */}
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
                      💰 ₹
                      {
                        property.price || 0
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


                  {/* Buttons */}
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
                          700

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
                            "10px"

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
                            "10px"

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

    </section>

  );

}