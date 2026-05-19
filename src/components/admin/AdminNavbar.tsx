"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search, Settings, UserCircle2 } from "lucide-react";

const crumbs={
  "/x-admin":["Dashboard"],
  "/x-admin/leads":["Dashboard","Leads"],
  "/x-admin/deals":["Dashboard","Deals"],
  "/x-admin/tasks":["Dashboard","Tasks"],
  "/x-admin/properties":["Dashboard","Properties"]
};

const btn={
  border:"1px solid #e2e8f0",
  background:"#fff",
  borderRadius:14,
  cursor:"pointer"
};

const dropBtn={
  width:"100%",
  padding:12,
  border:"none",
  background:"transparent",
  textAlign:"left" as const,
  borderRadius:12,
  cursor:"pointer"
};

export function AdminNavbar(){

  const path=usePathname(),
        router=useRouter();

  const [query,setQuery]=useState(""),
      [open,setOpen]=useState(false),
      [mobile,setMobile]=useState(false),
      [showNotifications,setShowNotifications]=useState(false),
      [notifications,setNotifications]=useState<any[]>([]);

    const unreadNotifications =
  notifications.filter(
    x => !x.isRead
  );

  const breadcrumb=useMemo(
    ()=>crumbs[path as keyof typeof crumbs]||["Dashboard"],
    [path]
  );

  // Screen detect
  useEffect(()=>{
    const check=()=>setMobile(window.innerWidth<768);
    check();
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);

  useEffect(()=>{

  const fetchNotifications =
    async()=>{

      const res =
        await fetch(
          "/api/admin/notifications"
        );

      const data =
        await res.json();

      setNotifications(
        data.notifications || []
      );

    };

  fetchNotifications();

},[]);


  // Auth check
  useEffect(()=>{
    if(path==="/x-admin/login") return;

    (async()=>{
      const res=await fetch("/api/admin/auth/me");

      if(res.status===401){
        const refresh=await fetch("/api/admin/auth/refresh",{method:"POST"});

        if(!refresh.ok){
          router.push("/x-admin/login");
        }
      }
    })();

  },[path,router]);

  if(path==="/x-admin/login") return null;

  const logout=async()=>{
    await fetch("/api/admin/auth/logout",{method:"POST"});
    router.push("/x-admin/login");
  };

  const search=()=>{
    if(!query.trim()) return;
    router.push(`/x-admin/search?q=${encodeURIComponent(query)}`);
  };

const openNotification =
  async (item:any) => {

    console.log(
      "Clicked:",
      item
    );


    const res =
      await fetch(
        "/api/admin/notifications",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            referenceId:
              item.referenceId
          })
        }
      );

    const data =
      await res.json();

    console.log(
      "Backend response:",
      data
    );

    setNotifications(
      prev =>
        prev.map(
          x =>
            x.referenceId ===
            item.referenceId

              ? {
                  ...x,
                  isRead:true
                }

              : x
        )
    );
      setShowNotifications(false);
      router.push(
  `/x-admin/leads?id=${item.referenceId}`
);

  };



  return(
    <div style={{
      position:"sticky",
      top:0,
      zIndex:100,
      background:"#fff",
      borderBottom:"1px solid #e2e8f0",
      padding:mobile?"14px":"18px 28px"
    }}>

      <div style={{
        display:"flex",
        flexDirection:mobile?"column":"row",
        justifyContent:"space-between",
        alignItems:mobile?"stretch":"center",
        gap:mobile?14:0
      }}>

        {/* Left */}
        <div style={{
          display:"flex",
          flexDirection:mobile?"column":"row",
          alignItems:mobile?"flex-start":"center",
          gap:12
        }}>

          <div style={{
            background:"#eef2ff",
            color:"#4338ca",
            padding:"10px 16px",
            borderRadius:14,
            fontWeight:700,
            fontSize:13
          }}>
            Analytics
          </div>

          <div style={{
            color:"#64748b",
            fontSize:12
          }}>
            {breadcrumb.map((x,i)=>(
              <span key={x}>
                {i>0 && " › "} {x}
              </span>
            ))}
          </div>

        </div>

        {/* Right */}
        <div style={{
          display:"flex",
          flexDirection:mobile?"column":"row",
          alignItems:mobile?"stretch":"center",
          gap:10
        }}>

          {/* Search */}
          <div style={{
            position:"relative",
            width:mobile?"100%":320
          }}>
            <input
              value={query}
              onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && search()}
              placeholder="Search..."
              style={{
                width:"100%",
                height:44,
                border:"1px solid #e2e8f0",
                borderRadius:16,
                padding:"0 18px 0 42px",
                outline:"none",
                fontSize:13
              }}
            />

            <button
              onClick={search}
              style={{
                position:"absolute",
                left:14,
                top:13,
                border:"none",
                background:"none",
                cursor:"pointer"
              }}
            >
              <Search size={15} color="#64748b"/>
            </button>
          </div>

          {/* Hide preferences on mobile */}
          {!mobile && (
            <button style={{
              ...btn,
              padding:"10px 14px",
              display:"flex",
              alignItems:"center",
              gap:8
            }}>
              <Settings size={16}/>
              Preferences
            </button>
          )}

          {/* Notifications */}
         <div
  style={{
    position:"relative"
  }}
>

  <button
    onClick={()=>
      setShowNotifications(
        !showNotifications
      )
    }
    style={{
      ...btn,
      position:"relative",
      padding:10
    }}
  >

    <Bell size={18}/>

    {
      unreadNotifications.length > 0 && (

        <span
          style={{
            position:"absolute",
            top:5,
            right:5,
            minWidth:18,
            height:18,
            borderRadius:"50%",
            background:"#ef4444",
            color:"#fff",
            fontSize:10,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontWeight:700
          }}
        >

          {
            unreadNotifications.length
          }

        </span>

      )
    }

  </button>
  {
  showNotifications && (

    <div
      style={{
        position:"absolute",
        top:55,
        right:0,
        width:320,
        background:"#fff",
        border:"1px solid #e2e8f0",
        borderRadius:16,
        padding:12,
        boxShadow:
          "0 20px 40px rgba(0,0,0,.08)",
        zIndex:999
      }}
    >

      {

        notifications.length ?

          notifications.map(

            (item,index)=>(

              <div
  key={index}

  onClick={()=>
    openNotification(item)
  }

  style={{
    cursor:"pointer",
    padding:"12px 0",
    borderBottom:
      "1px solid #f1f5f9"
  }}
>

                <div
                  style={{
                    fontWeight:700,
                    fontSize:13
                  }}
                >
                  {
                    item.title
                  }
                </div>

                <div
                  style={{
                    fontSize:12,
                    color:"#64748b"
                  }}
                >
                  {
                    item.message
                  }
                </div>

              </div>

            )

          )

        :

          <div>
            No notifications
          </div>

      }

    </div>

  )  
}     


</div>

          {/* Profile */}
          <div style={{position:"relative"}}>

            <button
              onClick={()=>setOpen(!open)}
              style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                gap:8,
                border:"none",
                borderRadius:14,
                padding:"10px 14px",
                color:"#fff",
                fontWeight:600,
                cursor:"pointer",
                background:"linear-gradient(135deg,#4f46e5,#312e81)"
              }}
            >
              <UserCircle2 size={18}/>
              {!mobile && "Admin"}
            </button>

            {open && (

              <div style={{
                position:"absolute",
                top:58,
                right:0,
                width:180,
                background:"#fff",
                border:"1px solid #e2e8f0",
                borderRadius:16,
                padding:8,
                boxShadow:"0 20px 40px rgba(0,0,0,.08)"
              }}>

                <button style={dropBtn}>
                  Profile
                </button>

                <button style={dropBtn}>
                  Settings
                </button>

                <button
                  onClick={logout}
                  style={{
                    ...dropBtn,
                    color:"#dc2626",
                    display:"flex",
                    alignItems:"center",
                    gap:8
                  }}
                >
                  <LogOut size={15}/>
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}