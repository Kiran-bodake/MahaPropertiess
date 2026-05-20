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

        if (data?.location) {
          setLocation(
            data.location.city || "Nashik",
            data.location.lat || 19.9975,
            data.location.lng || 73.7898,
          );
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
