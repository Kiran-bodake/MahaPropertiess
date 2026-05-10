"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    const el = wrapperRef.current;
    if (!el) return;

    // Reset and replay the entrance animation on route change
    el.style.animation = "none";
    void el.offsetHeight; // force reflow
    el.style.animation = "";
  }, [pathname]);

  return (
    <div ref={wrapperRef} style={{ animationFillMode: "both" }}>
      {children}
    </div>
  );
}
