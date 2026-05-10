"use client";

import { useEffect, useRef, ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale";

interface Props {
  children: ReactNode;
  variant?: Variant;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  threshold?: number;
  style?: React.CSSProperties;
}

const variantClass: Record<Variant, string> = {
  up:    "reveal",
  left:  "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

export function AnimateOnScroll({
  children,
  variant = "up",
  delay = 0,
  className = "",
  threshold = 0.12,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={`${variantClass[variant]} ${delayClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

/* ─── Hook for manual use ─────────────────────────────────
   Usage: const [ref, inView] = useInViewReveal()
   Then: <div ref={ref} className={`reveal ${inView ? "in-view" : ""}`}>
──────────────────────────────────────────────────────── */
export function useInViewReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
