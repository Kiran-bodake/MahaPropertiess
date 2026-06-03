"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  User,
  Calendar,
} from "lucide-react";

interface ContactInquiry {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

type FilterStatus = "all" | "unread" | "read";
type SortField = "date" | "name" | "status";
type SortOrder = "asc" | "desc";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const itemsPerPage = 10;

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
    try {
      const response = await fetch("/api/contact-inquiry");
      const data = await response.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotification("error", "Failed to fetch inquiries");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Filter and sort inquiries
  useEffect(() => {
    let result = [...inquiries];

    // Status filter
    if (statusFilter === "unread") {
      result = result.filter((item) => !item.isRead);
    } else if (statusFilter === "read") {
      result = result.filter((item) => item.isRead);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.fullName?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.phone?.toLowerCase().includes(query) ||
          item.message?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case "status":
          comparison = Number(a.isRead) - Number(b.isRead);
          break;
        case "date":
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredInquiries(result);
    setCurrentPage(1);
  }, [inquiries, searchQuery, statusFilter, sortField, sortOrder]);

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle read status
  const toggleReadStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-inquiry/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !inquiries.find((i) => i._id === id)?.isRead }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isRead: !item.isRead } : item
          )
        );
        showNotification("success", "Status updated successfully");
      }
    } catch (error) {
      showNotification("error", "Failed to update status");
    }
  };

  // Delete inquiry
  const deleteInquiry = async (id: string) => {
    try {
      const response = await fetch(`/api/contact-inquiry/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        setShowDeleteConfirm(null);
        showNotification("success", "Inquiry deleted successfully");
      }
    } catch (error) {
      showNotification("error", "Failed to delete inquiry");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = inquiries.filter((i) => !i.isRead).map((i) => i._id);
      if (unreadIds.length === 0) return;

      const response = await fetch("/api/contact-inquiry/bulk-update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds, isRead: true }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((item) => ({ ...item, isRead: true }))
        );
        showNotification("success", "All marked as read");
      }
    } catch (error) {
      showNotification("error", "Failed to update inquiries");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Phone", "Email", "Message", "Status", "Date"];
    const rows = filteredInquiries.map((item) => [
      item.fullName,
      item.phone,
      item.email,
      item.message,
      item.isRead ? "Read" : "Unread",
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification("success", "CSV exported successfully");
  };

  // Pagination
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const unreadCount = inquiries.filter((i) => !i.isRead).length;
  const readCount = inquiries.filter((i) => i.isRead).length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Notification */}
      {notification && (
        <div
          style={{
            ...styles.notification,
            backgroundColor:
              notification.type === "success" ? "#ecfdf5" : "#fef2f2",
            borderColor:
              notification.type === "success" ? "#bbf7d0" : "#fecaca",
            color:
              notification.type === "success" ? "#166534" : "#dc2626",
          }}
        >
          {notification.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            style={styles.notificationClose}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Contact Inquiries</h1>
          <p style={styles.subtitle}>
            Manage and track all incoming customer inquiries
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchInquiries();
            }}
            style={styles.iconButton}
            title="Refresh"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>

          <button onClick={exportToCSV} style={styles.exportButton}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}>
          <div style={{ ...styles.statIcon, backgroundColor: "#dbeafe" }}>
            <Mail size={20} color="#2563eb" />
          </div>
          <div>
            <div style={styles.statValue}>{inquiries.length}</div>
            <div style={styles.statLabel}>Total Inquiries</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
          <div style={{ ...styles.statIcon, backgroundColor: "#fee2e2" }}>
            <AlertCircle size={20} color="#dc2626" />
          </div>
          <div>
            <div style={styles.statValue}>{unreadCount}</div>
            <div style={styles.statLabel}>Unread</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, backgroundColor: "#ecfdf5", borderColor: "#bbf7d0" }}>
          <div style={{ ...styles.statIcon, backgroundColor: "#dcfce7" }}>
            <CheckCircle size={20} color="#16a34a" />
          </div>
          <div>
            <div style={styles.statValue}>{readCount}</div>
            <div style={styles.statLabel}>Read</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={styles.filtersBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by name, email, phone or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={styles.clearSearch}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={styles.filterButtons}>
          <button
            onClick={() => setStatusFilter("all")}
            style={{
              ...styles.filterButton,
              ...(statusFilter === "all" ? styles.filterButtonActive : {}),
            }}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("unread")}
            style={{
              ...styles.filterButton,
              ...(statusFilter === "unread" ? styles.filterButtonActive : {}),
            }}
          >
            Unread
          </button>
          <button
            onClick={() => setStatusFilter("read")}
            style={{
              ...styles.filterButton,
              ...(statusFilter === "read" ? styles.filterButtonActive : {}),
            }}
          >
            Read
          </button>
        </div>

        <div style={styles.sortControls}>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            style={styles.sortSelect}
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            style={styles.sortButton}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} style={styles.markAllButton}>
              <Eye size={14} />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Message</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.emptyState}>
                    <MessageSquare size={48} color="#d1d5db" />
                    <p style={styles.emptyTitle}>No inquiries found</p>
                    <p style={styles.emptySubtitle}>
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "No contact inquiries yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedInquiries.map((item) => {
                  const isUnread = !item.isRead;

                  return (
                    <tr
                      key={item._id}
                      style={{
                        ...styles.tr,
                        backgroundColor: isUnread ? "#f8faff" : "#ffffff",
                        borderLeft: isUnread
                          ? "4px solid #3b82f6"
                          : "4px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isUnread
                          ? "#f8faff"
                          : "#ffffff";
                      }}
                    >
                      {/* Name */}
                      <td style={styles.tdName}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>
                            <User size={16} />
                          </div>
                          <div>
                            <div
                              style={{
                                ...styles.nameText,
                                fontWeight: isUnread ? 700 : 600,
                              }}
                            >
                              {item.fullName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td style={styles.td}>
                        <a
                          href={`tel:${item.phone}`}
                          style={styles.phoneLink}
                        >
                          <Phone size={14} />
                          {item.phone}
                        </a>
                      </td>

                      {/* Email */}
                      <td style={styles.td}>
                        <a
                          href={`mailto:${item.email}`}
                          style={styles.emailLink}
                        >
                          <Mail size={14} />
                          {item.email}
                        </a>
                      </td>

                      {/* Message Preview */}
                      <td
                        style={styles.tdMessage}
                        onClick={() => setSelectedInquiry(item)}
                      >
                        <div style={styles.messagePreview}>
                          <MessageSquare size={14} color="#9ca3af" />
                          <span>{item.message}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          <Calendar size={14} color="#9ca3af" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: isUnread ? "#dbeafe" : "#dcfce7",
                            color: isUnread ? "#1e40af" : "#166534",
                            border: `1px solid ${
                              isUnread ? "#bfdbfe" : "#bbf7d0"
                            }`,
                          }}
                        >
                          {isUnread ? (
                            <AlertCircle size={12} />
                          ) : (
                            <CheckCircle size={12} />
                          )}
                          {isUnread ? "New" : "Read"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            onClick={() => toggleReadStatus(item._id)}
                            style={styles.actionButton}
                            title={isUnread ? "Mark as read" : "Mark as unread"}
                          >
                            {isUnread ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>

                          <a
                            href={`tel:${item.phone}`}
                            style={styles.callButton}
                          >
                            <Phone size={14} />
                            Call
                          </a>

                          <button
                            onClick={() => setShowDeleteConfirm(item._id)}
                            style={styles.deleteButton}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <div style={styles.paginationInfo}>
              Showing{" "}
              <strong>
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredInquiries.length)}
              </strong>{" "}
              of <strong>{filteredInquiries.length}</strong> inquiries
            </div>

            <div style={styles.paginationButtons}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  ...styles.pageButton,
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <div key={page} style={{ display: "flex", gap: "4px" }}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span style={styles.pageEllipsis}>...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      style={{
                        ...styles.pageButton,
                        backgroundColor:
                          currentPage === page ? "#3b82f6" : "#ffffff",
                        color: currentPage === page ? "#ffffff" : "#374151",
                        borderColor:
                          currentPage === page ? "#3b82f6" : "#e5e7eb",
                      }}
                    >
                      {page}
                    </button>
                  </div>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  ...styles.pageButton,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedInquiry && (
        <div style={styles.modalOverlay} onClick={() => setSelectedInquiry(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Message Details</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={styles.modalClose}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalField}>
                <label style={styles.modalLabel}>From</label>
                <p style={styles.modalValue}>{selectedInquiry.fullName}</p>
              </div>

              <div style={styles.modalField}>
                <label style={styles.modalLabel}>Email</label>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  style={styles.modalLink}
                >
                  {selectedInquiry.email}
                </a>
              </div>

              <div style={styles.modalField}>
                <label style={styles.modalLabel}>Phone</label>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  style={styles.modalLink}
                >
                  {selectedInquiry.phone}
                </a>
              </div>

              <div style={styles.modalField}>
                <label style={styles.modalLabel}>Message</label>
                <div style={styles.modalMessage}>
                  {selectedInquiry.message}
                </div>
              </div>

              <div style={styles.modalField}>
                <label style={styles.modalLabel}>Received</label>
                <p style={styles.modalValue}>
                  {new Date(selectedInquiry.createdAt).toLocaleString("en-IN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <a
                href={`tel:${selectedInquiry.phone}`}
                style={styles.modalCallButton}
              >
                <Phone size={16} />
                Call Now
              </a>
              <button
                onClick={() => {
                  toggleReadStatus(selectedInquiry._id);
                  setSelectedInquiry(null);
                }}
                style={styles.modalActionButton}
              >
                {selectedInquiry.isRead ? (
                  <>
                    <EyeOff size={16} />
                    Mark as Unread
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Mark as Read
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.confirmIcon}>
              <AlertCircle size={32} color="#ef4444" />
            </div>
            <h3 style={styles.confirmTitle}>Delete Inquiry</h3>
            <p style={styles.confirmText}>
              Are you sure you want to delete this inquiry? This action cannot
              be undone.
            </p>
            <div style={styles.confirmActions}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={styles.confirmCancel}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteInquiry(showDeleteConfirm)}
                style={styles.confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "32px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  // Loading
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "15px",
    fontWeight: 500,
  },

  // Notification
  notification: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    borderRadius: "12px",
    marginBottom: "24px",
    fontWeight: 600,
    fontSize: "14px",
    border: "1px solid",
    animation: "slideDown 0.3s ease",
  },
  notificationClose: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
    display: "flex",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    margin: 0,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
    fontWeight: 500,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  iconButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    transition: "all 0.2s ease",
  },
  exportButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    transition: "all 0.2s ease",
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    marginTop: "4px",
  },

  // Filters
  filtersBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: 1,
    minWidth: "280px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "0 16px",
    transition: "all 0.2s ease",
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: "transparent",
  },
  clearSearch: {
    position: "absolute",
    right: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    padding: "4px",
    display: "flex",
  },
  filterButtons: {
    display: "flex",
    gap: "6px",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    padding: "4px",
  },
  filterButton: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    transition: "all 0.2s ease",
  },
  filterButtonActive: {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sortControls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  sortSelect: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
  },
  sortButton: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  markAllButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  // Table
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },
  th: {
    textAlign: "left",
    padding: "16px 20px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
  },
  tr: {
    transition: "background-color 0.15s ease",
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "16px 20px",
    fontSize: "13px",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
  },

  // Name cell
  tdName: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3b82f6",
    flexShrink: 0,
  },
  nameText: {
    fontSize: "14px",
    color: "#0f172a",
  },

  // Links
  phoneLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 500,
  },
  emailLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 500,
  },

  // Message
  tdMessage: {
    padding: "16px 20px",
    maxWidth: "250px",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
  },
  messagePreview: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6b7280",
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // Date
  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#6b7280",
  },

  // Status
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },

  // Actions
  actions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  actionButton: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    transition: "all 0.2s ease",
  },
  callButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  deleteButton: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ef4444",
    transition: "all 0.2s ease",
  },

  // Empty state
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#6b7280",
    marginTop: "16px",
    marginBottom: "4px",
  },
  emptySubtitle: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: 0,
  },

  // Pagination
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderTop: "1px solid #e2e8f0",
    flexWrap: "wrap",
    gap: "12px",
  },
  paginationInfo: {
    fontSize: "13px",
    color: "#6b7280",
  },
  paginationButtons: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  pageButton: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  pageEllipsis: {
    padding: "0 4px",
    color: "#9ca3af",
    fontSize: "14px",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    maxWidth: "560px",
    width: "100%",
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
    animation: "scaleIn 0.2s ease",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 28px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    padding: "4px",
    borderRadius: "8px",
    display: "flex",
  },
  modalBody: {
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalField: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  modalLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  modalValue: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  modalLink: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#2563eb",
    textDecoration: "none",
  },
  modalMessage: {
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#374151",
    lineHeight: 1.6,
    border: "1px solid #e2e8f0",
  },
  modalFooter: {
    display: "flex",
    gap: "12px",
    padding: "20px 28px",
    borderTop: "1px solid #e2e8f0",
  },
  modalCallButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
  },
  modalActionButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#f1f5f9",
    color: "#374151",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },

  // Confirm modal
  confirmModal: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    maxWidth: "420px",
    width: "100%",
    padding: "32px",
    textAlign: "center",
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
  },
  confirmIcon: {
    marginBottom: "16px",
  },
  confirmTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  confirmText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 24px 0",
    lineHeight: 1.5,
  },
  confirmActions: {
    display: "flex",
    gap: "12px",
  },
  confirmCancel: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },
  confirmDelete: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ef4444",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
  },
};