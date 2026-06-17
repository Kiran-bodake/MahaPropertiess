"use client";

import { useEffect } from "react";

import { useLocationStore } from "@/store/useLocationStore";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLocation, setLoading } = useLocationStore();

  useEffect(() => {
    async function detectLocation() {
      try {
        const res = await fetch("/api/location");

        const data = await res.json();

        if (data?.location?.city) {
          setLocation(data.location.city, data.location.lat, data.location.lng);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  return <>{children}</>;
}
