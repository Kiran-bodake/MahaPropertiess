"use client";

import { useEffect, useState } from "react";
import MenuRows from "@/components/admin/menu/MenuRows";

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menus");
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Header Section */}
      <div className="menu-header">
        <div className="header-left">
          <h1>
            <span className="menu-icon">☰</span>
            Menu Manager
          </h1>
          <p className="header-subtitle">
            Manage your navigation menus and their structure
          </p>
        </div>
        <div className="header-right">
          <button onClick={() => fetchMenus()} className="btn btn-secondary">
            <span className="btn-icon">⟳</span>
            Refresh
          </button>
          <button
            onClick={() => (window.location.href = "/x-admin/menu/new")}
            className="btn btn-primary"
          >
            <span className="btn-icon">+</span>
            Add Menu
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p className="error-title">Error loading menus</p>
          <p>{error}</p>
        </div>
      )}

      {/* Table Section */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th className="col-order">#</th>
                <th className="col-title">Title</th>
                <th className="col-location">Location</th>
                <th className="col-status text-center">Desktop</th>
                <th className="col-status text-center">Mobile</th>
                <th className="col-status text-center">Active</th>
                <th className="col-parent">Parent</th>
                <th className="col-actions text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <MenuRows menus={menus} />
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {menus.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">☰</div>
            <h3>No menus found</h3>
            <p>Get started by creating your first menu item.</p>
            <button className="btn btn-primary">
              <span className="btn-icon">+</span>
              Create Menu
            </button>
          </div>
        )}

        {/* Footer */}
        {menus.length > 0 && (
          <div className="table-footer">
            <p>
              Showing <span className="footer-count">{menus.length}</span> menu
              items
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
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
          to {
            transform: rotate(360deg);
          }
        }

        .loading-spinner p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Main Container */
        .menu-page {
          padding: 24px;
          max-width: 1280px;
          margin: 0 auto;
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Header */
        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-left h1 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          font-size: 30px;
          font-weight: 700;
          color: #111827;
        }

        .menu-icon {
          font-size: 32px;
          color: #4f46e5;
        }

        .header-subtitle {
          margin: 4px 0 0 44px;
          font-size: 14px;
          color: #6b7280;
        }

        .header-right {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 14px;
          border: none;
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
        }

        .btn-secondary {
          background: white;
          border: 1px solid #e2e8f0;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .btn-icon {
          font-size: 16px;
          line-height: 1;
        }

        /* Error Message */
        .error-message {
          margin-bottom: 24px;
          padding: 16px 20px;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
        }

        .error-title {
          margin: 0 0 4px 0;
          font-weight: 600;
        }

        .error-message p {
          margin: 0;
          font-size: 14px;
        }

        /* Table Container */
        .table-container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Table Styles */
        .menu-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 800px;
        }

        .menu-table thead {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .menu-table th {
          padding: 14px 16px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .menu-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .menu-table tbody tr {
          transition: background-color 0.15s ease;
        }

        .menu-table tbody tr:hover {
          background: #f8fafc;
        }

        .menu-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* Column Widths */
        .col-order {
          width: 60px;
          text-align: center;
        }

        .col-title {
          width: 280px;
          min-width: 200px;
        }

        .col-location {
          width: 150px;
        }

        .col-status {
          width: 100px;
          text-align: center;
        }

        .col-parent {
          width: 150px;
        }

        .col-actions {
          width: 120px;
          text-align: center;
        }

        .text-center {
          text-align: center;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 64px 24px;
        }

        .empty-icon {
          font-size: 48px;
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 500;
          color: #111827;
        }

        .empty-state p {
          margin: 0 0 20px 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Table Footer */
        .table-footer {
          background: #fafafa;
          padding: 14px 24px;
          border-top: 1px solid #e2e8f0;
        }

        .table-footer p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .footer-count {
          font-weight: 600;
          color: #374151;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .menu-table {
            font-size: 13px;
            min-width: 700px;
          }

          .menu-table th,
          .menu-table td {
            padding: 10px 12px;
          }

          .col-title {
            width: 200px;
          }
        }

        @media (max-width: 768px) {
          .menu-page {
            padding: 16px;
          }

          .menu-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-left h1 {
            font-size: 24px;
          }

          .header-subtitle {
            margin-left: 40px;
          }

          .header-right {
            width: 100%;
          }

          .header-right .btn {
            flex: 1;
            justify-content: center;
          }

          .menu-table th,
          .menu-table td {
            padding: 8px 10px;
            font-size: 12px;
          }

          .menu-table {
            min-width: 600px;
          }
        }

        @media (max-width: 480px) {
          .menu-table th,
          .menu-table td {
            padding: 6px 8px;
            font-size: 11px;
          }

          .btn {
            padding: 8px 14px;
            font-size: 12px;
          }

          .menu-table {
            min-width: 500px;
          }
        }
      `}</style>
    </div>
  );
}
