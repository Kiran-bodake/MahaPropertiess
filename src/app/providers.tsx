"use client";

import { useEffect, ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // safe initialization place
    console.log("App initialized");
  }, []);

  return <>{children}</>;
}