import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";
import { StickyContactForm } from "@/components/shared/StickyContactForm";
import { PropertyLeadForm } from "@/components/shared/PropertyLeadForm";
import { PropertyActions } from "@/components/property/PropertyActions";

export const dynamicParams = true;

async function getProperty(slug:string){
  const res = await fetch(`http://localhost:3000/api/properties/${slug}`,{ cache:"no-store" });
  if(!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }:{ params:Promise<{slug:string}> }):Promise<Metadata>{
  const { slug } = await params;
  const property = await getProperty(slug);
  if(!property) return { title:"Property Not Found" };
  return { title:`${property.title} | MahaProperties`, description:property.description };
}

export default async function PropertyDetailPage({ params }:{ params:Promise<{slug:string}> }){
  const { slug } = await params;
  const property = await getProperty(slug);
  if(!property) notFound();

  return (
    <>
      <Navbar />

      <main style={{ background:"#f8fafc" }}>
        <section style={{ maxWidth:1280, margin:"0 auto", padding:"24px 16px 64px" }}>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>

            {/* LEFT */}
            <article style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 10px 40px rgba(0,0,0,.05)" }}>

              {/* HERO */}
              {property.images?.length>0 && (
                <div style={{ position:"relative", height:420 }}>
                  <Image src={property.images[0]} alt={property.title} fill style={{ objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.7),transparent)" }} />
                  <div style={{ position:"absolute", left:24, bottom:24, color:"#fff" }}>
                    <div style={{ fontSize:"2rem", fontWeight:800 }}>₹{property.price.toLocaleString()}</div>
                    <div>{property.area} {property.areaUnit}</div>
                  </div>
                </div>
              )}

              <div style={{ padding:28 }}>

                {/* TITLE */}
                <h1 style={{ margin:0, fontSize:"2rem", fontWeight:800 }}>{property.title}</h1>

                <div style={{ marginTop:8, color:"#64748b" }}>
                  📍 {property.locality}, {property.city}, {property.state}
                </div>

                <PropertyActions
  propertyId={
    property.slug
  }
  propertyTitle={
    property.title
  }
/>

                {/* BADGES */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:16 }}>
                  {property.rera && <Badge label="RERA Approved" />}
                  {property.badge && <Badge label={property.badge} />}
                  <Badge label={property.status} />
                  <Badge label={property.constructionStatus} />
                </div>

                {/* INFO GRID */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:24 }}>
                  <InfoCard label="Category" value={property.category} />
                  <InfoCard label="Listed By" value={property.postedBy} />
                  <InfoCard label="Agent" value={property.agentName} />
                  <InfoCard label="Contact" value={property.agentPhone} />
                  <InfoCard label="Address" value={property.address} />
                  <InfoCard label="Listed On" value={new Date(property.createdAt).toLocaleDateString("en-IN")} />
                </div>

                {/* DESCRIPTION */}
                <SectionTitle title="Property Description" />
                <p style={{ color:"#475569", lineHeight:1.8 }}>{property.description}</p>

                {/* AMENITIES */}
                {property.amenities?.length>0 && (
                  <>
                    <SectionTitle title="Amenities" />
                    <ChipList items={property.amenities} icon="✓" />
                  </>
                )}

                {/* HIGHLIGHTS */}
                {property.highlights?.length>0 && (
                  <>
                    <SectionTitle title="Property Highlights" />
                    <ChipList items={property.highlights} icon="★" />
                  </>
                )}

                {/* MAP */}
                <SectionTitle title="Location" />
                <div style={{ borderRadius:14, overflow:"hidden", marginTop:12 }}>
                  <iframe
                    title="Location"
                    width="100%"
                    height="280"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.locality}, ${property.city}`)}&output=embed`}
                    style={{ border:0 }}
                  />
                </div>

                <div style={{ marginTop:24 }}>
                  <PropertyLeadForm propertyTitle={property.title} />
                </div>

              </div>

            </article>

            {/* RIGHT */}
            <aside>
              <div style={{ background:"#fff", borderRadius:20, padding:24, boxShadow:"0 10px 40px rgba(0,0,0,.05)" }}>
                <div style={{ fontSize:"1.1rem", fontWeight:700 }}>{property.agentName}</div>
                <div style={{ color:"#64748b", marginTop:6 }}>{property.agentPhone}</div>

                <div style={{ marginTop:20 }}>
                  <StickyContactForm title="Book Site Visit" description="Get callback in 30 minutes." />
                </div>
              </div>
            </aside>

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

function SectionTitle({ title }:{ title:string }){
  return <h3 style={{ marginTop:28, marginBottom:12, fontSize:"1.15rem", fontWeight:700 }}>{title}</h3>;
}

function Badge({ label }:{ label:string }){
  return <div style={{ background:"#eff6ff", color:"#1d4ed8", padding:"8px 14px", borderRadius:999, fontSize:".85rem", fontWeight:600 }}>{label}</div>;
}

function InfoCard({ label,value }:{ label:string,value:string }){
  return (
    <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:14, padding:14 }}>
      <div style={{ fontWeight:700 }}>{value}</div>
      <div style={{ color:"#64748b", marginTop:4, fontSize:".85rem" }}>{label}</div>
    </div>
  );
}

function ChipList({ items,icon }:{ items:string[],icon:string }){
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
      {items.map((item,index)=>(
        <div key={index} style={{ padding:"10px 16px", borderRadius:999, background:"#f8fafc", border:"1px solid #dbeafe", fontSize:".9rem", fontWeight:500 }}>
          {icon} {item}
        </div>
      ))}
    </div>
  );
}