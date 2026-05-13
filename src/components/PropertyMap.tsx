"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function LocationMarker({
  onSelect
}:{
  onSelect:(coords:any)=>void
}){

  const [position,setPosition]=useState<any>(null);

  useMapEvents({

    click(e){

      const coords={
        lat:e.latlng.lat,
        lng:e.latlng.lng
      };

      setPosition(coords);

      onSelect(coords);

    }

  });

  return position ? (
    <Marker position={position}/>
  ) : null;
}

export default function PropertyMap({
  onSelect
}:{
  onSelect:(coords:any)=>void
}){

  return(

    <MapContainer
      center={[19.9975,73.7898]}
      zoom={13}
      style={{
        width:"100%",
        height:"400px",
        borderRadius:"14px"
      }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onSelect={onSelect}/>

    </MapContainer>

  );
}