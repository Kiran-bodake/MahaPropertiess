"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed-${slug}`;

    if (localStorage.getItem(key)) return;

    fetch(`/api/properties/${slug}/view`, {
      method: "POST",
    }).catch(console.error);

    localStorage.setItem(key, Date.now().toString());
  }, [slug]);

  return null;
}
