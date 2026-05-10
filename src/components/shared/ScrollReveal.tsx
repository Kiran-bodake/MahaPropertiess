"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const observe = () =>
      document
        .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
        .forEach((el) => !el.classList.contains("in-view") && io.observe(el));

    // Slight delay so the page has painted before we observe
    const t = setTimeout(observe, 60);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]); // re-run on every route change

  return null;
}
