"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed-${slug}`;

    const lastViewed = localStorage.getItem(key);

    if (lastViewed) {
      const diff = Date.now() - Number(lastViewed);

      // Don't count again within 24 hours
      if (diff < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    fetch(`/api/properties/${slug}/view`, {
      method: "POST",
    }).catch(console.error);

    localStorage.setItem(key, Date.now().toString());
  }, [slug]);

  return null;
}
