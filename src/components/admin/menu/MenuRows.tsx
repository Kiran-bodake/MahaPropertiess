"use client";

import { Fragment, useState } from "react";

type Props = {
  menus: any[];
  parentId?: string | null;
  level?: number;
};

export default function MenuRows({ menus, parentId = null, level = 0 }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const children = menus.filter(
    (m) => String(m.parentId || "") === String(parentId || ""),
  );

  const handleDelete = async (menuId: string, title: string) => {
    if (!confirm(`Delete "${title}" ?`)) return;

    try {
      setDeletingId(menuId);
      const res = await fetch(`/api/menu/${menuId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete menu. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {children.map((menu) => (
        <Fragment key={menu._id}>
          <tr>
            {/* Order */}
            <td className="col-order text-center">
              <span className="order-badge">{menu.order}</span>
            </td>

            {/* Title */}
            <td className="col-title">
              <div
                className="title-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: `${level * 24}px`,
                  gap: level > 0 ? "8px" : "0px",
                }}
              >
                {level > 0 && (
                  <span
                    className="tree-indent"
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    ↳
                  </span>
                )}
                <span
                  className="menu-title"
                  style={{
                    fontWeight: level === 0 ? 600 : 400,
                    color: "#1f2937",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {menu.title}
                </span>
              </div>
            </td>

            {/* Location */}
            <td className="col-location">
              <span className="location-badge">{menu.location}</span>
            </td>

            {/* Desktop */}
            <td className="col-status text-center">
              <span
                className={`status-icon ${menu.showOnDesktop ? "active" : "inactive"}`}
              >
                {menu.showOnDesktop ? "✓" : "✕"}
              </span>
            </td>

            {/* Mobile */}
            <td className="col-status text-center">
              <span
                className={`status-icon ${menu.showOnMobile ? "active" : "inactive"}`}
              >
                {menu.showOnMobile ? "✓" : "✕"}
              </span>
            </td>

            {/* Active */}
            <td className="col-status text-center">
              {menu.active ? (
                <span className="status-badge active">✓ Active</span>
              ) : (
                <span className="status-badge inactive">✕ Disabled</span>
              )}
            </td>

            {/* Parent */}
            <td className="col-parent text-center">
              {menus.find((m) => String(m._id) === String(menu.parentId))
                ?.title || <span className="no-parent">—</span>}
            </td>

            {/* Actions */}
            <td className="col-actions">
              <div className="actions-wrapper">
                <a
                  href={`/x-admin/menu/${menu._id}`}
                  className="action-btn edit-btn"
                  title="Edit Menu"
                >
                  ✏️
                </a>

                <button
                  onClick={() => handleDelete(menu._id, menu.title)}
                  className={`action-btn delete-btn ${deletingId === menu._id ? "loading" : ""}`}
                  title="Delete Menu"
                  disabled={deletingId === menu._id}
                >
                  {deletingId === menu._id ? (
                    <span className="spinner-small"></span>
                  ) : (
                    "🗑️"
                  )}
                </button>
              </div>
            </td>
          </tr>

          <MenuRows menus={menus} parentId={menu._id} level={level + 1} />
        </Fragment>
      ))}

      <style jsx>{`
        .order-badge {
          display: inline-block;
          min-width: 28px;
          padding: 2px 8px;
          background: #f1f5f9;
          color: #475569;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          text-align: center;
        }

        .location-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          letter-spacing: 0.02em;
        }

        .status-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 700;
        }

        .status-icon.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-icon.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .no-parent {
          color: #94a3b8;
          font-size: 14px;
        }

        .actions-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        /* Plain Action Buttons with Shadows Only */
        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: 16px;
          background: transparent;
          padding: 0;
        }

        /* Edit Button - Plain with Shadow */
        .edit-btn {
          color: #4f46e5;
          box-shadow:
            0 2px 8px rgba(79, 70, 229, 0.15),
            0 4px 16px rgba(79, 70, 229, 0.1);
        }

        .edit-btn:active {
          transform: scale(0.92);
        }

        /* Delete Button - Plain with Shadow */
        .delete-btn {
          color: #dc2626;
          box-shadow:
            0 2px 8px rgba(220, 38, 38, 0.15),
            0 4px 16px rgba(220, 38, 38, 0.1);
        }

        .delete-btn:active:not(:disabled) {
          transform: scale(0.92);
        }

        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .delete-btn.loading {
          opacity: 0.7;
        }

        /* Loading Spinner for Delete */
        .spinner-small {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid #dc2626;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .menu-title {
          font-size: 14px;
          transition: color 0.15s ease;
        }

        tr:hover .menu-title {
          color: #4f46e5;
        }

        .tree-indent {
          font-weight: 300;
          opacity: 0.7;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .order-badge {
            min-width: 24px;
            padding: 1px 6px;
            font-size: 11px;
          }

          .location-badge {
            padding: 3px 10px;
            font-size: 11px;
          }

          .status-badge {
            padding: 3px 10px;
            font-size: 11px;
          }

          .action-btn {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .menu-title {
            font-size: 13px;
          }

          .actions-wrapper {
            gap: 6px;
          }
        }

        @media (max-width: 480px) {
          .location-badge {
            padding: 2px 8px;
            font-size: 10px;
          }

          .status-badge {
            padding: 2px 8px;
            font-size: 10px;
          }

          .action-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
            border-radius: 8px;
          }

          .menu-title {
            font-size: 12px;
          }

          .actions-wrapper {
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}
