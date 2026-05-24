"use client";

import React, {

  useEffect,

  useState

} from "react";



export default function PropertyInquiriesPage() {

  const [data,setData] =

    useState<any[]>([]);

  const [loading,setLoading] =

    useState(true);

  const [selectedLead,setSelectedLead] =

    useState<any>(null);




  useEffect(()=>{

    fetchInquiries();

  },[]);




  const fetchInquiries = async()=>{

    try{

      const res =

        await fetch(

          "/api/property-inquiry"

        );



      const result =

        await res.json();



      setData(

        Array.isArray(result)

        ?

        result

        :

        result.inquiries || []

      );

    }

    catch(error){

      console.log(error);

    }

    finally{

      setLoading(false);

    }

  };




  /* LOADING */
  if(loading){

    return(

      <div
        style={{

          display:"flex",

          alignItems:"center",

          justifyContent:"center",

          height:"100vh",

          fontSize:18,

          fontWeight:700,

          color:"#64748b"

        }}
      >

        Loading inquiries...

      </div>

    );

  }




  return(

    <div
      style={{

        padding:24,

        background:"#f1f5f9",

        minHeight:"100vh"

      }}
    >

      {/* HEADER */}
      <div
        style={{

          display:"flex",

          justifyContent:
            "space-between",

          alignItems:"center",

          marginBottom:24,

          flexWrap:"wrap",

          gap:16

        }}
      >

        <div>

          <h1
            style={{

              margin:0,

              fontSize:32,

              fontWeight:800,

              color:"#0f172a"

            }}
          >

            Property Inquiries

          </h1>

          <p
            style={{

              marginTop:6,

              color:"#64748b"

            }}
          >

            Manage customer leads
            professionally.

          </p>

        </div>

      </div>




      {/* EMPTY */}
      {

        data.length === 0

        ?

        (

          <div
            style={{

              background:"#fff",

              borderRadius:24,

              padding:50,

              textAlign:"center",

              border:
                "1px solid #e2e8f0"

            }}
          >

            <div
              style={{
                fontSize:50
              }}
            >
              📭
            </div>

            <div
              style={{

                marginTop:14,

                fontSize:18,

                fontWeight:700

              }}
            >

              No inquiries found

            </div>

          </div>

        )

        :

        (

          <div
            style={{

              overflowX:"auto",

              background:"#fff",

              borderRadius:28,

              border:
                "1px solid #e2e8f0",

              boxShadow:
                "0 10px 30px rgba(15,23,42,.04)"

            }}
          >

            <table
              style={{

                width:"100%",

                borderCollapse:"collapse"

              }}
            >

              <thead>

                <tr
                  style={{
                    background:"#f8fafc"
                  }}
                >

                  <th style={th}>
                    Customer
                  </th>

                  <th style={th}>
                    Phone
                  </th>

                  <th style={th}>
                    Email
                  </th>

                  <th style={th}>
                    Property
                  </th>

                  <th style={th}>
                    Type
                  </th>

                  <th style={th}>
                    Message
                  </th>

                  <th style={th}>
                    Status
                  </th>

                  <th style={th}>
                    Date
                  </th>

                  <th style={th}>
                    Actions
                  </th>

                </tr>

              </thead>




              <tbody>

                {

                  data.map((item)=>(

                    <tr
                      key={item._id}

                      style={{

                        borderBottom:
                          "1px solid #e2e8f0",

                        transition:
                          "all .2s ease"

                      }}
                    >

                      {/* CUSTOMER */}
                      <td style={td}>

                        {

                          item.customerName ||

                          item.name ||

                          "-"

                        }

                      </td>



                      {/* PHONE */}
                      <td style={td}>

                        {

                          item.phone ||

                          item.mobileNumber ||

                          "-"

                        }

                      </td>



                      {/* EMAIL */}
                      <td style={td}>

                        {item.email || "-"}

                      </td>



                      {/* PROPERTY */}
                      <td style={td}>

                        {

                          item.propertyTitle ||

                          item.propertyName ||

                          "-"

                        }

                      </td>



                      {/* TYPE */}
                      <td style={td}>

                        <span
                          style={badge}
                        >

                          {

                            item.inquiryType ||

                            "General"

                          }

                        </span>

                      </td>



                      {/* MESSAGE */}
                      <td
                        style={{

                          ...td,

                          maxWidth:220,

                          whiteSpace:"nowrap",

                          overflow:"hidden",

                          textOverflow:
                            "ellipsis"

                        }}
                      >

                        {

                          item.message ||

                          "-"

                        }

                      </td>



                      {/* STATUS */}
                      <td style={td}>

                        <StatusBadge
                          status={
                            item.status
                          }
                        />

                      </td>



                      {/* DATE */}
                      <td style={td}>

                        {

                          item.createdAt

                          ?

                          new Date(

                            item.createdAt

                          )

                          .toLocaleDateString(

                            "en-IN"

                          )

                          :

                          "-"

                        }

                      </td>



                      {/* ACTIONS */}
                      <td style={td}>

                        <div
                          style={{

                            display:"flex",

                            gap:8,

                            flexWrap:"wrap"

                          }}
                        >

                          {/* VIEW */}
                          <button

                            style={viewBtn}

                            onClick={()=>{

                              setSelectedLead(

                                item

                              );

                            }}

                          >

                            View

                          </button>



                          {/* CALL */}
                          <a
                            href={`tel:${
                              item.phone
                              ||
                              item.mobileNumber
                            }`}
                            style={callBtn}
                          >

                            Call

                          </a>



                          {/* WHATSAPP */}
                          <a

                            href={`https://wa.me/91${
                              item.phone
                              ||
                              item.mobileNumber
                            }`}

                            target="_blank"

                            style={waBtn}

                          >

                            WhatsApp

                          </a>

                        </div>

                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </table>

          </div>

        )

      }




      {/* LEAD DRAWER */}
      {

        selectedLead && (

          <div
            style={overlay}
          >

            <div
              style={drawer}
            >

              {/* HEADER */}
              <div
                style={{

                  display:"flex",

                  justifyContent:
                    "space-between",

                  alignItems:"center",

                  marginBottom:24

                }}
              >

                <h2
                  style={{
                    margin:0
                  }}
                >

                  Lead Details

                </h2>

                <button

                  style={closeBtn}

                  onClick={()=>{

                    setSelectedLead(

                      null

                    );

                  }}

                >

                  ✕

                </button>

              </div>




              {/* CUSTOMER */}
              <SectionTitle
                title="Customer Info"
              />

              <InfoRow
                label="Name"
                value={
                  selectedLead.customerName
                }
              />

              <InfoRow
                label="Phone"
                value={
                  selectedLead.phone
                }
              />

              <InfoRow
                label="Email"
                value={
                  selectedLead.email
                }
              />




              {/* PROPERTY */}
              <SectionTitle
                title="Property Info"
              />

              <InfoRow
                label="Property"
                value={
                  selectedLead.propertyTitle
                }
              />

              <InfoRow
                label="Inquiry Type"
                value={
                  selectedLead.inquiryType
                }
              />




              {/* STATUS */}
              <SectionTitle
                title="Lead Status"
              />

              <select
                style={statusSelect}
                defaultValue={
                  selectedLead.status
                }
              >

                <option>
                  new
                </option>

                <option>
                  contacted
                </option>

                <option>
                  interested
                </option>

                <option>
                  site visit
                </option>

                <option>
                  negotiation
                </option>

                <option>
                  closed
                </option>

              </select>




              {/* NOTES */}
              <SectionTitle
                title="Notes"
              />

              <textarea
                placeholder=
                  "Add notes here..."

                style={notesStyle}
              />




              {/* MESSAGE */}
              <SectionTitle
                title="Message"
              />

              <div
                style={messageBox}
              >

                {

                  selectedLead.message ||

                  "No message"

                }

              </div>




              {/* ACTIONS */}
              <div
                style={{
                  marginTop:24
                }}
              >

                <a

                  href={`tel:${
                    selectedLead.phone
                  }`}

                  style={callLargeBtn}

                >

                  📞 Call Customer

                </a>



                <a

                  href={`https://wa.me/91${
                    selectedLead.phone
                  }`}

                  target="_blank"

                  style={waLargeBtn}

                >

                  💬 WhatsApp

                </a>



               {

  selectedLead.propertyId && (

    <a

      href={`/x-admin/properties/${
        selectedLead.propertyId
      }`}

      target="_blank"

      style={propertyBtn}

    >

      🏠 View Property

    </a>

  )

}

              </div>

            </div>

          </div>

        )

      }

    </div>

  );

}




/* SECTION TITLE */
function SectionTitle({

  title

}:any){

  return(

    <div
      style={{

        marginTop:20,

        marginBottom:12,

        fontSize:15,

        fontWeight:700,

        color:"#0f172a"

      }}
    >

      {title}

    </div>

  );

}




/* INFO ROW */
function InfoRow({

  label,

  value

}:any){

  return(

    <div
      style={{

        display:"flex",

        justifyContent:
          "space-between",

        marginBottom:10

      }}
    >

      <div
        style={{
          color:"#64748b"
        }}
      >

        {label}

      </div>

      <div
        style={{
          fontWeight:600
        }}
      >

        {value || "-"}

      </div>

    </div>

  );

}




/* STATUS BADGE */
function StatusBadge({

  status

}:any){

  return(

    <span
      style={{

        padding:"6px 12px",

        borderRadius:999,

        fontSize:12,

        fontWeight:700,

        background:

          status === "closed"

          ?

          "#dcfce7"

          :

          status === "contacted"

          ?

          "#dbeafe"

          :

          "#fef9c3",

        color:

          status === "closed"

          ?

          "#166534"

          :

          status === "contacted"

          ?

          "#1d4ed8"

          :

          "#854d0e"

      }}
    >

      {status || "new"}

    </span>

  );

}




/* TABLE */
const th:React.CSSProperties = {

  padding:"16px",

  textAlign:"left",

  fontSize:14,

  fontWeight:700,

  color:"#0f172a"

};



const td:React.CSSProperties = {

  padding:"16px",

  fontSize:14,

  color:"#334155"

};



/* BADGE */
const badge:React.CSSProperties = {

  padding:"6px 12px",

  borderRadius:999,

  background:"#dbeafe",

  color:"#1d4ed8",

  fontSize:12,

  fontWeight:700

};



/* ACTION BUTTONS */
const viewBtn:React.CSSProperties = {

  height:36,

  padding:"0 14px",

  border:"none",

  borderRadius:10,

  background:"#dbeafe",

  color:"#1d4ed8",

  fontWeight:700,

  cursor:"pointer"

};



const callBtn:React.CSSProperties = {

  height:36,

  padding:"0 14px",

  borderRadius:10,

  background:"#dcfce7",

  color:"#166534",

  fontWeight:700,

  textDecoration:"none",

  display:"flex",

  alignItems:"center"

};



const waBtn:React.CSSProperties = {

  height:36,

  padding:"0 14px",

  borderRadius:10,

  background:"#dcfce7",

  color:"#166534",

  fontWeight:700,

  textDecoration:"none",

  display:"flex",

  alignItems:"center"

};



/* DRAWER */
const overlay:React.CSSProperties = {

  position:"fixed",

  top:0,

  left:0,

  right:0,

  bottom:0,

  background:
    "rgba(15,23,42,.45)",

  display:"flex",

  justifyContent:"flex-end",

  zIndex:999

};



const drawer:React.CSSProperties = {

  width:420,

  height:"100vh",

  background:"#fff",

  padding:24,

  overflowY:"auto",

  boxShadow:
    "-10px 0 30px rgba(0,0,0,.1)"

};



const closeBtn:React.CSSProperties = {

  width:40,

  height:40,

  border:"none",

  borderRadius:12,

  cursor:"pointer",

  fontWeight:700

};



const statusSelect:React.CSSProperties = {

  width:"100%",

  height:50,

  borderRadius:14,

  border:"1px solid #cbd5e1",

  padding:"0 14px",

  outline:"none"

};



const notesStyle:React.CSSProperties = {

  width:"100%",

  height:120,

  borderRadius:14,

  border:"1px solid #cbd5e1",

  padding:14,

  resize:"none",

  outline:"none"

};



const messageBox:React.CSSProperties = {

  background:"#f8fafc",

  padding:16,

  borderRadius:14,

  border:"1px solid #e2e8f0",

  color:"#334155"

};



const callLargeBtn:React.CSSProperties = {

  height:50,

  borderRadius:14,

  background:"#dcfce7",

  color:"#166534",

  display:"flex",

  alignItems:"center",

  justifyContent:"center",

  fontWeight:700,

  textDecoration:"none",

  marginBottom:12

};



const waLargeBtn:React.CSSProperties = {

  height:50,

  borderRadius:14,

  background:"#22c55e",

  color:"#fff",

  display:"flex",

  alignItems:"center",

  justifyContent:"center",

  fontWeight:700,

  textDecoration:"none",

  marginBottom:12

};



const propertyBtn:React.CSSProperties = {

  height:50,

  borderRadius:14,

  background:"#2563eb",

  color:"#fff",

  display:"flex",

  alignItems:"center",

  justifyContent:"center",

  fontWeight:700,

  textDecoration:"none"

};