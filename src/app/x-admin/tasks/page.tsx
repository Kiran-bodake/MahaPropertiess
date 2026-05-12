"use client";

import { useEffect, useState } from "react";

type Task={
  _id:string;
  title:string;
  dueDate:string;
  completed:boolean;
  owner:string;
};

export default function TasksPage(){
  const [tasks,setTasks]=useState<Task[]>([]),
        [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    try{
      const r=await fetch("/api/admin/tasks");
      const d=await r.json();
      setTasks(d.tasks||[]);
    }finally{
      setLoading(false);
    }
  })()},[]);

  return(
    <div style={{padding:24,minHeight:"100vh",background:"#f8fafc",fontFamily:"Inter,sans-serif"}}>

      {/* Header */}
      <div style={{
        background:"#fff",
        border:"1px solid #e2e8f0",
        borderRadius:24,
        padding:24,
        marginBottom:20,
        boxShadow:"0 8px 24px rgba(15,23,42,.05)"
      }}>

        <div style={{
          fontSize:24,
          fontWeight:700,
          color:"#0f172a"
        }}>
          Task Management
        </div>

        <div style={{
          fontSize:13,
          color:"#64748b",
          marginTop:4
        }}>
          Track deadlines, reminders and work progress
        </div>

      </div>

      {/* Task List */}
      <div style={{
        background:"#fff",
        border:"1px solid #e2e8f0",
        borderRadius:24,
        padding:20,
        boxShadow:"0 8px 24px rgba(15,23,42,.05)"
      }}>

        {loading ? (

          <div style={{
            padding:20,
            color:"#64748b"
          }}>
            Loading tasks...
          </div>

        ) : (

          <div style={{
            display:"grid",
            gap:16
          }}>

            {tasks.map(x=>(

              <div
                key={x._id}
                style={{
                  border:"1px solid #e2e8f0",
                  borderRadius:20,
                  padding:20,
                  background:"#fff",
                  boxShadow:"0 4px 12px rgba(15,23,42,.03)"
                }}
              >

                {/* Top */}
                <div style={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  gap:12
                }}>

                  <div style={{
                    display:"flex",
                    alignItems:"center",
                    gap:12
                  }}>

                    {/* Avatar */}
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

                    {/* Info */}
                    <div>

                      <div style={{
                        fontSize:15,
                        fontWeight:600,
                        color:"#0f172a"
                      }}>
                        {x.title}
                      </div>

                      <div style={{
                        fontSize:12,
                        color:"#64748b",
                        marginTop:2
                      }}>
                        Assigned to {x.owner}
                      </div>

                    </div>

                  </div>

                  {/* Status */}
                  <span style={{
                    background:x.completed ? "#dcfce7" : "#fef3c7",
                    color:x.completed ? "#16a34a" : "#d97706",
                    padding:"6px 12px",
                    borderRadius:999,
                    fontSize:11,
                    fontWeight:600
                  }}>
                    {x.completed ? "Completed" : "Pending"}
                  </span>

                </div>

                {/* Footer */}
                <div style={{
                  marginTop:14,
                  fontSize:12,
                  color:"#64748b"
                }}>
                  Due on{" "}
                  <span style={{
                    color:"#334155",
                    fontWeight:600
                  }}>
                    {new Date(x.dueDate).toLocaleDateString()}
                  </span>
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}