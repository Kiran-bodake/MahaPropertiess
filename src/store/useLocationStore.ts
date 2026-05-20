"use client";

import { create } from "zustand";

type LocationState = {
  city: string;

  lat: number;

  lng: number;

  loading: boolean;

  setLocation: (city: string, lat: number, lng: number) => void;

  setLoading: (loading: boolean) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  city: "Nashik",

  lat: 19.9975,

  lng: 73.7898,

  loading: true,

  setLocation: (city, lat, lng) =>
    set({
      city,
      lat,
      lng,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),
}));
