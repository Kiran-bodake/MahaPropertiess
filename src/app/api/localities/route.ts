import { NextResponse } from "next/server";
import properties from "@/moc-data/properties.json";

const LOCALITY_META: Record<
  string,
  {
    tp: string;
    img: string;
    hot?: boolean;
  }
> = {
  "Gangapur Road": {
    tp: "Premium Residential",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=75",
    hot: true,
  },
  Igatpuri: {
    tp: "Agriculture & Hills",
    img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=500&q=75",
    hot: true,
  },
  "Nashik Road": {
    tp: "Industrial Belt",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=75",
  },
  "Trimbak Road": {
    tp: "Spiritual & Farms",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=75",
  },
  "Meri Village": {
    tp: "NA Plot Investment",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&q=75",
    hot: true,
  },
  "Ambad MIDC": {
    tp: "Industrial Hub",
    img: "https://images.unsplash.com/photo-1565891741441-64926e441838?w=500&q=75",
  },
  "Pathardi Phata": {
    tp: "Emerging Zone",
    img: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=500&q=75",
  },
  "Indira Nagar": {
    tp: "Established Area",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=75",
  },
  Panchavati: {
    tp: "Heritage Locality",
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=75",
  },
  "College Road": {
    tp: "Education Hub",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=75",
  },
  Sinnar: {
    tp: "Industrial Corridor",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=75",
  },
  Ozar: {
    tp: "Airport Vicinity",
    img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=500&q=75",
  },
};

export async function GET() {
  const grouped: Record<string, number> = {};

  properties.forEach((p) => {
    const locality = p.loc.split(",")[0].trim();

    grouped[locality] = (grouped[locality] || 0) + 1;
  });

  const localities = Object.entries(grouped).map(([name, count]) => ({
    n: name,
    c: `${count}+`,
    ...(LOCALITY_META[name] || {
      tp: "Prime Location",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=75",
    }),
  }));

  return NextResponse.json(localities);
}
