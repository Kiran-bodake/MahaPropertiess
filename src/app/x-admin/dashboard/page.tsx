"use client";

import { useEffect, useState } from "react";
import { BarChart2, Search, RefreshCw, Eye, Pencil, Trash2, Bell, ChevronLeft, ChevronRight } from "lucide-react";

const fmt=(d:string)=>new Intl.DateTimeFormat("en-GB").format(new Date(d));
const card={background:"#fff",border:"1px solid #e2e8f0",borderRadius:22,padding:20,boxShadow:"0 8px 24px rgba(15,23,42,.05)"};

export default function AdminDashboard(){
  const [stats,setStats]=useState({leads:0,deals:0,tasks:0}),
        [leads,setLeads]=useState<any[]>([]),
        [loading,setLoading]=useState(true),
        [query,setQuery]=useState(""),
        [page,setPage]=useState(1);

  const perPage=10;

  useEffect(()=>{(async()=>{
    try{
      const [s,l]=await Promise.all([fetch("/api/admin/dashboard"),fetch("/api/admin/leads")]);
      const sd=s.ok?await s.json():{}, ld=l.ok?await l.json():{};
      setStats({leads:sd.leadsCount||0,deals:sd.dealsCount||0,tasks:sd.tasksCount||0});
      setLeads(ld.leads||[]);
    }finally{setLoading(false)}
  })()},[]);

  if(loading) return <div style={{padding:30}}>Loading...</div>;

  const conversion=stats.leads?Math.round((stats.deals/stats.leads)*100):0;
  const cards=[
    {label:"Total Leads",value:stats.leads,delta:"+12%"},
    {label:"Active Deals",value:stats.deals,delta:"+5%"},
    {label:"Tasks Due",value:stats.tasks,delta:"-3%"},
    {label:"Conversion",value:`${conversion}%`,delta:"+2%"}
  ];

  const filtered=leads.filter((x:any)=>
    !query || x.name?.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages=Math.max(1,Math.ceil(filtered.length/perPage));
  const paginated=filtered.slice((page-1)*perPage,page*perPage);

  return(
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"Inter,sans-serif"}}>

      {/* Header */}
      <div style={{background:"#fff",padding:"18px 28px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:20,fontWeight:700}}>Dashboard</div>
          <div style={{fontSize:12,color:"#64748b"}}>Leads & Analytics</div>
        </div>
        <Bell size={18} color="#64748b"/>
      </div>

      <div style={{padding:24}}>

        {/* Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:24}}>
          {cards.map(c=>(
            <div key={c.label} style={{...card,display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:12,color:"#64748b",fontWeight:600}}>{c.label}</div>
                <div style={{fontSize:34,fontWeight:700,marginTop:8}}>{c.value}</div>
                <div style={{fontSize:12,marginTop:8,color:c.delta.includes("-")?"#dc2626":"#16a34a"}}>{c.delta}</div>
              </div>
              <div style={{width:50,height:50,borderRadius:16,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <BarChart2 size={16} color="#4338ca"/>
              </div>
            </div>
          ))}
        </div>

        {/* Leads */}
        <div style={{...card,padding:0,overflow:"hidden"}}>

          {/* Toolbar */}
          <div style={{padding:22,borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:700,fontSize:16}}>Recent Leads ({filtered.length})</div>

            <div style={{display:"flex",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",border:"1px solid #e2e8f0",borderRadius:14}}>
                <Search size={13}/>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..." style={{border:"none",outline:"none"}}/>
              </div>

              <button style={{border:"1px solid #e2e8f0",background:"#fff",borderRadius:14,padding:"10px 14px"}}>
                <RefreshCw size={13}/>
              </button>
            </div>
          </div>

          {/* Rows */}
          {paginated.map((lead:any)=>(
            <div key={lead._id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",alignItems:"center",padding:"22px 24px",borderTop:"1px solid #f1f5f9",background:"#fff"}}>

              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:46,height:46,borderRadius:"50%",background:"#eef2ff",color:"#4338ca",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16}}>
                  {lead.name?.charAt(0)}
                </div>

                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{lead.name}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>Prospect Lead</div>
                </div>
              </div>

              <div style={{fontSize:13}}>{lead.contact||"—"}</div>
              <div style={{fontSize:13}}>{lead.source||"website"}</div>

              <div>
                <span style={{background:"#eef2ff",color:"#4338ca",padding:"6px 12px",borderRadius:999,fontSize:11,fontWeight:600}}>
                  {lead.status||"New"}
                </span>
              </div>

              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button style={{border:"none",background:"none"}}><Eye size={14}/></button>
                <button style={{border:"none",background:"none"}}><Pencil size={14}/></button>
                <button style={{border:"none",background:"none"}}><Trash2 size={14}/></button>
              </div>

            </div>
          ))}

          {/* Pagination */}
          <div style={{padding:20,borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:10}}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} style={{border:"none",background:"none"}}><ChevronLeft size={16}/></button>
            <div>{page}/{totalPages}</div>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} style={{border:"none",background:"none"}}><ChevronRight size={16}/></button>
          </div>

        </div>

      </div>
    </div>
  );
}