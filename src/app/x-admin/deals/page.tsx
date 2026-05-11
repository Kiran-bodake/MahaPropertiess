"use client";

import { useEffect, useState } from "react";

type Deal={
  _id:string;
  title:string;
  value:number;
  status:string;
  updatedAt:string;
};

const badge=(s?:string)=>{
  const x=(s||"open").toLowerCase();

  return {
    open:{bg:"#dbeafe",c:"#2563eb"},
    won:{bg:"#dcfce7",c:"#16a34a"},
    lost:{bg:"#fee2e2",c:"#dc2626"}
  }[x]||{bg:"#f1f5f9",c:"#475569"};
};

export default function DealsPage(){
  const [deals,setDeals]=useState<Deal[]>([]),
        [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    try{
      const r=await fetch("/api/admin/deals");
      const d=await r.json();
      setDeals(d.deals||[]);
    }finally{
      setLoading(false);
    }
  })()},[]);

  return(
    <div style={{padding:24,minHeight:"100vh",background:"#f8fafc",fontFamily:"Inter,sans-serif"}}>

      {/* Top */}
      <div style={{
        background:"#fff",
        padding:24,
        borderRadius:24,
        border:"1px solid #e2e8f0",
        boxShadow:"0 8px 24px rgba(15,23,42,.05)",
        marginBottom:20
      }}>
        <div style={{fontSize:24,fontWeight:700,color:"#0f172a"}}>Deals Pipeline</div>

        <div style={{
          fontSize:13,
          color:"#64748b",
          marginTop:4
        }}>
          Manage opportunities, track revenue and close deals
        </div>
      </div>

      {/* Table */}
      <div style={{
        background:"#fff",
        borderRadius:24,
        border:"1px solid #e2e8f0",
        boxShadow:"0 8px 24px rgba(15,23,42,.05)",
        overflow:"hidden"
      }}>

        {loading ? (

          <div style={{padding:30,color:"#64748b"}}>
            Loading deals...
          </div>

        ) : (

          <div style={{overflowX:"auto"}}>

            {/* Header */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"2fr 1fr 1fr 1fr",
              padding:"18px 24px",
              background:"#f8fafc",
              borderBottom:"1px solid #e2e8f0",
              fontSize:12,
              fontWeight:700,
              color:"#475569"
            }}>
              <div>Deal Title</div>
              <div>Value</div>
              <div>Status</div>
              <div>Updated</div>
            </div>

            {/* Rows */}
            {deals.map(x=>{
              const s=badge(x.status);

              return(
                <div
                  key={x._id}
                  style={{
                    display:"grid",
                    gridTemplateColumns:"2fr 1fr 1fr 1fr",
                    padding:"20px 24px",
                    borderBottom:"1px solid #f1f5f9",
                    alignItems:"center"
                  }}
                >

                  {/* Title */}
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{
                      width:42,
                      height:42,
                      borderRadius:"50%",
                      background:"#eef2ff",
                      color:"#4338ca",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      fontWeight:700
                    }}>
                      {x.title?.charAt(0)}
                    </div>

                    <div>
                      <div style={{
                        fontSize:14,
                        fontWeight:600,
                        color:"#0f172a"
                      }}>
                        {x.title}
                      </div>

                      <div style={{
                        fontSize:12,
                        color:"#64748b"
                      }}>
                        Opportunity
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div style={{
                    fontSize:14,
                    fontWeight:600,
                    color:"#0f172a"
                  }}>
                    ₹{x.value?.toLocaleString() || 0}
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      background:s.bg,
                      color:s.c,
                      padding:"6px 12px",
                      borderRadius:999,
                      fontSize:11,
                      fontWeight:600
                    }}>
                      {x.status || "Open"}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{
                    fontSize:13,
                    color:"#64748b"
                  }}>
                    {new Date(x.updatedAt).toLocaleDateString()}
                  </div>

                </div>
              )
            })}

          </div>

        )}

      </div>

    </div>
  );
}