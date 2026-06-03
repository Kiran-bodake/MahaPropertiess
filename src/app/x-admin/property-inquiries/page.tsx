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

const statusStyles: Record<InquiryStatus, { bg: string; color: string }> = {
  new: { bg: "#eff6ff", color: "#1d4ed8" },
  contacted: { bg: "#fef3c7", color: "#92400e" },
  interested: { bg: "#ecfdf5", color: "#166534" },
  "site-visit": { bg: "#fce7f3", color: "#831843" },
  negotiation: { bg: "#ede9fe", color: "#6d28d9" },
  closed: { bg: "#f3e8ff", color: "#6b21a8" },
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
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] =
  useState("newest");

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
  console.log("OPEN LEAD:", lead);
  console.log("LEAD ID:", lead._id);
  console.log("FOLLOWUP FROM DB:", lead.nextFollowUp);

  setSelectedLead(lead);

  setDrawerStatus(lead.status);
  setDrawerNotes(lead.notes || "");

  // Load follow-up date from database into datetime picker
  setNextFollowUp(
    lead.nextFollowUp
      ? new Date(lead.nextFollowUp)
          .toISOString()
          .slice(0, 16)
      : ""
  );

  setDrawerError(null);
  setDrawerSuccess(false);

  // Mark lead as read
  if (!lead.isRead) {
    try {
      const response = await fetch(
        `/api/property-inquiry/${lead._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isRead: true,
          }),
        }
      );

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === lead._id
              ? { ...item, isRead: true }
              : item
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
    console.error("No lead ID found!");
    setDrawerError("Missing inquiry ID. Please reopen the lead.");
    return;
  }

  setDrawerSaving(true);
  setDrawerError(null);
  setDrawerSuccess(false);

  try {
    console.log("FOLLOWUP STATE:", nextFollowUp);

    const payload = {
      status: drawerStatus,
      notes: drawerNotes,
      nextFollowUp: nextFollowUp || null,
    };

    console.log("PAYLOAD:", payload);

    const response = await fetch(
      `/api/property-inquiry/${selectedLead._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("SERVER RESPONSE:", result);

    if (!response.ok || !result.success) {
      setDrawerError(
        result.message || "Failed to save changes."
      );
      return;
    }

    const updatedLead: Inquiry = {
      ...selectedLead,
      status: drawerStatus,
      notes: drawerNotes,
      nextFollowUp: payload.nextFollowUp,
    };

    setInquiries((prev) =>
      prev.map((item) =>
        item._id === selectedLead._id
          ? updatedLead
          : item
      )
    );

    setSelectedLead(updatedLead);

    setDrawerSuccess(true);

    setTimeout(() => {
      setDrawerSuccess(false);
    }, 2000);
  } catch (error) {
    console.error("SAVE ERROR:", error);
    setDrawerError(
      "Failed to save changes. Please try again."
    );
  } finally {
    setDrawerSaving(false);
  }
};

  const getCustomerName = (lead: Inquiry) =>
    lead.customerName || lead.name || "-";
  const getPhone = (lead: Inquiry) => lead.phone || lead.mobileNumber || "-";
  const totalLeads = inquiries.length;

const newLeads =
  inquiries.filter(
    (lead) => lead.status === "new"
  ).length;

const interestedLeads =
  inquiries.filter(
    (lead) => lead.status === "interested"
  ).length;

const closedLeads =
  inquiries.filter(
    (lead) => lead.status === "closed"
  ).length;
const filteredInquiries = inquiries
  .filter((lead) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (lead.customerName || lead.name || "")
        .toLowerCase()
        .includes(search) ||
      (lead.phone || lead.mobileNumber || "")
        .toLowerCase()
        .includes(search) ||
      (lead.email || "")
        .toLowerCase()
        .includes(search) ||
      (lead.propertyTitle || lead.propertyName || "")
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  })

  .sort((a, b) => {
    if (sortOrder === "newest") {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }

    return (
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
    );
  });
  const totalPages = Math.ceil(
  filteredInquiries.length / leadsPerPage
);

const paginatedInquiries =
  filteredInquiries.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  const getProperty = (lead: Inquiry) =>
    lead.propertyTitle || lead.propertyName || "-";




  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <p style={{ fontSize: 18, color: "#64748b" }}>Loading inquiries...</p>
      </div>
    );
  }



  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
       
        <div>
          <h1 style={titleStyle}>Property Inquiries</h1>
          <p style={subtitleStyle}>Manage customer inquiries professionally</p>
        </div>
        <button onClick={fetchInquiries} style={refreshButtonStyle}>
          🔄 Refresh
        </button>
      </div>
      {/* STATISTICS CARDS */}
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "24px",
  }}
>
  <div style={statCardStyle}>
    <h4>Total Leads</h4>
    <h2>{totalLeads}</h2>
  </div>

  <div style={statCardStyle}>
    <h4>New Leads</h4>
    <h2>{newLeads}</h2>
  </div>

  <div style={statCardStyle}>
    <h4>Interested</h4>
    <h2>{interestedLeads}</h2>
  </div>

  <div style={statCardStyle}>
    <h4>Closed</h4>
    <h2>{closedLeads}</h2>
  </div>
</div>
<div
  style={{
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    alignItems: "center",
  }}
>
  {/* SEARCH */}
  <div
    style={{
      flex: 1,
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "0 14px",
      display: "flex",
      alignItems: "center",
      height: "48px",
    }}
  >
    <span style={{ marginRight: "10px" }}>🔍</span>

    <input
      type="text"
      placeholder="Search name, phone, property..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        border: "none",
        outline: "none",
        width: "100%",
        fontSize: "14px",
        background: "transparent",
      }}
    />
  </div>

  {/* STATUS FILTER */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{
      height: "48px",
      minWidth: "180px",
      padding: "0 14px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      background: "#fff",
      fontSize: "14px",
      cursor: "pointer",
    }}
  >
    <option value="all">All Status</option>
    <option value="new">New</option>
    <option value="contacted">Contacted</option>
    <option value="interested">Interested</option>
    <option value="site-visit">Site Visit</option>
    <option value="negotiation">Negotiation</option>
    <option value="closed">Closed</option>
  </select>
</div>

      {/* EMPTY STATE */}
      {filteredInquiries.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: 50 }}>📭</div>
          <p>No inquiries found</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Property</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Action</th>
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
                      backgroundColor: inquiry.isRead ? "#ffffff" : "#e0f2fe",
                    }}
                  >
                    <td style={tdStyle}>{getCustomerName(inquiry)}</td>
                    <td style={tdStyle}>{getPhone(inquiry)}</td>
                    <td style={tdStyle}>{inquiry.email || "-"}</td>
                    <td style={tdStyle}>{getProperty(inquiry)}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusBadgeStyle,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                        }}
                      >
                        {statusLabels[inquiry.status]}
                      </span>
                    </td>
                  <td style={tdStyle}>
  {new Date(inquiry.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => openLead(inquiry)}
                        style={viewButtonStyle}
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}




      {/* LEAD DRAWER */}
      {selectedLead && (
        <div style={overlayStyle} onClick={closeLead}>
          <div
            style={drawerStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER */}
            <div style={drawerHeaderStyle}>
              <div>
                <h2 style={drawerTitleStyle}>Lead Details</h2>
                <p style={drawerSubtitleStyle}>{getCustomerName(selectedLead)}</p>
              </div>
              <button onClick={closeLead} style={closeButtonStyle}>
                ✕
              </button>
            </div>

            {/* CUSTOMER INFO */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Customer Information</h3>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Name</label>
                  <p style={valueStyle}>{getCustomerName(selectedLead)}</p>
                </div>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Phone</label>
                  <p style={valueStyle}>{getPhone(selectedLead)}</p>
                </div>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Email</label>
                  <p style={valueStyle}>{selectedLead.email || "-"}</p>
                </div>
              </div>
            </div>

            {/* PROPERTY INFO */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Property Information</h3>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Property</label>
                  <p style={valueStyle}>{getProperty(selectedLead)}</p>
                </div>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Inquiry Type</label>
                  <p style={valueStyle}>{selectedLead.inquiryType || "-"}</p>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Status</h3>
              <select
                value={drawerStatus}
                onChange={(e) => setDrawerStatus(e.target.value as InquiryStatus)}
                style={selectStyle}
              >
                <option value="new">{statusLabels.new}</option>
                <option value="contacted">{statusLabels.contacted}</option>
                <option value="interested">{statusLabels.interested}</option>
                <option value="site-visit">{statusLabels["site-visit"]}</option>
                <option value="negotiation">{statusLabels.negotiation}</option>
                <option value="closed">{statusLabels.closed}</option>
              </select>
            </div>
{/* NEXT FOLLOW UP */}
<div style={sectionStyle}>
  <h3 style={sectionTitleStyle}>Next Follow Up</h3>

  <input
    type="datetime-local"
    value={nextFollowUp}
    onChange={(e) => {
      console.log(
        "SELECTED FOLLOWUP:",
        e.target.value
      );

      setNextFollowUp(e.target.value);
    }}
    style={inputStyle}
  />
</div>


            {/* NOTES */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Notes</h3>
              <textarea
                value={drawerNotes}
                onChange={(e) => setDrawerNotes(e.target.value)}
                placeholder="Add notes about this inquiry..."
                style={textareaStyle}
              />
            </div>

            {/* MESSAGE */}
            {selectedLead.message && (
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Customer Message</h3>
                <div style={messageBoxStyle}>{selectedLead.message}</div>
              </div>
            )}

            {/* ERROR/SUCCESS */}
            {drawerError && (
              <div style={errorBoxStyle}>{drawerError}</div>
            )}
            {drawerSuccess && (
              <div style={successBoxStyle}>✓ Changes saved successfully</div>
            )}

            {/* ACTIONS */}
            <div style={actionsContainerStyle}>
              <button
                onClick={saveLeadChanges}
                disabled={drawerSaving}
                style={{
                  ...saveButtonStyle,
                  opacity: drawerSaving ? 0.7 : 1,
                }}
              >
                {drawerSaving ? "💾 Saving..." : "💾 Save Changes"}
              </button>
              <a
                href={`tel:${getPhone(selectedLead)}`}
                style={callButtonStyle}
              >
                📞 Call
              </a>
              <a
                href={`https://wa.me/91${getPhone(selectedLead).replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={whatsappButtonStyle}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* STYLES */
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "24px",
  background: "#f1f5f9",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "16px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "800",
  color: "#0f172a",
};

const subtitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "14px",
  color: "#64748b",
};

const refreshButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease",
};

const tableContainerStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #e2e8f0",
  overflow: "auto",
  boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "700",
  color: "#0f172a",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #e2e8f0",
  transition: "all 0.2s ease",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#334155",
};

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const viewButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "12px",
  transition: "all 0.2s ease",
};

const emptyStateStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "24px",
  padding: "50px",
  textAlign: "center",
  border: "1px solid #e2e8f0",
};

const loadingContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  color: "#64748b",
};

/* DRAWER STYLES */
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.5)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 999,
};

const drawerStyle: React.CSSProperties = {
  width: "450px",
  height: "100vh",
  background: "#ffffff",
  padding: "24px",
  overflowY: "auto",
  boxShadow: "-10px 0 30px rgba(15, 23, 42, 0.1)",
};

const drawerHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "24px",
  paddingBottom: "16px",
  borderBottom: "2px solid #e2e8f0",
};

const drawerTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "800",
  color: "#0f172a",
};

const drawerSubtitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "13px",
  color: "#64748b",
};

const closeButtonStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "none",
  borderRadius: "12px",
  background: "#f1f5f9",
  color: "#0f172a",
  fontSize: "20px",
  cursor: "pointer",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "24px",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: "14px",
  fontWeight: "700",
  color: "#0f172a",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
};

const infoItemStyle: React.CSSProperties = {
  display: "grid",
  gap: "4px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  fontWeight: "600",
  color: "#0f172a",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  color: "#0f172a",
  background: "#ffffff",
  cursor: "pointer",
  fontWeight: "600",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "120px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  color: "#0f172a",
  fontFamily: "inherit",
  resize: "vertical",
};

const messageBoxStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: "14px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const errorBoxStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "12px",
  border: "1px solid #fca5a5",
};

const successBoxStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  background: "#dcfce7",
  color: "#166534",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "12px",
  border: "1px solid #86efac",
};

const actionsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "24px",
  paddingTop: "24px",
  borderTop: "2px solid #e2e8f0",
};

const saveButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease",
};

const callButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#dcfce7",
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
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
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
const statCardStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  color: "#0f172a",
};