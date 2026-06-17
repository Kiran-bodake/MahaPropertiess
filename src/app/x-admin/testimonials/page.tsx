"use client";

import { useState } from "react";

export default function AdminTestimonials() {
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    n: "",
    r: "",
    lc: "",
    txt: "",
    av: "",
    pImg: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    try {
      setLoading(true);

      await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Testimonial Added Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-page">
        <div className="testimonial-card">
          <h1>Add Testimonial</h1>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={form.n}
              onChange={(e) => handleChange("n", e.target.value)}
              placeholder="Client Name"
            />
          </div>

          <div className="form-group">
            <label>Role / Position</label>
            <input
              type="text"
              value={form.r}
              onChange={(e) => handleChange("r", e.target.value)}
              placeholder="CEO, Developer, Founder..."
            />
          </div>

          <div className="form-group">
            <label>Location / Company</label>
            <input
              type="text"
              value={form.lc}
              onChange={(e) => handleChange("lc", e.target.value)}
              placeholder="New York, USA"
            />
          </div>

          <div className="form-group">
            <label>Review</label>
            <textarea
              rows={6}
              value={form.txt}
              onChange={(e) => handleChange("txt", e.target.value)}
              placeholder="Write the testimonial..."
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="text"
                value={form.av}
                onChange={(e) => handleChange("av", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="text"
                value={form.pImg}
                onChange={(e) => handleChange("pImg", e.target.value)}
                placeholder="https://example.com/profile.jpg"
              />
            </div>
          </div>

          <button className="save-btn" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Save Testimonial"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f4f6f9;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }

        .testimonial-card {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        h1 {
          margin-bottom: 30px;
          color: #222;
          font-size: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d6d6d6;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .row {
          display: flex;
          gap: 20px;
        }

        .row .form-group {
          flex: 1;
        }

        .save-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .save-btn:hover {
          background: #1d4ed8;
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .row {
            flex-direction: column;
            gap: 0;
          }

          .testimonial-card {
            padding: 20px;
          }
        }
      `}</style>
    </>
=======
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
>>>>>>> 2011411 (updated code)
  );
}
