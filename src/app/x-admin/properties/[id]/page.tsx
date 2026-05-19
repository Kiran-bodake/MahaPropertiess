"use client";

import { use, useEffect, useState } from "react";

type Property = any;

export default function AdminPropertyDetails({ params }: any) {

  const resolvedParams =
    use(
      params as Promise<{
        id: string
      }>
    );

  const propertyId =
    resolvedParams.id;

  const [
    property,
    setProperty
  ] = useState<Property | null>(null);

  const [
    formData,
    setFormData
  ] = useState<any>(null);

  const [
    editing,
    setEditing
  ] = useState(false);

  const [
    saving,
    setSaving
  ] = useState(false);


  useEffect(() => {

    const fetchProperty =
      async () => {

        try {

          const res =
            await fetch(
              `/api/admin/properties/${propertyId}`
            );

          const data =
            await res.json();

          setProperty(
            data.property
          );

          setFormData(
            data.property
          );

        }

        catch (error) {

          console.error(error);

        }

      };

    if (propertyId) {

      fetchProperty();

    }

  }, [propertyId]);


  const updateField = (
    field: string,
    value: any
  ) => {

    setFormData(
      (prev: any) => ({

        ...prev,

        [field]: value

      })
    );

  };


  const saveChanges =
    async () => {

      try {

        setSaving(true);

        const res =
          await fetch(
            `/api/admin/properties/${propertyId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  formData
                )
            }
          );

        const data =
          await res.json();

        setProperty(
          data.property
        );

        setFormData(
          data.property
        );

        setEditing(false);

      }

      catch (error) {

        console.error(error);

      }

      finally {

        setSaving(false);

      }

    };


  const approveProperty =
    async () => {

      await fetch(
        "/api/admin/properties/approve",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            id: propertyId
          })
        }
      );

      window.location.href =
        "/x-admin/properties";

    };


  const rejectProperty =
    async () => {

      await fetch(
        "/api/admin/properties/reject",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            id: propertyId
          })
        }
      );

      window.location.href =
        "/x-admin/properties";

    };


  if (!property) {

    return (

      <div
        style={{
          padding: 60,
          textAlign: "center"
        }}
      >

        Loading Property...

      </div>

    );

  }


  return (

    <section
      style={{

        minHeight: "100vh",

        background: "#f8fafc",

        padding: "24px"

      }}
    >

      <div
        style={{

          maxWidth: "980px",

          margin: "0 auto",

          background: "#fff",

          borderRadius: 20,

          overflow: "hidden",

          boxShadow:
            "0 8px 30px rgba(0,0,0,.06)"

        }}
      >

        {/* IMAGE */}
        <div
          style={{
            height: 320
          }}
        >

          <img
            src={

              property.images?.[0] ||

              property.image ||

              "/maha.png"

            }
            alt={property.title}
            style={{

              width: "100%",

              height: "100%",

              objectFit: "cover"

            }}
          />

        </div>


        {/* CONTENT */}
        <div
          style={{
            padding: 24
          }}
        >

          <h1
            style={{

              margin: 0,

              fontSize: 30,

              fontWeight: 800

            }}
          >

            {property.title}

          </h1>


          <p
            style={{

              marginTop: 8,

              color: "#64748b"

            }}
          >

            📍 {

              property.locality || "--"

            }, {

              property.city || "--"

            }, {

              property.state || "--"

            }

          </p>


          {/* DETAILS */}
          <div
            style={{

              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",

              gap: 14,

              marginTop: 24

            }}
          >

            <InfoCard
              label="Property ID"
              value={
                property.propertyId
              }
            />

            <AdminField
              label="Category"
              field="category"
              value={
                formData?.category
              }
              editing={editing}
              onChange={updateField}
            />

            <AdminField
              label="Price"
              field="price"
              value={
                formData?.price
              }
              editing={editing}
              onChange={updateField}
            />

            <AdminField
              label="Area"
              field="area"
              value={
                formData?.area
              }
              editing={editing}
              onChange={updateField}
            />

            <AdminField
              label="Posted By"
              field="postedBy"
              value={
                formData?.postedBy
              }
              editing={editing}
              onChange={updateField}
            />

            <AdminField
              label="Agent Name"
              field="agentName"
              value={
                formData?.agentName
              }
              editing={editing}
              onChange={updateField}
            />

            <AdminField
              label="Agent Phone"
              field="agentPhone"
              value={
                formData?.agentPhone
              }
              editing={editing}
              onChange={updateField}
            />

            <AdminField
              label="Status"
              field="status"
              value={
                formData?.status
              }
              editing={editing}
              onChange={updateField}
            />

            <InfoCard
              label="RERA"
              value={
                property.isRERA
                  ? "Yes"
                  : "No"
              }
            />

            <InfoCard
              label="Featured"
              value={
                property.isFeatured
                  ? "Yes"
                  : "No"
              }
            />

            <InfoCard
              label="Zero Brokerage"
              value={
                property.isZeroBrokerage
                  ? "Yes"
                  : "No"
              }
            />

          </div>


          {/* DESCRIPTION */}
          <h2
            style={{
              marginTop: 30
            }}
          >

            Description

          </h2>

          <p
            style={{
              color: "#475569"
            }}
          >

            {

              property.description ||

              "No description"

            }

          </p>


          {/* BUTTONS */}
          <div
            style={{

              display: "flex",

              gap: 12,

              marginTop: 30,

              flexWrap: "wrap"

            }}
          >

            <ActionButton
              bg="#2563eb"
              onClick={() =>
                setEditing(
                  !editing
                )
              }
            >

              {

                editing

                  ?

                  "Cancel Edit"

                  :

                  "Edit"

              }

            </ActionButton>


            {

              editing && (

                <ActionButton
                  bg="#0f766e"
                  onClick={
                    saveChanges
                  }
                >

                  {

                    saving

                      ?

                      "Saving..."

                      :

                      "Save"

                  }

                </ActionButton>

              )

            }


            <ActionButton
              bg="#16a34a"
              onClick={
                approveProperty
              }
            >

              Approve

            </ActionButton>


            <ActionButton
              bg="#dc2626"
              onClick={
                rejectProperty
              }
            >

              Reject

            </ActionButton>

          </div>

        </div>

      </div>

    </section>

  );

}


function ActionButton({

  children,

  bg,

  onClick

}: any){

  return (

    <button
      onClick={onClick}
      style={{

        flex: 1,

        minWidth: 160,

        height: 48,

        border: "none",

        borderRadius: 14,

        background: bg,

        color: "#fff",

        fontWeight: 700,

        cursor: "pointer"

      }}
    >

      {children}

    </button>

  );

}


function AdminField({

  label,

  field,

  value,

  editing,

  onChange

}: any){

  return (

    <div
      style={{

        background: "#f8fafc",

        border:
          "1px solid #e2e8f0",

        borderRadius: 14,

        padding: 14

      }}
    >

      {

        editing

          ?

          <input
            value={
              value || ""
            }
            onChange={(e)=>

              onChange(
                field,
                e.target.value
              )

            }
            style={{

              width: "100%",

              height: 40,

              border:
                "1px solid #cbd5e1",

              borderRadius: 10,

              padding:
                "0 12px"

            }}
          />

          :

          <div
            style={{

              fontWeight: 700,

              fontSize: 16

            }}
          >

            {

              value || "--"

            }

          </div>

      }

      <div
        style={{

          marginTop: 8,

          fontSize: 13,

          color: "#64748b"

        }}
      >

        {label}

      </div>

    </div>

  );

}


function InfoCard({

  label,

  value

}: any){

  return (

    <div
      style={{

        background: "#f8fafc",

        border:
          "1px solid #e2e8f0",

        borderRadius: 14,

        padding: 14

      }}
    >

      <div
        style={{

          fontWeight: 700,

          fontSize: 16

        }}
      >

        {

          value || "--"

        }

      </div>

      <div
        style={{

          marginTop: 8,

          fontSize: 13,

          color: "#64748b"

        }}
      >

        {label}

      </div>

    </div>

  );

}