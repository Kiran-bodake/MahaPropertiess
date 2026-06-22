"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [menu, setMenu] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { id } = await params;
        const res = await fetch(`/api/menu/${id}`);
        const data = await res.json();
        setMenu(data);

        const menusRes = await fetch("/api/menu");
        const menusData = await menusRes.json();
        setMenus(menusData.filter((m: any) => m._id !== id));
      } catch (error) {
        console.error("Error fetching menu:", error);
        alert("Error loading menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [params]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/menu/${menu._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu),
      });

      if (res.ok) {
        alert("Menu updated successfully!");
        router.push("/x-admin/menu");
      } else {
        alert("Error updating menu. Please try again.");
      }
    } catch (error) {
      alert("Error updating menu. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="error-container">
        <div className="error-icon">🔍</div>
        <h2>Menu not found</h2>
        <p>The menu item you're looking for doesn't exist.</p>
        <button onClick={() => router.push("/x-admin/menu")} className="btn btn-primary">
          ← Back to Menus
        </button>
      </div>
    );
  }

  function renderOptions(parentId: string | null = null, level = 0): any[] {
    return menus
      .filter(
        (m) =>
          String(m.parentId || "") === String(parentId || "") &&
          m._id !== menu._id,
      )
      .flatMap((m) => [
        <option key={m._id} value={m._id}>
          {"—".repeat(level)} {m.title}
        </option>,
        ...renderOptions(m._id, level + 1),
      ]);
  }

  return (
    <div className="edit-menu-page">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div>
            <h1>
              <span className="header-icon">✏️</span>
              Edit Menu
            </h1>
            <p className="header-subtitle">
              Update menu item: <strong>{menu.title}</strong>
            </p>
          </div>
          <button 
            onClick={() => router.push("/x-admin/menu")} 
            className="btn btn-secondary"
          >
            ← Back to Menus
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
                  value={menu.title || ""}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      title: e.target.value,
                    })
                  }
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
                  value={menu.href || ""}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      href: e.target.value,
                    })
                  }
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
                  value={menu.cssClass || ""}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      cssClass: e.target.value,
                    })
                  }
                  className="form-input"
                />
                <small className="form-hint">Optional custom CSS class</small>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Brief description of this menu item"
                  value={menu.description || ""}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      description: e.target.value,
                    })
                  }
                  className="form-textarea"
                  rows={3}
                />
                <small className="form-hint">Optional description (SEO purposes)</small>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-right">
              {/* Parent Menu */}
              <div className="form-group">
                <label className="form-label">Parent Menu</label>
                <select
                  value={menu.parentId || ""}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      parentId: e.target.value || null,
                    })
                  }
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
                  value={menu.type || "custom"}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      type: e.target.value,
                    })
                  }
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

              {/* Location */}
              <div className="form-group">
                <label className="form-label required">Location</label>
                <select
                  value={menu.location || "header"}
                  onChange={(e) =>
                    setMenu({
                      ...menu,
                      location: e.target.value,
                    })
                  }
                  className="form-select"
                >
                  <option value="header">Header Menu</option>
                  <option value="footer">Footer Menu</option>
                </select>
                <small className="form-hint">Where to display this menu</small>
              </div>

              {/* Toggle Options */}
              <div className="form-group toggles-group">
                <label className="form-label">Visibility Settings</label>
                
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={menu.openInNewTab || false}
                    onChange={(e) =>
                      setMenu({
                        ...menu,
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
                    checked={menu.active || false}
                    onChange={(e) =>
                      setMenu({
                        ...menu,
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
                    checked={menu.showOnDesktop || false}
                    onChange={(e) =>
                      setMenu({
                        ...menu,
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
                    checked={menu.showOnMobile || false}
                    onChange={(e) =>
                      setMenu({
                        ...menu,
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
              onClick={() => router.push("/x-admin/menu")}
              className="btn btn-secondary btn-large"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-small"></span>
                  Updating...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Update Menu
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-menu-page {
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

        /* Loading State */
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-spinner p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Error State */
        .error-container {
          text-align: center;
          padding: 60px 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          max-width: 600px;
          margin: 40px auto;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-container h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          color: #111827;
        }

        .error-container p {
          margin: 0 0 20px 0;
          font-size: 14px;
          color: #6b7280;
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

        .header-subtitle strong {
          color: #111827;
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

        /* Responsive */
        @media (max-width: 768px) {
          .edit-menu-page {
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