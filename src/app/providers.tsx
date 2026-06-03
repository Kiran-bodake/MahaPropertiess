"use client";

import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch("/api/__init__");
  }, []);

  return children;
}