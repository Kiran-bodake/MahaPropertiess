"use client";

import React, { useEffect, useState } from "react";

type InquiryStatus =
  | "new"
  | "contacted"
  | "interested"
  | "site-visit"
  | "negotiation"
  | "closed";

type Inquiry = {
  _id: string;
  customerName?: string;
  name?: string;
  phone?: string;
  mobileNumber?: string;
  email?: string;
  propertyTitle?: string;
  propertyName?: string;
  inquiryType?: string;
  message?: string;
  notes?: string;
  status: InquiryStatus;
  isRead: boolean;
  createdAt: string;
  nextFollowUp?: string | Date | null;
};

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  "site-visit": "Site Visit",
  negotiation: "Negotiation",
  closed: "Closed",
};

const statusStyles: Record<InquiryStatus, { bg: string; color: string; icon: string }> = {
  new: { bg: "#dbeafe", color: "#1e40af", icon: "🆕" },
  contacted: { bg: "#fef3c7", color: "#92400e", icon: "📞" },
  interested: { bg: "#dcfce7", color: "#166534", icon: "⭐" },
  "site-visit": { bg: "#fce7f3", color: "#831843", icon: "🏠" },
  negotiation: { bg: "#ede9fe", color: "#6d28d9", icon: "💼" },
  closed: { bg: "#f3e8ff", color: "#6b21a8", icon: "✅" },
};

export default function PropertyInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);

  // Drawer form state
  const [drawerStatus, setDrawerStatus] = useState<InquiryStatus>("new");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [drawerSaving, setDrawerSaving] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [drawerSuccess, setDrawerSuccess] = useState(false);
  const [nextFollowUp, setNextFollowUp] = useState<string>("");

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 10;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/property-inquiry");
      const result = await res.json();
      setInquiries(Array.isArray(result) ? result : result.inquiries || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openLead = async (lead: Inquiry) => {
    setSelectedLead(lead);
    setDrawerStatus(lead.status);
    setDrawerNotes(lead.notes || "");
    setNextFollowUp(
      lead.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().slice(0, 16) : ""
    );
    setDrawerError(null);
    setDrawerSuccess(false);

    // Mark lead as read
    if (!lead.isRead) {
      try {
        const response = await fetch(`/api/property-inquiry/${lead._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });

        if (response.ok) {
          setInquiries((prev) =>
            prev.map((item) =>
              item._id === lead._id ? { ...item, isRead: true } : item
            )
          );
        }
      } catch (error) {
        console.error("MARK READ ERROR:", error);
      }
    }
  };

  const closeLead = () => {
    setSelectedLead(null);
    setDrawerStatus("new");
    setDrawerNotes("");
    setDrawerError(null);
    setDrawerSuccess(false);
  };

  const saveLeadChanges = async () => {
    if (!selectedLead?._id) {
      setDrawerError("Missing inquiry ID. Please reopen the lead.");
      return;
    }

    setDrawerSaving(true);
    setDrawerError(null);
    setDrawerSuccess(false);

    try {
      const payload = {
        status: drawerStatus,
        notes: drawerNotes,
        nextFollowUp: nextFollowUp || null,
      };

      const response = await fetch(`/api/property-inquiry/${selectedLead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setDrawerError(result.message || "Failed to save changes.");
        return;
      }

      const updatedLead: Inquiry = {
        ...selectedLead,
        status: drawerStatus,
        notes: drawerNotes,
        nextFollowUp: payload.nextFollowUp,
      };

      setInquiries((prev) =>
        prev.map((item) => (item._id === selectedLead._id ? updatedLead : item))
      );

      setSelectedLead(updatedLead);
      setDrawerSuccess(true);

      setTimeout(() => {
        setDrawerSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("SAVE ERROR:", error);
      setDrawerError("Failed to save changes. Please try again.");
    } finally {
      setDrawerSaving(false);
    }
  };
  const convertToDeal = async (
  inquiryId: string
) => {
  try {
    const res = await fetch(
      "/api/admin/deals/convert",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inquiryId,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Deal created successfully");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to create deal");
  }
};

  const getCustomerName = (lead: Inquiry) => lead.customerName || lead.name || "-";
  const getPhone = (lead: Inquiry) => lead.phone || lead.mobileNumber || "-";
  const getProperty = (lead: Inquiry) => lead.propertyTitle || lead.propertyName || "-";

  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((lead) => lead.status === "new").length;
  const interestedLeads = inquiries.filter((lead) => lead.status === "interested").length;
  const closedLeads = inquiries.filter((lead) => lead.status === "closed").length;

  const filteredInquiries = inquiries
    .filter((lead) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        (lead.customerName || lead.name || "").toLowerCase().includes(search) ||
        (lead.phone || lead.mobileNumber || "").toLowerCase().includes(search) ||
        (lead.email || "").toLowerCase().includes(search) ||
        (lead.propertyTitle || lead.propertyName || "").toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const totalPages = Math.ceil(filteredInquiries.length / leadsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loaderStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ fontSize: 16, color: "#64748b", marginTop: 16 }}>Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Property Inquiries</h1>
          <p style={subtitleStyle}>Manage and track your customer inquiries efficiently</p>
        </div>
        <button onClick={fetchInquiries} style={refreshButtonStyle}>
          <span style={{ marginRight: 8 }}>🔄</span>
          Refresh
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div style={statsGridStyle}>
        <div style={{ ...statCardStyle, borderLeft: "4px solid #3b82f6" }}>
          <div style={statIconStyle}>📊</div>
          <div>
            <h4 style={statLabelStyle}>Total Leads</h4>
            <h2 style={statValueStyle}>{totalLeads}</h2>
          </div>
        </div>

        <div style={{ ...statCardStyle, borderLeft: "4px solid #f59e0b" }}>
          <div style={statIconStyle}>🆕</div>
          <div>
            <h4 style={statLabelStyle}>New Leads</h4>
            <h2 style={statValueStyle}>{newLeads}</h2>
          </div>
        </div>

        <div style={{ ...statCardStyle, borderLeft: "4px solid #10b981" }}>
          <div style={statIconStyle}>⭐</div>
          <div>
            <h4 style={statLabelStyle}>Interested</h4>
            <h2 style={statValueStyle}>{interestedLeads}</h2>
          </div>
        </div>

        <div style={{ ...statCardStyle, borderLeft: "4px solid #8b5cf6" }}>
          <div style={statIconStyle}>✅</div>
          <div>
            <h4 style={statLabelStyle}>Closed</h4>
            <h2 style={statValueStyle}>{closedLeads}</h2>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={filtersContainerStyle}>
        <div style={searchBoxStyle}>
          <span style={{ color: "#94a3b8", fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, phone, email or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="site-visit">Site Visit</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredInquiries.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📭</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            No inquiries found
          </h3>
          <p style={{ margin: "8px 0 0", color: "#64748b" }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInquiries.map((inquiry) => {
                const statusStyle = statusStyles[inquiry.status];
                return (
                  <tr
                    key={inquiry._id}
                    style={{
                      ...rowStyle,
                      backgroundColor: inquiry.isRead ? "#ffffff" : "#f0f9ff",
                    }}
                  >
                    <td style={tdStyle}>
                      <div style={customerCellStyle}>
                        <div style={avatarStyle}>
                          {getCustomerName(inquiry).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={customerNameStyle}>{getCustomerName(inquiry)}</div>
                          <div style={customerEmailStyle}>{inquiry.email || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={contactCellStyle}>
                        <span style={{ marginRight: 6 }}>📱</span>
                        {getPhone(inquiry)}
                      </div>
                    </td>
                    <td style={tdStyle}>{getProperty(inquiry)}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusBadgeStyle,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        <span style={{ marginRight: 6 }}>{statusStyle.icon}</span>
                        {statusLabels[inquiry.status]}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={dateCellStyle}>
                        {new Date(inquiry.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </td>
                   <td style={tdStyle}>
  <div
    style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={() => openLead(inquiry)}
      style={viewButtonStyle}
    >
      👁️ View
    </button>

    <button
      onClick={() =>
        convertToDeal(inquiry._id)
      }
      style={{
        padding: "8px 12px",
        border: "none",
        borderRadius: "8px",
        background: "#16a34a",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      💼 Convert
    </button>
  </div>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Previous
              </button>
              <span style={paginationInfoStyle}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PROFESSIONAL DRAWER */}
      {selectedLead && (
        <>
          <div style={overlayStyle} onClick={closeLead}></div>
          <div style={drawerStyle}>
            {/* DRAWER HEADER */}
            <div style={drawerHeaderStyle}>
              <div style={{ flex: 1 }}>
                <div style={drawerTitleContainerStyle}>
                  <h2 style={drawerTitleStyle}>Lead Details</h2>
                  {!selectedLead.isRead && (
                    <span style={unreadBadgeStyle}>New</span>
                  )}
                </div>
                <p style={drawerSubtitleStyle}>{getCustomerName(selectedLead)}</p>
              </div>
              <button onClick={closeLead} style={closeButtonStyle}>
                <span style={{ fontSize: 20 }}>✕</span>
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div style={drawerContentStyle}>
              {/* CUSTOMER INFO CARD */}
              <div style={drawerCardStyle}>
                <div style={cardHeaderStyle}>
                  <span style={cardIconStyle}>👤</span>
                  <h3 style={cardTitleStyle}>Customer Information</h3>
                </div>
                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <label style={labelStyle}>Full Name</label>
                    <p style={valueStyle}>{getCustomerName(selectedLead)}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <label style={labelStyle}>Phone Number</label>
                    <p style={valueStyle}>{getPhone(selectedLead)}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <label style={labelStyle}>Email Address</label>
                    <p style={valueStyle}>{selectedLead.email || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* PROPERTY INFO CARD */}
              <div style={drawerCardStyle}>
                <div style={cardHeaderStyle}>
                  <span style={cardIconStyle}>🏠</span>
                  <h3 style={cardTitleStyle}>Property Information</h3>
                </div>
                <div style={infoGridStyle}>
                  <div style={infoItemStyle}>
                    <label style={labelStyle}>Property</label>
                    <p style={valueStyle}>{getProperty(selectedLead)}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <label style={labelStyle}>Inquiry Type</label>
                    <p style={valueStyle}>{selectedLead.inquiryType || "General Inquiry"}</p>
                  </div>
                  <div style={infoItemStyle}>
                    <label style={labelStyle}>Inquiry Date</label>
                    <p style={valueStyle}>
                      {new Date(selectedLead.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS UPDATE CARD */}
              <div style={drawerCardStyle}>
                <div style={cardHeaderStyle}>
                  <span style={cardIconStyle}>📊</span>
                  <h3 style={cardTitleStyle}>Lead Status</h3>
                </div>
                <select
                  value={drawerStatus}
                  onChange={(e) => setDrawerStatus(e.target.value as InquiryStatus)}
                  style={modernSelectStyle}
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {statusStyles[key as InquiryStatus].icon} {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* FOLLOW UP CARD */}
              <div style={drawerCardStyle}>
                <div style={cardHeaderStyle}>
                  <span style={cardIconStyle}>📅</span>
                  <h3 style={cardTitleStyle}>Next Follow Up</h3>
                </div>
                <input
                  type="datetime-local"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  style={modernInputStyle}
                />
                {nextFollowUp && (
                  <p style={followUpHintStyle}>
                    Scheduled for: {new Date(nextFollowUp).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              {/* NOTES CARD */}
              <div style={drawerCardStyle}>
                <div style={cardHeaderStyle}>
                  <span style={cardIconStyle}>📝</span>
                  <h3 style={cardTitleStyle}>Internal Notes</h3>
                </div>
                <textarea
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add notes about this inquiry, customer preferences, or follow-up actions..."
                  style={modernTextareaStyle}
                />
              </div>

              {/* CUSTOMER MESSAGE CARD */}
              {selectedLead.message && (
                <div style={drawerCardStyle}>
                  <div style={cardHeaderStyle}>
                    <span style={cardIconStyle}>💬</span>
                    <h3 style={cardTitleStyle}>Customer Message</h3>
                  </div>
                  <div style={messageBoxStyle}>{selectedLead.message}</div>
                </div>
              )}

              {/* ALERTS */}
              {drawerError && (
                <div style={errorBoxStyle}>
                  <span style={{ marginRight: 8, fontSize: 18 }}>⚠️</span>
                  {drawerError}
                </div>
              )}
              {drawerSuccess && (
                <div style={successBoxStyle}>
                  <span style={{ marginRight: 8, fontSize: 18 }}>✓</span>
                  Changes saved successfully!
                </div>
              )}
            </div>

            {/* DRAWER FOOTER */}
            <div style={drawerFooterStyle}>
              <button
                onClick={saveLeadChanges}
                disabled={drawerSaving}
                style={{
                  ...primaryButtonStyle,
                  opacity: drawerSaving ? 0.7 : 1,
                  cursor: drawerSaving ? "not-allowed" : "pointer",
                }}
              >
                <span style={{ marginRight: 8 }}>{drawerSaving ? "⏳" : "💾"}</span>
                {drawerSaving ? "Saving..." : "Save Changes"}
              </button>

              <div style={actionButtonsGridStyle}>
                <a href={`tel:${getPhone(selectedLead)}`} style={callButtonStyle}>
                  <span style={{ marginRight: 6 }}>📞</span>
                  Call
                </a>
                <a
                  href={`https://wa.me/91${getPhone(selectedLead).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={whatsappButtonStyle}
                >
                  <span style={{ marginRight: 6 }}>💬</span>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================
   STYLES - PROFESSIONAL & MODERN
   ============================================ */

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "32px",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
  flexWrap: "wrap",
  gap: "20px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "36px",
  fontWeight: "800",
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
};

const subtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: "15px",
  color: "#64748b",
  fontWeight: "500",
};

const refreshButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
  marginBottom: "32px",
};

const statCardStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "all 0.3s ease",
};

const statIconStyle: React.CSSProperties = {
  fontSize: "32px",
  width: "56px",
  height: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
};

const statLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const statValueStyle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: "32px",
  fontWeight: "800",
  color: "#0f172a",
};

const filtersContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  alignItems: "center",
  flexWrap: "wrap",
};

const searchBoxStyle: React.CSSProperties = {
  flex: 1,
  minWidth: "300px",
  background: "#ffffff",
  border: "2px solid #e2e8f0",
  borderRadius: "14px",
  padding: "0 18px",
  display: "flex",
  alignItems: "center",
  height: "52px",
  gap: "12px",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  transition: "all 0.3s ease",
};

const searchInputStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  background: "transparent",
  color: "#0f172a",
  fontWeight: "500",
};

const filterSelectStyle: React.CSSProperties = {
  height: "52px",
  minWidth: "160px",
  padding: "0 16px",
  borderRadius: "14px",
  border: "2px solid #e2e8f0",
  background: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  color: "#0f172a",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  transition: "all 0.3s ease",
};

const tableContainerStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(15, 23, 42, 0.08)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  padding: "18px 20px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "800",
  color: "#0f172a",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  borderBottom: "2px solid #e2e8f0",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #f1f5f9",
  transition: "all 0.2s ease",
};

const tdStyle: React.CSSProperties = {
  padding: "18px 20px",
  fontSize: "14px",
  color: "#334155",
  fontWeight: "500",
};

const customerCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatarStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  fontSize: "16px",
};

const customerNameStyle: React.CSSProperties = {
  fontWeight: "700",
  color: "#0f172a",
  fontSize: "14px",
};

const customerEmailStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "2px",
};

const contactCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontWeight: "600",
};

const dateCellStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#64748b",
};

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const viewButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "10px",
  border: "2px solid #dbeafe",
  background: "#eff6ff",
  color: "#1e40af",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "13px",
  transition: "all 0.2s ease",
};

const paginationStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  padding: "24px",
  borderTop: "2px solid #f1f5f9",
};

const paginationButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "10px",
  border: "2px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: "700",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const paginationInfoStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#64748b",
};

const emptyStateStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "24px",
  padding: "80px 40px",
  textAlign: "center",
  border: "2px dashed #e2e8f0",
  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
};

const loadingContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
};

const loaderStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const spinnerStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  border: "4px solid #e2e8f0",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

/* DRAWER STYLES */
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(4px)",
  zIndex: 999,
  animation: "fadeIn 0.3s ease",
};

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "520px",
  maxWidth: "100vw",
  height: "100vh",
  background: "#ffffff",
  boxShadow: "-12px 0 48px rgba(15, 23, 42, 0.2)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  animation: "slideInRight 0.3s ease",
};

const drawerHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "28px 32px",
  borderBottom: "2px solid #f1f5f9",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
};

const drawerTitleContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const drawerTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "26px",
  fontWeight: "800",
  color: "#0f172a",
  letterSpacing: "-0.5px",
};

const unreadBadgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: "6px",
  background: "#ef4444",
  color: "#ffffff",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
};

const drawerSubtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "600",
};

const closeButtonStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  border: "none",
  borderRadius: "12px",
  background: "#f1f5f9",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const drawerContentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "24px 32px",
  background: "#fafafa",
};

const drawerCardStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  marginBottom: "20px",
  boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
  paddingBottom: "16px",
  borderBottom: "2px solid #f1f5f9",
};

const cardIconStyle: React.CSSProperties = {
  fontSize: "24px",
  width: "44px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "800",
  color: "#0f172a",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const infoItemStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "15px",
  fontWeight: "600",
  color: "#0f172a",
};

const modernSelectStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  fontSize: "14px",
  color: "#0f172a",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s ease",
};

const modernInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  fontSize: "14px",
  color: "#0f172a",
  background: "#ffffff",
  fontWeight: "600",
  transition: "all 0.2s ease",
};

const followUpHintStyle: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
  padding: "10px 14px",
  background: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const modernTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "140px",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  fontSize: "14px",
  color: "#0f172a",
  fontFamily: "inherit",
  resize: "vertical",
  lineHeight: "1.6",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const messageBoxStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "2px solid #e2e8f0",
  color: "#334155",
  fontSize: "14px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontWeight: "500",
};

const errorBoxStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: "12px",
  background: "#fef2f2",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "700",
  border: "2px solid #fecaca",
  display: "flex",
  alignItems: "center",
  animation: "shake 0.5s ease",
};

const successBoxStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: "12px",
  background: "#f0fdf4",
  color: "#166534",
  fontSize: "14px",
  fontWeight: "700",
  border: "2px solid #bbf7d0",
  display: "flex",
  alignItems: "center",
  animation: "slideDown 0.3s ease",
};

const drawerFooterStyle: React.CSSProperties = {
  padding: "24px 32px",
  borderTop: "2px solid #f1f5f9",
  background: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 24px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "15px",
  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const actionButtonsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const callButtonStyle: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "2px solid #dcfce7",
  background: "#f0fdf4",
  color: "#166534",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const whatsappButtonStyle: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "2px solid #25d366",
  background: "#25d366",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

