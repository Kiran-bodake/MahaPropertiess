"use client";

import {
  use,
  useEffect,
  useState
} from "react";


type Property = any;

export default function AdminPropertyDetails({

  params

}: any){

 const resolvedParams =
  use(
    params as Promise<{ id:string }>
  );
  const propertyId =
    resolvedParams.id;

  const [

    property,

    setProperty

  ] = useState<Property | null>(null);

  const [editing, setEditing] = useState(false);

const [formData, setFormData] = useState<any>(null);

const [saving, setSaving] = useState(false);


  useEffect(() => {

    const fetchProperty =
      async () => {

        try{

          const res =

            await fetch(

              `/api/admin/properties/${propertyId}`

            );

          const data =
            await res.json();

          setProperty(
            data.property
          );


          setFormData(data.property);





        }

        catch(error){

          console.error(
            error
          );

        }

      };

    if(
      propertyId
    ){

      fetchProperty();

    }

  }, [propertyId]);


  const approveProperty =
    async () => {

      await fetch(

        "/api/admin/properties/approve",

        {

          method:"POST",

          headers:{

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            id:
              propertyId

          })

        }

      );

      window.location.href =
        "/x-admin/properties";

    };
const updateField = (
  field: string,
  value: any
) => {
  setFormData((prev: any) => ({
    ...prev,
    [field]: value
  }));
};

const saveChanges =
  async () => {

    try {

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

      alert(
        "Property updated successfully"
      );

    }

    catch(error){

      console.error(error);

    }

}; 


  const rejectProperty =
    async () => {

      await fetch(

        "/api/admin/properties/reject",

        {

          method:"POST",

          headers:{

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            id:
              propertyId

          })

        }

      );

      window.location.href =
        "/x-admin/properties";

    };


  if(
    !property
  ){

    return (

      <div
        style={{

          padding:"60px",

          fontSize:"18px",

          textAlign:"center"

        }}
      >

        Loading Property...

      </div>

    );

  }


  return (

    <section
      style={{

        minHeight:"100vh",

        background:"#f1f5f9",

        padding:"30px"

      }}
    >

      <div
        style={{

          maxWidth:"1400px",

          margin:"0 auto",

          background:"#fff",

          borderRadius:"24px",

          overflow:"hidden",

          boxShadow:
            "0 12px 40px rgba(0,0,0,.08)"

        }}
      >

        {/* IMAGE */}
        <div
          style={{

            position:"relative",

            height:"460px"

          }}
        >

          <img
            src={

              property.images?.[0] ||

              property.image ||

              "/maha.png"

            }

            alt={
              property.title
            }

            style={{

              width:"100%",

              height:"100%",

              objectFit:"cover"

            }}
          />

          <div
            style={{

              position:"absolute",

              top:"20px",

              left:"20px",

              background:"#f59e0b",

              color:"#fff",

              padding:"8px 16px",

              borderRadius:"999px",

              fontWeight:700

            }}
          >

            Pending Review

          </div>

        </div>


        {/* CONTENT */}
        <div
          style={{

            padding:"35px"

          }}
        >

          {/* TITLE */}
          <h1
            style={{

              margin:0,

              fontSize:"36px",

              fontWeight:800,

              color:"#0f172a"

            }}
          >

            {
              property.title
            }

          </h1>


          {/* LOCATION */}
          <p
            style={{

              marginTop:"10px",

              color:"#64748b",

              fontSize:"16px"

            }}
          >

            📍
            {" "}

            {
              property.locality || "--"
            },

            {" "}

            {
              property.city || "--"
            },

            {" "}

            {
              property.state || "--"
            }

          </p>


          {/* PROPERTY DETAILS */}
          <div
            style={{

              display:"grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",

              gap:"16px",

              marginTop:"30px"

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
  value={formData?.category}
  editing={editing}
  onChange={updateField}
/>

           <AdminField
  label="Price"
  field="price"
  value={formData?.price}
  editing={editing}
  onChange={updateField}
/>

          <AdminField
  label="Area"
  field="area"
  value={formData?.area}
  editing={editing}
  onChange={updateField}
/>

           <AdminField
  label="Posted By"
  field="postedBy"
  value={formData?.postedBy}
  editing={editing}
  onChange={updateField}
/>

           <AdminField
  label="Agent Name"
  field="agentName"
  value={formData?.agentName}
  editing={editing}
  onChange={updateField}
/>

           <AdminField
  label="Agent Phone"
  field="agentPhone"
  value={formData?.agentPhone}
  editing={editing}
  onChange={updateField}
/>

           <AdminField
  label="Status"
  field="status"
  value={formData?.status}
  editing={editing}
  onChange={updateField}
/>

          </div>
{/* PROPERTY FEATURES */}

<h2
  style={{

    marginTop:"40px",

    fontSize:"24px",

    fontWeight:800,

    color:"#0f172a"

  }}
>

  Property Features

</h2>


<div
  style={{

    marginTop:"20px",

    display:"grid",

    gap:"14px"

  }}
>

  <InfoCard
    label="Full Address"
    value={

      `${property.houseNo || ""},

       ${property.street || ""},

       ${property.landmark || ""},

       ${property.pincode || ""}`

    }
  />

  <InfoCard
    label="Amenities"
    value={

      property.amenities?.length ?

      property.amenities.join(", ")

      :

      "--"

    }
  />

  <InfoCard
    label="Highlights"
    value={

      property.highlights?.length ?

      property.highlights.join(", ")

      :

      "--"

    }
  />

  <InfoCard
    label="RERA"
    value={

      property.isRERA ?

      "Yes"

      :

      "No"

    }
  />

  <InfoCard
    label="Featured"
    value={

      property.isFeatured ?

      "Yes"

      :

      "No"

    }
  />

  <InfoCard
    label="Zero Brokerage"
    value={

      property.isZeroBrokerage ?

      "Yes"

      :

      "No"

    }
  />

</div>

          {/* DESCRIPTION */}
          <h2
            style={{

              marginTop:"40px",

              fontSize:"24px"

            }}
          >

            Description

          </h2>

          <p
            style={{

              marginTop:"12px",

              color:"#475569",

              lineHeight:1.8,

              fontSize:"15px"

            }}
          >

            {
              property.description ||

              "No description available."
            }

          </p>


     {/* BUTTONS */}
<div
  style={{
    display:"flex",
    gap:"16px",
    marginTop:"45px",
    flexWrap:"wrap"
  }}
>

  <button
    onClick={() =>
      setEditing(!editing)
    }
    style={{
      flex:1,
      height:"56px",
      border:"none",
      borderRadius:"16px",
      background:"#2563eb",
      color:"#fff",
      fontWeight:800,
      cursor:"pointer"
    }}
  >
    {
      editing
        ? "Cancel Edit"
        : "Edit Property"
    }
  </button>


  {
    editing && (

      <button
        onClick={saveChanges}
        style={{
          flex:1,
          height:"56px",
          border:"none",
          borderRadius:"16px",
          background:"#0f766e",
          color:"#fff",
          fontWeight:800,
          cursor:"pointer"
        }}
      >
        Save Changes
      </button>

    )
  }


  <button
    onClick={approveProperty}
    style={{
      flex:1,
      height:"56px",
      border:"none",
      borderRadius:"16px",
      background:"#16a34a",
      color:"#fff",
      fontWeight:800,
      cursor:"pointer"
    }}
  >
    Approve Property
  </button>


  <button
    onClick={rejectProperty}
    style={{
      flex:1,
      height:"56px",
      border:"none",
      borderRadius:"16px",
      background:"#dc2626",
      color:"#fff",
      fontWeight:800,
      cursor:"pointer"
    }}
  >
    Reject Property
  </button>

</div>

        </div>

      </div>

    </section>

  );

}


function AdminField({
  label,
  field,
  value,
  editing,
  onChange
}: any) {

  return (
    <div>

      <label>
        {label}
      </label>

      {
        editing ? (

          <input
            value={value || ""}
            onChange={(e) =>
              onChange(
                field,
                e.target.value
              )
            }
          />

        ) : (

          <div>
            {value || "--"}
          </div>

        )
      }

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

        background:"#f8fafc",

        border:
          "1px solid #e2e8f0",

        borderRadius:"18px",

        padding:"18px"

      }}
    >

      <div
        style={{

          fontWeight:800,

          fontSize:"17px",

          color:"#0f172a"

        }}
      >

        {
          value || "--"
        }

      </div>

      <div
        style={{

          marginTop:"6px",

          color:"#64748b",

          fontSize:"14px"

        }}
      >

        {
          label
        }

      </div>

    </div>

  );

}