"use client";

import { useState } from "react";

export default function AdminTestimonials() {
  const [form, setForm] = useState({
    n: "",

    r: "",

    lc: "",

    txt: "",

    av: "",

    pImg: "",
  });

  const submit = async () => {
    await fetch("/api/testimonials", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    });

    alert("Testimonial Added");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Add Testimonial</h1>

      <input placeholder="Name" />

      <textarea placeholder="Review" />

      <button onClick={submit}>Save</button>
    </div>
  );
}
