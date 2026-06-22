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
          <p className="header-subtitle">Manage your navigation menus and their structure</p>
        </div>
        <div className="header-right">
          <button onClick={() => fetchMenus()} className="btn btn-secondary">
            <span className="btn-icon">⟳</span>
            Refresh
          </button>
         <button 
  onClick={() => window.location.href = "/x-admin/menu/new"} 
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
                <th>Order</th>
                <th>Title</th>
                <th>Location</th>
                <th className="text-center">Desktop</th>
                <th className="text-center">Mobile</th>
                <th className="text-center">Active</th>
                <th>Parent</th>
                <th className="text-center">Actions</th>
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
              Showing <span className="footer-count">{menus.length}</span> menu items
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
          to { transform: rotate(360deg); }
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
        }

        /* Header */
        .menu-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
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
          gap: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-primary {
          background-color: #4f46e5;
          color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover {
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

        .btn-icon {
          font-size: 16px;
          line-height: 1;
        }

        /* Error Message */
        .error-message {
          margin-bottom: 24px;
          padding: 16px;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
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
          background-color: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        /* Table Styles */
        .menu-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .menu-table thead {
          background-color: #f9fafb;
        }

        .menu-table th {
          padding: 12px 24px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4b5563;
          border-bottom: 1px solid #e5e7eb;
        }

        .menu-table td {
          padding: 12px 24px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .menu-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .menu-table tbody tr:last-child td {
          border-bottom: none;
        }

        .text-center {
          text-align: center;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 48px 24px;
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
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Table Footer */
        .table-footer {
          padding: 12px 24px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .table-footer p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .footer-count {
          font-weight: 600;
          color: #374151;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .menu-page {
            padding: 16px;
          }

          .menu-header {
            flex-direction: column;
            gap: 16px;
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
            padding: 8px 12px;
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .menu-table th,
          .menu-table td {
            padding: 6px 8px;
            font-size: 12px;
          }

          .btn {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}