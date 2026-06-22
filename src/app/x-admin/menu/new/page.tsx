"use client";

import { useEffect, useState } from "react";

export default function NewMenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    href: "",
    location: "header",
    parentId: "",
    type: "custom",
    cssClass: "",
    description: "",
    openInNewTab: false,
    active: true,
    showOnDesktop: true,
    showOnMobile: true,
  });

  useEffect(() => {
    async function fetchMenus() {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenus(data);
    }

    fetchMenus();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          parentId: form.parentId || null,
          body: JSON.stringify({
            ...form,
            parentId: form.parentId || null,
            order: menus.length + 1,
          }),
        }),
      });

      if (res.ok) {
        alert("Menu created successfully!");

        setForm({
          title: "",
          href: "",
          location: "header",
          parentId: "",
          type: "custom",
          cssClass: "",
          description: "",
          openInNewTab: false,
          active: true,
          showOnDesktop: true,
          showOnMobile: true,
        });

        const updatedMenus = await fetch("/api/menu").then((r) => r.json());
        setMenus(updatedMenus);
      }
    } catch (error) {
      alert("Error creating menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderOptions(parentId: string | null = null, level = 0): any[] {
    return menus
      .filter((m) => String(m.parentId || "") === String(parentId || ""))
      .flatMap((menu) => [
        <option key={menu._id} value={menu._id}>
          {"—".repeat(level)} {menu.title}
        </option>,
        ...renderOptions(menu._id, level + 1),
      ]);
  }

  return (
    <div className="new-menu-page">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div>
            <h1>
              <span className="header-icon">➕</span>
              Add New Menu
            </h1>
            <p className="header-subtitle">Create a new navigation menu item</p>
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            ← Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-left">
              {/* Title */}
              <div className="form-group">
                <label className="form-label required">Title</label>
                <input
                  type="text"
                  placeholder="Enter menu title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-input"
                  required
                />
                <small className="form-hint">Display name for the menu item</small>
              </div>

              {/* URL */}
              <div className="form-group">
                <label className="form-label">URL / Path</label>
                <input
                  type="text"
                  placeholder="/blogs"
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  className="form-input"
                />
                <small className="form-hint">Internal or external URL</small>
              </div>

              {/* CSS Class */}
              <div className="form-group">
                <label className="form-label">CSS Class</label>
                <input
                  type="text"
                  placeholder="custom-class"
                  value={form.cssClass}
                  onChange={(e) => setForm({ ...form, cssClass: e.target.value })}
                  className="form-input"
                />
                <small className="form-hint">Optional custom CSS class</small>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Brief description of this menu item"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-textarea"
                  rows={3}
                />
                <small className="form-hint">Optional description (SEO purposes)</small>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-right">
              {/* Location */}
              <div className="form-group">
                <label className="form-label required">Location</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="form-select"
                >
                  <option value="header">Header Menu</option>
                  <option value="footer">Footer Menu</option>
                </select>
                <small className="form-hint">Where to display this menu</small>
              </div>

              {/* Parent Menu */}
              <div className="form-group">
                <label className="form-label">Parent Menu</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="form-select"
                >
                  <option value="">None (Top Level)</option>
                  {renderOptions()}
                </select>
                <small className="form-hint">Make this a child of another menu</small>
              </div>

              {/* Type */}
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="form-select"
                >
                  <option value="custom">Custom</option>
                  <option value="category">Category</option>
                  <option value="city">City</option>
                  <option value="locality">Locality</option>
                  <option value="blog">Blog</option>
                  <option value="tool">Tool</option>
                </select>
                <small className="form-hint">Content type for this menu</small>
              </div>

              {/* Toggle Options */}
              <div className="form-group toggles-group">
                <label className="form-label">Visibility Settings</label>
                
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={form.openInNewTab}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        openInNewTab: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                  <span className="toggle-label">Open in new tab</span>
                  <span className="toggle-description">Opens link in a new browser tab</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        active: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                  <span className="toggle-label">Active</span>
                  <span className="toggle-description">Display this menu item</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={form.showOnDesktop}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        showOnDesktop: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                  <span className="toggle-label">Show on Desktop</span>
                  <span className="toggle-description">Visible on desktop screens</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={form.showOnMobile}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        showOnMobile: e.target.checked,
                      })
                    }
                    className="toggle-checkbox"
                  />
                  <span className="toggle-label">Show on Mobile</span>
                  <span className="toggle-description">Visible on mobile devices</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="btn btn-secondary btn-large"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Save Menu
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .new-menu-page {
          padding: 24px;
          max-width: 1280px;
          margin: 0 auto;
          min-height: 100vh;
          background: #f9fafb;
        }

        .form-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          padding: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Header */
        .form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-header h1 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .header-icon {
          font-size: 28px;
        }

        .header-subtitle {
          margin: 4px 0 0 40px;
          font-size: 14px;
          color: #6b7280;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          justify-content: center;
        }

        .btn-large {
          padding: 10px 24px;
          font-size: 16px;
          min-width: 120px;
        }

        .btn-primary {
          background-color: #4f46e5;
          color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #4338ca;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary {
          background-color: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background-color: #f9fafb;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 16px;
        }

        /* Form Grid */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .form-left,
        .form-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Form Groups */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-label.required::after {
          content: " *";
          color: #ef4444;
        }

        .form-hint {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          transition: all 0.2s ease;
          background-color: white;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Toggles Group */
        .toggles-group {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .toggle-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          cursor: pointer;
          border-bottom: 1px solid #e5e7eb;
        }

        .toggle-option:last-child {
          border-bottom: none;
        }

        .toggle-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
          accent-color: #4f46e5;
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          min-width: 140px;
        }

        .toggle-description {
          font-size: 13px;
          color: #6b7280;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        /* Spinner */
        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .new-menu-page {
            padding: 16px;
          }

          .form-container {
            padding: 20px;
          }

          .form-header {
            flex-direction: column;
            gap: 16px;
          }

          .form-header h1 {
            font-size: 24px;
          }

          .header-subtitle {
            margin-left: 36px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .toggle-label {
            min-width: 100px;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .form-container {
            padding: 16px;
          }

          .form-header h1 {
            font-size: 20px;
          }

          .toggle-option {
            flex-wrap: wrap;
          }

          .toggle-description {
            width: 100%;
            margin-left: 30px;
          }
        }
      `}</style>
    </div>
  );
}