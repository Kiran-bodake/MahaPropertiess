"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 1000);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  locality: string;
  city: string;
}

export default function PropertyMap({
  latitude,
  longitude,
  locality,
  city,
}: PropertyMapProps) {
  return (
    <div
      style={{
        width: "100%",
        height: 360,
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="property-map"
      >
        <FixMapSize />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>
            {locality}, {city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
