"use client";


import { useRouter }
from "next/navigation";
import {
  useEffect,
  useMemo,
  useState
}
from "react";



export default function PropertyReportsPage(){

  const [reports,setReports] =
    useState<any[]>([]);

  const [loading,setLoading] =
    useState(true);

    const router =
  useRouter();

  const [search,setSearch] =
    useState("");

  const [filter,setFilter] =
    useState("All");



  /* FETCH REPORTS */
  async function fetchReports(){

    try{

      setLoading(true);

      const res =
        await fetch(
          "/api/property-report"
        );

      const data =
        await res.json();

      setReports(
        data.reports || []
      );

    }

    catch(error){

      console.error(error);

    }

    finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    fetchReports();

  },[]);
  /* RESOLVE REPORT */
async function handleResolve(

  id:string

){

  try{

    const res = await fetch(

      `/api/property-report/${id}`,

      {

        method:"PATCH"

      }

    );

    const data =
      await res.json();

    if(data.success){

      alert(
        "Report resolved"
      );

      fetchReports();

    }

  }

  catch(error){

    console.error(error);

    alert(
      "Failed to resolve report"
    );

  }

}
/* DELETE REPORT */
async function handleDelete(

  id:string

){

  const confirmDelete =

    confirm(

      "Delete this report?"

    );

  if(!confirmDelete)
    return;

  try{

    const res = await fetch(

      `/api/property-report/${id}`,

      {

        method:"DELETE"

      }

    );

    const data =
      await res.json();

    if(data.success){

      alert(
        "Report deleted"
      );

      fetchReports();

    }

  }

  catch(error){

    console.error(error);

    alert(
      "Failed to delete report"
    );

  }

}



  /* FILTERED REPORTS */
  const filteredReports =
    useMemo(()=>{

      return reports.filter(

        (report)=>{

          const matchesSearch =

            report.propertyTitle
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

            ||

            report.reason
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );



          const matchesFilter =

            filter === "All"

            ||

            report.status === filter;



          return (

            matchesSearch

            &&

            matchesFilter

          );

        }

      );

    },[reports,search,filter]);



  /* STATS */
  const pendingCount =

    reports.filter(

      x => x.status === "Pending"

    ).length;



  const resolvedCount =

    reports.filter(

      x => x.status === "Resolved"

    ).length;



  return (

    <div
      style={{
        padding:24,
        background:"#f8fafc",
        minHeight:"100vh"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          marginBottom:24
        }}
      >

        <h1
          style={{
            margin:0,
            fontSize:32,
            fontWeight:800,
            color:"#0f172a"
          }}
        >
          Property Reports
        </h1>

        <p
          style={{
            color:"#64748b",
            marginTop:8
          }}
        >
          Manage reported property listings professionally.
        </p>

      </div>



      {/* STATS */}
      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap:16,
          marginBottom:24
        }}
      >

        <StatCard
          title="Total Reports"
          value={reports.length}
        />

        <StatCard
          title="Pending Reports"
          value={pendingCount}
          color="#f59e0b"
        />

        <StatCard
          title="Resolved Reports"
          value={resolvedCount}
          color="#16a34a"
        />

      </div>



      {/* FILTERS */}
      <div
        style={{
          display:"flex",
          gap:12,
          marginBottom:20,
          flexWrap:"wrap"
        }}
      >

        <input
          placeholder="Search property or reason..."
          value={search}
          onChange={(e)=>
            setSearch(
              e.target.value
            )
          }
          style={{
            flex:1,
            minWidth:240,
            height:48,
            borderRadius:14,
            border:"1px solid #e2e8f0",
            padding:"0 16px",
            outline:"none",
            background:"#fff"
          }}
        />


        <select
          value={filter}
          onChange={(e)=>
            setFilter(
              e.target.value
            )
          }
          style={{
            width:180,
            height:48,
            borderRadius:14,
            border:"1px solid #e2e8f0",
            padding:"0 14px",
            background:"#fff",
            outline:"none"
          }}
        >

          <option>
            All
          </option>

          <option>
            Pending
          </option>

          <option>
            Resolved
          </option>

        </select>

      </div>



      {/* TABLE */}
      <div
        style={{
          background:"#fff",
          borderRadius:24,
          overflow:"hidden",
          boxShadow:
            "0 10px 30px rgba(0,0,0,.05)"
        }}
      >

        <div
          style={{
            overflowX:"auto"
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
                  background:"#f1f5f9"
                }}
              >

                <th style={thStyle}>
                  Property
                </th>

                <th style={thStyle}>
                  Reason
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Date
                </th>

                <th style={thStyle}>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {

                loading

                ?

                <tr>

                  <td
                    colSpan={5}
                    style={emptyStyle}
                  >
                    Loading reports...
                  </td>

                </tr>

                :

                filteredReports.length === 0

                ?

                <tr>

                  <td
                    colSpan={5}
                    style={emptyStyle}
                  >
                    No reports found
                  </td>

                </tr>

                :

                filteredReports.map(

                  (report:any)=>{

                    return (

                      <tr
                        key={report._id}
                        style={{
                          borderBottom:
                            "1px solid #f1f5f9"
                        }}
                      >

                        {/* PROPERTY */}
                        <td style={tdStyle}>

                          <div
                            style={{
                              fontWeight:700,
                              color:"#0f172a"
                            }}
                          >
                            {
                              report.propertyTitle
                            }
                          </div>

                          <div
                            style={{
                              fontSize:12,
                              color:"#64748b",
                              marginTop:4
                            }}
                          >
                            ID:
                            {
                              report.propertyId
                            }
                          </div>

                        </td>


                        {/* REASON */}
                        <td style={tdStyle}>

                          <div
                            style={{
                              maxWidth:320,
                              lineHeight:1.6,
                              color:"#334155"
                            }}
                          >
                            {
                              report.reason
                            }
                          </div>

                        </td>


                        {/* STATUS */}
                        <td style={tdStyle}>

                          <span
                            style={{

                              padding:
                                "6px 12px",

                              borderRadius:999,

                              fontSize:12,

                              fontWeight:700,

                              background:

                                report.status ===
                                "Resolved"

                                ?

                                "#dcfce7"

                                :

                                "#fef3c7",

                              color:

                                report.status ===
                                "Resolved"

                                ?

                                "#166534"

                                :

                                "#92400e"

                            }}
                          >

                            {
                              report.status ||
                              "Pending"
                            }

                          </span>

                        </td>


                        {/* DATE */}
                        <td style={tdStyle}>

                          {
                            new Date(
                              report.createdAt
                            ).toLocaleDateString()
                          }

                        </td>


                        {/* ACTIONS */}
                        <td style={tdStyle}>

                          <div
                            style={{
                              display:"flex",
                              gap:10,
                              flexWrap:"wrap"
                            }}
                          >
<button

  style={viewBtn}

  onClick={()=>

    router.push(

      `/property/${report.propertyId}`

    )

  }

>

  View

</button>

                          <button

  style={resolveBtn}

  onClick={()=>

    handleResolve(
      report._id
    )

  }

>

  Resolve

</button>


                            <button

  style={deleteBtn}

  onClick={()=>

    handleDelete(
      report._id
    )

  }

>

  Delete

</button>

                          </div>

                        </td>

                      </tr>

                    );

                  }

                )

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}




function StatCard({
  title,
  value,
  color="#2563eb"
}:any){

  return (

    <div
      style={{
        background:"#fff",
        borderRadius:20,
        padding:20,
        boxShadow:
          "0 8px 20px rgba(0,0,0,.05)"
      }}
    >

      <div
        style={{
          color:"#64748b",
          fontSize:14,
          marginBottom:10
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:34,
          fontWeight:800,
          color
        }}
      >
        {value}
      </div>

    </div>

  );

}



const thStyle:React.CSSProperties = {

  textAlign:"left",

  padding:"16px 18px",

  fontSize:13,

  color:"#475569"

};


const tdStyle:React.CSSProperties = {

  padding:"18px"

};


const emptyStyle:React.CSSProperties = {

  padding:40,

  textAlign:"center",

  color:"#64748b"

};


const viewBtn:React.CSSProperties = {

  height:38,

  padding:"0 14px",

  border:"none",

  borderRadius:10,

  background:"#2563eb",

  color:"#fff",

  cursor:"pointer",

  fontWeight:700

};


const resolveBtn:React.CSSProperties = {

  height:38,

  padding:"0 14px",

  border:"none",

  borderRadius:10,

  background:"#16a34a",

  color:"#fff",

  cursor:"pointer",

  fontWeight:700

};


const deleteBtn:React.CSSProperties = {

  height:38,

  padding:"0 14px",

  border:"none",

  borderRadius:10,

  background:"#dc2626",

  color:"#fff",

  cursor:"pointer",

  fontWeight:700

};