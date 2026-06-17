"use client";

import { useState } from "react";

export default function AdminBlogs() {
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

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

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    try {
      setLoading(true);

      await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Blog Added Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-page">
        <div className="blog-card">
          <h1>Add New Blog</h1>

          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              value={form.s}
              onChange={(e) => handleChange("s", e.target.value)}
              placeholder="blog-slug"
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.t}
              onChange={(e) => handleChange("t", e.target.value)}
              placeholder="Blog Title"
            />
          </div>

          <div className="form-group">
            <label>Excerpt</label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              placeholder="Short summary of the blog..."
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={form.cat}
                onChange={(e) => handleChange("cat", e.target.value)}
                placeholder="Technology"
              />
            </div>

            <div className="form-group">
              <label>Read Time</label>
              <input
                type="text"
                value={form.r}
                onChange={(e) => handleChange("r", e.target.value)}
                placeholder="5 min read"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Publish Date</label>
              <input
                type="date"
                value={form.d}
                onChange={(e) => handleChange("d", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Featured Image URL</label>
              <input
                type="text"
                value={form.img}
                onChange={(e) => handleChange("img", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={form.feat}
              onChange={(e) => handleChange("feat", e.target.checked)}
            />
            <label>Featured Blog</label>
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              rows={12}
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Write your blog content here..."
            />
          </div>

          <button className="save-btn" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Save Blog"}
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

        .blog-card {
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

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .checkbox-group label {
          font-weight: 500;
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

          .blog-card {
            padding: 20px;
          }
        }
      `}</style>
    </>
=======
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
>>>>>>> 2011411 (updated code)
  );
}
