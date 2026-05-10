"use client";

import { useEffect, useState } from "react";

export default function FavoritesCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    setCount(stored ? JSON.parse(stored).length : 0);
  }, []);

  return <span>{count}</span>;
}