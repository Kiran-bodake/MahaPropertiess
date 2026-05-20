"use client";

import { useState } from "react";

export default function AdminBlogs() {
  const [form, setForm] = useState({
    s: "",

    t: "",

    excerpt: "",

    cat: "",

    d: "",

    r: "",

    img: "",

    feat: false,

    content: "",
  });

  const submit = async () => {
    await fetch("/api/blogs", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    });

    alert("Blog Added");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Add Blog</h1>

      <input placeholder="Slug" />

      <input placeholder="Title" />

      <textarea placeholder="Excerpt" />

      <button onClick={submit}>Save Blog</button>
    </div>
  );
}
