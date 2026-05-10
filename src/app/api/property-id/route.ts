import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const counterPath = path.join(process.cwd(), "src/data/property-counter.json");

function clean(s: string, len: number) {
  return s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, len);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state    = searchParams.get("state")    ?? "";
  const city     = searchParams.get("city")     ?? "";
  const locality = searchParams.get("locality") ?? "";

  if (!state || !city || !locality) {
    return NextResponse.json({ error: "state, city and locality are required" }, { status: 400 });
  }

  const stateCode    = clean(state, 2);
  const cityCode     = clean(city, 2);
  const localityCode = clean(locality, 3);

  const data = JSON.parse(readFileSync(counterPath, "utf-8"));
  data.counter += 1;
  writeFileSync(counterPath, JSON.stringify(data, null, 2));

  const uniqueId    = String(data.counter).padStart(5, "0");
  const propertyId  = `${stateCode}-${cityCode}-${localityCode}-${uniqueId}`;

  return NextResponse.json({ propertyId, counter: data.counter });
}
