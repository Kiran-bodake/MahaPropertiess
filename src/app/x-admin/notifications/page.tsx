"use client";

import { useState, useEffect } from "react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: "high" | "medium" | "low";
  isRead: boolean;
  createdAt: string;
  userType: string;
  metadata: any;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unreadCount: 0,
    leadCount: 0,
    inquiryCount: 0,
    callbackCount: 0,
    systemCount: 0,
  });
  const [filter, setFilter] = useState({
    type: "all",
    isRead: "all",
    priority: "all",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        ...(filter.type !== "all" && { type: filter.type }),
        ...(filter.isRead !== "all" && { isRead: filter.isRead }),
        ...(filter.priority !== "all" && { priority: filter.priority }),
      });

      const res = await fetch(`/api/admin/notifications?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, isRead: !currentStatus }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    try {
      await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
      fetchNotifications();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter, pagination.currentPage]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lead":
        return "📋";
      case "inquiry":
        return "❓";
      case "callback":
        return "📞";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="flex flex-wrap gap-4 mt-2">
          <span className="text-sm text-gray-600">📋 Total: {stats.total}</span>
          <span className="text-sm text-red-600">🔴 Unread: {stats.unreadCount}</span>
          <span className="text-sm text-blue-600">📋 Leads: {stats.leadCount}</span>
          <span className="text-sm text-yellow-600">❓ Inquiries: {stats.inquiryCount}</span>
          <span className="text-sm text-green-600">📞 Callbacks: {stats.callbackCount}</span>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="lead">📋 Leads</option>
            <option value="inquiry">❓ Inquiries</option>
            <option value="callback">📞 Callbacks</option>
            <option value="system">⚙️ System</option>
          </select>

          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={filter.isRead}
            onChange={(e) => setFilter({ ...filter, isRead: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="false">🔴 Unread</option>
            <option value="true">✅ Read</option>
          </select>

          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="all">All Priorities</option>
            <option value="high">⚠️ High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🔵 Low</option>
          </select>

          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Apply Filters
          </button>

          {stats.unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`bg-white rounded-lg shadow hover:shadow-md transition-all ${
                !notif.isRead ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    <div className="text-2xl">{getTypeIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`font-semibold ${!notif.isRead ? "text-gray-900" : "text-gray-600"}`}>
                          {notif.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notif.priority)}`}>
                          {notif.priority}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {notif.userType}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>🕐 {new Date(notif.createdAt).toLocaleString()}</span>
                        {notif.metadata?.phone && <span>📞 {notif.metadata.phone}</span>}
                        {notif.metadata?.email && <span>✉️ {notif.metadata.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif._id, notif.isRead)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}