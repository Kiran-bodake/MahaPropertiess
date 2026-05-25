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

const [
  amenityInput,
  setAmenityInput
] = useState("");

const [
  featureInput,
  setFeatureInput
] = useState("");

const [
  showGallery,
  setShowGallery
] = useState(false);

const [
  activeImage,
  setActiveImage
] = useState(0);
useEffect(() => {

  if (

    activeImage >=

    (formData?.images?.length || 0)

  ) {

    setActiveImage(0);

  }

}, [

  formData?.images,

  activeImage

]);
const [
  uploadingImage,
  setUploadingImage
] = useState(false);

 const categoryOptions = [

  "Residential",

  "Commercial",

  "Agriculture",

  "Plot",

  "Villa",

  "Apartment",

  "Office",

  "Shop",

  "Warehouse",

  "Industrial",

  "Farm House"

];


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

  const uploadImage = async (
  file: File
) => {

  try {

    setUploadingImage(true);

    const body =
      new FormData();

    body.append(
      "images",
      file
    );

    body.append(
      "propertyId",
      propertyId
    );

    const res =
      await fetch(

        "/api/upload",

        {
          method: "POST",
          body
        }

      );

    const data =
      await res.json();

    if (!data.success) {

      console.log(data.error);
      return;

    }

    updateField(
      "images",
      [

         ...(formData?.images || 0),

        ...data.urls

      ]
    );

  }

  catch (error) {

    console.error(error);

  }

  finally {

    setUploadingImage(false);

  }

};
const removeImage = async (
  index:number
) => {

  try {

    const imageUrl =
      formData?.images?.[index];

    if(!imageUrl)
      return;

    // DELETE FROM SERVER
    await fetch(

      "/api/upload/delete",

      {

        method:"POST",

        headers:{
          "Content-Type":
            "application/json"
        },

        body:JSON.stringify({

          imageUrl

        })

      }

    );

    // REMOVE FROM UI
    updateField(

      "images",

      (formData?.images || []).filter(

        (_:any,i:number)=>

          i !== index

      )

    );

    // RESET ACTIVE IMAGE
    setActiveImage(0);

  }

  catch(error){

    console.error(error);

  }

};

 const saveChanges =
  async () => {

    try {

      setSaving(true);

      await fetch(

        `/api/admin/properties/${propertyId}`,

        {

          method:"PUT",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              formData
            )

        }

      );

     
      // REFETCH FULL UPDATED PROPERTY
      const refresh =
        await fetch(

          `/api/admin/properties/${propertyId}`

        );

      const updated =
        await refresh.json();


      setProperty(
        updated.property
      );

      setFormData(
        updated.property
      );

      setEditing(false);

    }

    catch(error){

      console.error(error);

    }

    finally{

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

  onClick={() => {

    setActiveImage(0);

   if(formData?.images?.length){

  setShowGallery(true);

}

  }}

  src={

    formData?.images?.[0] ||

    property.image ||

    "/maha.png"

  }

  alt={formData?.title}

  style={{

    width: "100%",

    height: "100%",

    objectFit: "cover",

    cursor:"pointer"

  }}

/>
{/* IMAGE MANAGEMENT */}

        </div>
        {/* IMAGE MANAGER */}
<div
  style={{
    padding:20,

    borderTop:
      "1px solid #e2e8f0",
  }}
>

  <div
    style={{
      display:"flex",

      justifyContent:
        "space-between",

      alignItems:"center",

      marginBottom:16,
    }}
  >

    <div>

      <div
        style={{
          fontSize:18,
          fontWeight:700,
        }}
      >
        Property Images
      </div>

      <div
        style={{
          fontSize:13,
          color:"#64748b",
          marginTop:4,
        }}
      >
        Manage property gallery
      </div>

    </div>

    {

      editing && (

        <label
          style={{
            padding:"10px 16px",

            background:"#2563eb",

            color:"#fff",

            borderRadius:12,

            cursor:"pointer",

            fontWeight:600,

            fontSize:14,
          }}
        >

          {

            uploadingImage

            ?

            "Uploading..."

            :

            "Add Image"

          }

         <input
  type="file"

  accept="image/*"

            hidden

            onChange={(e)=>{

              const file =
                e.target.files?.[0];

              if(file){

                uploadImage(file);

              }
               e.target.value = "";

            }}
          />

        </label>

      )

    }

  </div>
 

  {/* GRID */}
  <div
    style={{
      display:"grid",

      gridTemplateColumns:
        "repeat(auto-fill,minmax(160px,1fr))",

      gap:16,
    }}
  >

    {

      formData?.images?.map(

        (
          image:string,
          index:number
        )=>(

         <div
  key={index}

  onClick={() => {

    setActiveImage(index);

   if(formData?.images?.length){

  setShowGallery(true);

}

  }}

  style={{
    position:"relative",

    borderRadius:16,

    overflow:"hidden",

    border:
      "1px solid #e2e8f0",

    background:"#fff",

    cursor:"pointer",

    transition:"all .2s ease",
  }}
>

            <img

              src={image}

              style={{
                width:"100%",

                height:140,

                objectFit:"cover",

                display:"block",
              }}

            />

            {

              editing && (

                <button

                 onClick={(e)=>{

  e.stopPropagation();

  removeImage(index);

}}

                  style={{

                    position:"absolute",

                    top:10,

                    right:10,

                    width:32,

                    height:32,

                    borderRadius:"50%",

                    border:"none",

                    background:
                      "rgba(220,38,38,.9)",

                    color:"#fff",

                    cursor:"pointer",

                    fontWeight:700,
                  }}
                >

                  ✕

                </button>

              )

            }

          </div>

        )

      )

    }

  </div>

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

            {formData?.title}

          </h1>


          <p
            style={{

              marginTop: 8,

              color: "#64748b"

            }}
          >

            📍 {

              formData?.locality || "--"

            }, {

              formData?.city || "--"

            }, {

              formData?.state || "--"

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
                formData?.propertyId
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
  options={categoryOptions}
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

            

            <div>

  {/* DISPLAY */}
  {
    !editing && (

      <InfoCard
        label="Area"
        value={

          formData?.area

            ?

            `${formData.area} ${formData?.areaUnit || ""}`

            :

            "--"

        }
      />

    )
  }


  {/* EDIT MODE */}
  {
    editing && (

      <div style={{
        display:"grid",
        gap:10
      }}>

        <AdminField
          label="Area"
          field="area"
          value={formData?.area}
          editing={editing}
          onChange={updateField}
        />

        <AdminField
          label="Area Unit"
          field="areaUnit"
          value={formData?.areaUnit}
          editing={editing}
          onChange={updateField}
          options={[

            "sqft",

            "sqyd",

            "acre",

            "hectare",

            "guntha"

          ]}
        />

      </div>

    )
  }

</div>

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
  label={

    formData?.postedBy === "Owner"

      ? "Owner Name"

      : formData?.postedBy === "Builder"

      ? "Builder Name"

      : "Agent Name"

  }
  field="agentName"
  value={
    formData?.agentName
  }
  editing={editing}
  onChange={updateField}
/>


<AdminField
  label={

    formData?.postedBy === "Owner"

      ? "Owner Phone"

      : formData?.postedBy === "Builder"

      ? "Builder Phone"

      : "Agent Phone"

  }
  field="agentPhone"
  value={
    formData?.agentPhone
  }
  editing={editing}
  onChange={updateField}
/>

           <ToggleField
  label="RERA Approved"
  field="isRERA"
  value={formData?.isRERA}
  editing={editing}
  onChange={updateField}
/>

<ToggleField
  label="Featured Property"
  field="isFeatured"
  value={formData?.isFeatured}
  editing={editing}
  onChange={updateField}
/>

<ToggleField
  label="Zero Brokerage"
  field="isZeroBrokerage"
  value={formData?.isZeroBrokerage}
  editing={editing}
  onChange={updateField}
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

              formData?.description ||

              "No description"

            }

          </p>
{/* AMENITIES */}
<div style={{marginTop:24}}>

  <h2 style={{
    marginBottom:14,
    fontSize:20,
    fontWeight:700,
    color:"#0f172a"
  }}>
    Amenities
  </h2>

  {

    editing

    ?

    <>

      {/* TAGS */}
      <div style={{
        display:"flex",
        flexWrap:"wrap",
        gap:10,
        marginBottom:12
      }}>

        {

          formData?.amenities?.map(

            (
              item:string,
              index:number
            )=>(

              <div
                key={index}
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:8,
                  padding:"8px 12px",
                  background:"#f1f5f9",
                  border:"1px solid #e2e8f0",
                  borderRadius:10,
                  fontSize:13,
                  fontWeight:600
                }}
              >

                ✓ {item}

                <button
                  onClick={()=>
                    updateField(
                      "amenities",
                      formData.amenities.filter(
                        (_:any,i:number)=>
                          i !== index
                      )
                    )
                  }
                  style={{
                    border:"none",
                    background:"transparent",
                    color:"#dc2626",
                    cursor:"pointer",
                    fontWeight:700,
                    padding:0
                  }}
                >
                  ✕
                </button>

              </div>

            )

          )

        }

      </div>


      {/* ADD */}
      <div style={{
        display:"flex",
        gap:10
      }}>

        <input
          value={amenityInput}
          onChange={(e)=>
            setAmenityInput(
              e.target.value
            )
          }
          placeholder="Add amenity"
          style={{
            flex:1,
            height:44,
            border:"1px solid #cbd5e1",
            borderRadius:10,
            padding:"0 12px",
            outline:"none"
          }}
        />

        <button
          onClick={()=>{

            if(!amenityInput.trim())
              return;

            updateField(
              "amenities",
              [
                ...(formData?.amenities || []),
                amenityInput
              ]
            );

            setAmenityInput("");

          }}
          style={{
            width:90,
            border:"none",
            borderRadius:10,
            background:"#2563eb",
            color:"#fff",
            fontWeight:700,
            cursor:"pointer"
          }}
        >
          Add
        </button>

      </div>

    </>

    :

    <div style={{
      display:"flex",
      flexWrap:"wrap",
      gap:10
    }}>

      {

        property.amenities?.map(

          (
            item:string,
            index:number
          )=>(

            <div
              key={index}
              style={{
                padding:"8px 12px",
                borderRadius:10,
                background:"#f1f5f9",
                border:"1px solid #e2e8f0",
                fontSize:13,
                fontWeight:600,
                color:"#334155"
              }}
            >

              ✓ {item}

            </div>

          )

        )

      }

    </div>

  }

</div>



{/* KEY FEATURES */}
<div style={{marginTop:28}}>

  <h2 style={{
    marginBottom:14,
    fontSize:20,
    fontWeight:700,
    color:"#0f172a"
  }}>
    Key Features
  </h2>

  {

    editing

    ?

    <>

      {/* TAGS */}
      <div style={{
        display:"flex",
        flexWrap:"wrap",
        gap:10,
        marginBottom:12
      }}>

        {

          formData?.highlights?.map(

            (
              item:string,
              index:number
            )=>(

              <div
                key={index}
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:8,
                  padding:"8px 12px",
                  background:"#ecfeff",
                  border:"1px solid #a5f3fc",
                  borderRadius:10,
                  fontSize:13,
                  fontWeight:600
                }}
              >

                ⭐ {item}

                <button
                  onClick={()=>
                    updateField(
                      "highlights",
                      formData.highlights.filter(
                        (_:any,i:number)=>
                          i !== index
                      )
                    )
                  }
                  style={{
                    border:"none",
                    background:"transparent",
                    color:"#dc2626",
                    cursor:"pointer",
                    fontWeight:700,
                    padding:0
                  }}
                >
                  ✕
                </button>

              </div>

            )

          )

        }

      </div>


      {/* ADD */}
      <div style={{
        display:"flex",
        gap:10
      }}>

        <input
          value={featureInput}
          onChange={(e)=>
            setFeatureInput(
              e.target.value
            )
          }
          placeholder="Add feature"
          style={{
            flex:1,
            height:44,
            border:"1px solid #cbd5e1",
            borderRadius:10,
            padding:"0 12px",
            outline:"none"
          }}
        />

        <button
          onClick={()=>{

            if(!featureInput.trim())
              return;

            updateField(
              "highlights",
              [
                ...(formData?.highlights || []),
                featureInput
              ]
            );

            setFeatureInput("");

          }}
          style={{
            width:90,
            border:"none",
            borderRadius:10,
            background:"#0891b2",
            color:"#fff",
            fontWeight:700,
            cursor:"pointer"
          }}
        >
          Add
        </button>

      </div>

    </>

    :

    <div style={{
      display:"grid",
      gap:10
    }}>

      {

        property.highlights?.map(

          (
            item:string,
            index:number
          )=>(

            <div
              key={index}
              style={{
                padding:"12px 14px",
                borderRadius:10,
                background:"#ecfeff",
                border:"1px solid #a5f3fc",
                fontSize:13,
                fontWeight:600,
                color:"#155e75"
              }}
            >

              ⭐ {item}

            </div>

          )

        )

      }

    </div>

  }

</div>
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

{
  showGallery && (

    <div
      style={{

        position:"fixed",

        inset:0,

        background:
          "rgba(0,0,0,.96)",

        zIndex:9999,

        display:"flex",

        alignItems:"center",

        justifyContent:"center",

        flexDirection:"column",

        padding:"30px"

      }}
    >

      {/* CLOSE BUTTON */}
      <button

        onClick={() =>

          setShowGallery(false)

        }

        style={{

          position:"absolute",

          top:20,

          right:20,

          width:52,

          height:52,

          borderRadius:"50%",

          border:"none",

          background:"#fff",

          fontSize:22,

          fontWeight:700,

          cursor:"pointer",

          boxShadow:
            "0 10px 25px rgba(0,0,0,.25)",

          zIndex:10

        }}

      >

        ✕

      </button>


      {/* MAIN IMAGE */}
      <img

        src={

  formData?.images?.[
    activeImage
  ]

  ||

  "/maha.png"

}

        alt="Property"

        style={{

          width:"auto",

          maxWidth:"92%",

          maxHeight:"72vh",

          objectFit:"contain",

          borderRadius:20,

          display:"block",

          boxShadow:
            "0 20px 60px rgba(0,0,0,.45)",

          transition:"all .25s ease"

        }}

      />


      {/* IMAGE COUNTER */}
      <div
        style={{

          marginTop:18,

          color:"#fff",

          fontSize:14,

          fontWeight:700,

          letterSpacing:.5

        }}
      >

        {

          activeImage + 1

        }

        /

        {

          formData?.images?.length

        }

      </div>


      {/* THUMBNAILS */}
      <div
        style={{

          display:"flex",

          gap:12,

          marginTop:24,

          overflowX:"auto",

          maxWidth:"92%",

          paddingBottom:10

        }}
      >

        {

          formData?.images?.map(

            (
              image:string,
              index:number
            ) => (

              <img

                key={index}

                src={image}

                alt={`thumb-${index}`}

                onClick={() =>
                  setActiveImage(index)
                }

                onMouseEnter={(e)=>{

                  e.currentTarget.style.opacity =
                    "1";

                }}

                onMouseLeave={(e)=>{

                  if(
                    activeImage !== index
                  ){

                    e.currentTarget.style.opacity =
                      ".7";

                  }

                }}

                style={{

                  width:110,

                  height:72,

                  objectFit:"cover",

                  borderRadius:14,

                  cursor:"pointer",

                  border:

                    activeImage === index

                    ?

                    "3px solid #3b82f6"

                    :

                    "2px solid transparent",

                  opacity:

                    activeImage === index

                    ?

                    1

                    :

                    .7,

                  transition:
                    "all .2s ease",

                  flexShrink:0,

                  boxShadow:
                    "0 8px 20px rgba(0,0,0,.25)"

                }}

              />

            )

          )

        }

      </div>


      {/* PREVIOUS BUTTON */}
      {

        formData?.images?.length > 1 && (

          <button

            onClick={() =>

              setActiveImage(

                prev =>

                  prev === 0

                  ?

                  formData?.images.length - 1

                  :

                  prev - 1

              )

            }

            style={{

              position:"absolute",

              left:24,

              top:"50%",

              transform:
                "translateY(-50%)",

              width:64,

              height:64,

              borderRadius:"50%",

              border:"none",

              background:"#fff",

              fontSize:36,

              fontWeight:700,

              cursor:"pointer",

              boxShadow:
                "0 10px 30px rgba(0,0,0,.35)"

            }}

          >

            ‹

          </button>

        )

      }


      {/* NEXT BUTTON */}
      {

        formData?.images?.length > 1 && (

          <button

            onClick={() =>

              setActiveImage(

                prev =>

                  prev ===

                  formData?.images.length - 1

                  ?

                  0

                  :

                  prev + 1

              )

            }

            style={{

              position:"absolute",

              right:24,

              top:"50%",

              transform:
                "translateY(-50%)",

              width:64,

              height:64,

              borderRadius:"50%",

              border:"none",

              background:"#fff",

              fontSize:36,

              fontWeight:700,

              cursor:"pointer",

              boxShadow:
                "0 10px 30px rgba(0,0,0,.35)"

            }}

          >

            ›

          </button>

        )

      }

    </div>

  )
}

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

  onChange,

  options

}:any){

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

  Array.isArray(options) && options.length > 0

  ?

  <select

    value={value || ""}

    onChange={(e)=>

      onChange(
        field,
        e.target.value
      )

    }

    style={{

      width:"100%",

      height:46,

      border:
        "1px solid #cbd5e1",

      borderRadius:12,

      padding:"0 14px",

      background:"#fff",

      fontSize:14,

      outline:"none",

      cursor:"pointer"

    }}
  >

    <option value="">
      Select {label}
    </option>

    {

      options.map(

        (
          item:string
        )=>(

          <option
            key={item}
            value={item}
          >

            {item}

          </option>

        )

      )

    }

  </select>

  :

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

      width:"100%",

      height:40,

      border:
        "1px solid #cbd5e1",

      borderRadius:10,

      padding:
        "0 12px"

    }}
  />

  :

  <div
    style={{

      fontWeight:700,

      fontSize:16

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

        background:"#f8fafc",

        border:
          "1px solid #e2e8f0",

        borderRadius:14,

        padding:14

      }}
    >

      <div
        style={{

          fontWeight:700,

          fontSize:16

        }}
      >

        {

          value || "--"

        }

      </div>

      <div
        style={{

          marginTop:8,

          fontSize:13,

          color:"#64748b"

        }}
      >

        {label}

      </div>

    </div>

  );

}
function ToggleField({

  label,

  field,

  value,

  editing,

  onChange

}:any){

  return(

    <div
      style={{

        background:"#f8fafc",

        border:
          "1px solid #e2e8f0",

        borderRadius:14,

        padding:14

      }}
    >

      {

        editing

        ?

        <label
          style={{

            display:"flex",

            alignItems:"center",

            justifyContent:"space-between",

            cursor:"pointer"

          }}
        >

          <span
            style={{

              fontWeight:600,

              color:"#0f172a"

            }}
          >

            {label}

          </span>

          <input
            type="checkbox"
            checked={value || false}
            onChange={(e)=>

              onChange(
                field,
                e.target.checked
              )

            }
            style={{

              width:18,

              height:18,

              cursor:"pointer"

            }}
          />

        </label>

        :

        <>

          <div
            style={{

              fontWeight:700,

              fontSize:16,

              color:
                value
                  ? "#16a34a"
                  : "#dc2626"

            }}
          >

            {

              value
                ? "Yes"
                : "No"

            }

          </div>

          <div
            style={{

              marginTop:8,

              fontSize:13,

              color:"#64748b"

            }}
          >

            {label}

          </div>

        </>

      }

    </div>

  );

}