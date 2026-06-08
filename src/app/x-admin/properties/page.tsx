// src/app/admin/properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Property = {
  _id: string;
  propertyId?: string;
  title: string;
  description?: string;
  category?: string;
  status: string;
  approvalStatus?: string;
  premium?: boolean;
  price?: number;
  city?: string;
  state?: string;
  locality?: string;
  agentName?: string;
  agentPhone?: string;
  createdAt?: string;
  image?: string;
  images?: string[];
};

type ThankYouMessage = {
  _id?: string;
  title: string;
  message: string;
  buttonText: string;
  backgroundColor: string;
  icon: string;
  isActive: boolean;
  createdAt?: string;
};

export default function PropertiesPage() {
  // Properties State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [mine, setMine] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Thank You Messages State
  const [messages, setMessages] = useState<ThankYouMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [editing, setEditing] = useState<ThankYouMessage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ThankYouMessage>({
    title: "Thank You!",
    message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
    buttonText: "Close",
    backgroundColor: "#16a34a",
    icon: "✓",
    isActive: false,
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<"properties" | "thankyou">("properties");

  // Load Properties
  async function loadProperties() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?approval=${filter}&mine=${mine}`);
      const data = await res.json();
      setProperties(data.properties ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }

  // Load Messages
  const fetchMessages = async () => {
    try {
      setMsgLoading(true);
      const res = await fetch("/api/thankyou-messages");
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "properties") {
      loadProperties();
    } else if (activeTab === "thankyou") {
      fetchMessages();
    }
  }, [activeTab, filter, mine]);

  // Property Actions
  const approveProperty = async (id: string) => {
    if (!confirm("Approve this property?")) return;
    try {
      const res = await fetch("/api/admin/properties/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Property approved!");
        await loadProperties();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve");
    }
  };

  const rejectProperty = async (id: string) => {
    if (!confirm("Reject this property?")) return;
    try {
      const res = await fetch("/api/admin/properties/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Property rejected!");
        await loadProperties();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject");
    }
  };

  // Message Actions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setMsgLoading(true);
      const url = editing?._id ? `/api/thankyou-messages?id=${editing._id}` : "/api/thankyou-messages";
      const method = editing?._id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editing ? "Message updated!" : "Message created!");
        resetForm();
        fetchMessages();
        setShowForm(false);
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save message");
    } finally {
      setMsgLoading(false);
    }
  };

  const handleEdit = (msg: ThankYouMessage) => {
    setEditing(msg);
    setForm(msg);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/thankyou-messages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Message deleted!");
        fetchMessages();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const res = await fetch(`/api/thankyou-messages?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Active message set!");
        fetchMessages();
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update active message");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "Thank You!",
      message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
      buttonText: "Close",
      backgroundColor: "#16a34a",
      icon: "✓",
      isActive: false,
    });
    setShowForm(false);
  };

  function formatPrice(price: number) {
    return `₹ ${Number(price || 0).toLocaleString("en-IN")}`;
  }

  const activeMessage = messages.find(m => m.isActive);

  return (
    <div className="admin-properties-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1 className="header-title">Property Management</h1>
          <p className="header-subtitle">Manage properties and thank you messages</p>
        </div>
        {activeTab === "properties" && (
          <button
            onClick={() => window.location.href = "/x-admin/post-property"}
            className="btn-primary"
          >
            + Post New Property
          </button>
        )}
        {activeTab === "thankyou" && !showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Create Message
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          🏠 Properties
        </button>
        <button
          className={`tab ${activeTab === "thankyou" ? "active" : ""}`}
          onClick={() => setActiveTab("thankyou")}
        >
          💬 Thank You Messages
        </button>
      </div>

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div className="properties-tab">
          {/* Filters */}
          <div className="filters">
            <div className="filter-buttons">
              <button
                onClick={() => setFilter("pending")}
                className={`filter-btn ${filter === "pending" ? "active-pending" : ""}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`filter-btn ${filter === "approved" ? "active-approved" : ""}`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`filter-btn ${filter === "rejected" ? "active-rejected" : ""}`}
              >
                Rejected
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`filter-btn ${filter === "all" ? "active-all" : ""}`}
              >
                All
              </button>
            </div>
            <label className="mine-checkbox">
              <input type="checkbox" checked={mine} onChange={() => setMine(prev => !prev)} />
              My Properties
            </label>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <div key={property._id} className="property-card">
                  {/* Image */}
                  <div className="property-image" onClick={() => {
                    setGalleryImages(property.images?.length ? property.images : [property.image || "/maha.png"]);
                    setActiveImage(0);
                    setShowGallery(true);
                  }}>
                    <img src={property.image || "/maha.png"} alt={property.title} />
                  </div>

                  {/* Content */}
                  <div className="property-content">
                    <h3 className="property-title">{property.title}</h3>
                    
                    <div className="property-meta">
                      <span className="property-category">{property.category || "Property"}</span>
                      <span className={`status-badge ${property.approvalStatus || "pending"}`}>
                        {property.approvalStatus || "pending"}
                      </span>
                    </div>

                    <div className="property-details">
                      <div className="detail">💰 {formatPrice(property.price || 0)}</div>
                      <div className="detail">📍 {property.city}, {property.state}</div>
                      <div className="detail">👤 {property.agentName || "N/A"}</div>
                      <div className="detail">📞 {property.agentPhone || "N/A"}</div>
                    </div>

                    <div className="property-actions">
                      <button
                        onClick={() => window.location.href = `/x-admin/properties/${property._id}`}
                        className="btn-view"
                      >
                        View Details
                      </button>
                      <div className="action-buttons">
                        <button onClick={() => approveProperty(property._id)} className="btn-approve">
                          Approve
                        </button>
                        <button onClick={() => rejectProperty(property._id)} className="btn-reject">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thank You Messages Tab */}
      {activeTab === "thankyou" && (
        <div className="thankyou-tab">
          {/* Active Message Banner */}
          {activeMessage && !showForm && (
            <div className="active-banner">
              <div className="banner-icon">✅</div>
              <div className="banner-text">
                <strong>Active Message:</strong> {activeMessage.title}
                <span className="banner-preview">— {activeMessage.message.substring(0, 80)}...</span>
              </div>
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="form-modal">
              <div className="form-container">
                <div className="form-header">
                  <h3>{editing ? "Edit Message" : "Create New Message"}</h3>
                  <button className="close-btn" onClick={resetForm}>✕</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="e.g., Thank You!"
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      required
                      placeholder="Your thank you message here..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Button Text</label>
                      <input
                        type="text"
                        value={form.buttonText}
                        onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                        placeholder="Close"
                      />
                    </div>

                    <div className="form-group">
                      <label>Icon</label>
                      <input
                        type="text"
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        placeholder="✓"
                        maxLength={5}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Background Color</label>
                      <div className="color-group">
                        <input
                          type="color"
                          value={form.backgroundColor}
                          onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                        />
                        <input
                          type="text"
                          value={form.backgroundColor}
                          onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                          placeholder="#16a34a"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        />
                        Set as Active Message
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={msgLoading}>
                      {msgLoading ? "Saving..." : editing ? "Update Message" : "Create Message"}
                    </button>
                    <button type="button" className="btn-cancel" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Live Preview */}
                <div className="preview-section">
                  <h4>Live Preview</h4>
                  <div className="preview-card" style={{ borderTopColor: form.backgroundColor }}>
                    <div className="preview-icon" style={{ backgroundColor: form.backgroundColor }}>
                      {form.icon}
                    </div>
                    <h4>{form.title}</h4>
                    <p>{form.message}</p>
                    <button style={{ backgroundColor: form.backgroundColor }}>
                      {form.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages Grid */}
          {msgLoading && !showForm ? (
            <div className="loading">Loading messages...</div>
          ) : (
            <div className="messages-grid">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <h3>No messages yet</h3>
                  <p>Create your first thank you message to get started</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`message-card ${msg.isActive ? "active" : ""}`}>
                    <div className="message-header">
                      {msg.isActive && <span className="badge-active">● Active</span>}
                      <span className="message-date">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Just now"}
                      </span>
                    </div>
                    
                    <div className="message-icon" style={{ backgroundColor: msg.backgroundColor }}>
                      {msg.icon}
                    </div>
                    
                    <h4 className="message-title">{msg.title}</h4>
                    <p className="message-text">{msg.message.substring(0, 100)}...</p>
                    
                    <div className="message-details">
                      <span>Button: {msg.buttonText}</span>
                      <span>Color: {msg.backgroundColor}</span>
                    </div>
                    
                    <div className="message-actions">
                      {!msg.isActive && (
                        <button onClick={() => handleSetActive(msg._id!)} className="msg-btn-active">
                          Set Active
                        </button>
                      )}
                      <button onClick={() => handleEdit(msg)} className="msg-btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(msg._id!)} className="msg-btn-delete">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <div className="gallery-modal">
          <button className="gallery-close" onClick={() => setShowGallery(false)}>✕</button>
          
          <img src={galleryImages[activeImage]} alt="Gallery" className="gallery-image" />
          
          {galleryImages.length > 1 && (
            <>
              <button className="gallery-prev" onClick={() => setActiveImage(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}>‹</button>
              <button className="gallery-next" onClick={() => setActiveImage(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}>›</button>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .admin-properties-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Header */
        .header {
          background: white;
          padding: 24px 32px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .header-subtitle {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(102,126,234,0.4);
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 0;
          background: white;
          padding: 0 32px;
          border-bottom: 2px solid #e2e8f0;
        }

        .tab {
          padding: 16px 24px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #667eea;
        }

        .tab.active {
          color: #667eea;
          border-bottom: 2px solid #667eea;
          margin-bottom: -2px;
        }

        /* Properties Tab */
        .properties-tab {
          padding: 24px 32px;
        }

        .filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          background: white;
          padding: 4px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .filter-btn {
          padding: 8px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .active-pending {
          background: #0f172a;
          color: white;
        }

        .active-approved {
          background: #16a34a;
          color: white;
        }

        .active-rejected {
          background: #dc2626;
          color: white;
        }

        .active-all {
          background: #64748b;
          color: white;
        }

        .mine-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-weight: 600;
          cursor: pointer;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .property-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }

        .property-image {
          height: 200px;
          cursor: pointer;
          overflow: hidden;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .property-card:hover .property-image img {
          transform: scale(1.05);
        }

        .property-content {
          padding: 20px;
        }

        .property-title {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: #0f172a;
        }

        .property-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .property-category {
          font-size: 12px;
          color: #64748b;
          padding: 4px 8px;
          background: #f1f5f9;
          border-radius: 6px;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-badge.pending {
          background: #e2e8f0;
          color: #0f172a;
        }

        .status-badge.approved {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .property-details {
          display: grid;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #475569;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .property-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-view {
          width: 100%;
          padding: 10px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-approve, .btn-reject {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-approve {
          background: #16a34a;
          color: white;
        }

        .btn-reject {
          background: #dc2626;
          color: white;
        }

        /* Thank You Tab */
        .thankyou-tab {
          padding: 24px 32px;
        }

        .active-banner {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .banner-icon {
          font-size: 24px;
        }

        .banner-text {
          font-size: 14px;
        }

        .banner-preview {
          opacity: 0.9;
          margin-left: 8px;
        }

        /* Form Modal */
        .form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          overflow-y: auto;
          padding: 32px;
        }

        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 32px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .form-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f1f5f9;
          cursor: pointer;
          font-size: 18px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #0f172a;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .color-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .color-group input[type="color"] {
          width: 50px;
          padding: 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-submit, .btn-cancel {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit {
          background: #667eea;
          color: white;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
        }

        .preview-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .preview-section h4 {
          margin-bottom: 16px;
          font-size: 16px;
        }

        .preview-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          border-top: 4px solid #16a34a;
        }

        .preview-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin-bottom: 12px;
        }

        .preview-card button {
          padding: 8px 20px;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
        }

        /* Messages Grid */
        .messages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .message-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s;
          border: 1px solid #e2e8f0;
        }

        .message-card.active {
          border: 2px solid #10b981;
          background: #f0fdf4;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .badge-active {
          background: #10b981;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .message-date {
          font-size: 11px;
          color: #94a3b8;
        }

        .message-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 12px;
        }

        .message-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .message-text {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
        }

        .message-details {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .message-actions {
          display: flex;
          gap: 8px;
        }

        .msg-btn-active, .msg-btn-edit, .msg-btn-delete {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }

        .msg-btn-active {
          background: #10b981;
          color: white;
        }

        .msg-btn-edit {
          background: #3b82f6;
          color: white;
        }

        .msg-btn-delete {
          background: #ef4444;
          color: white;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #64748b;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          background: white;
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        /* Gallery Modal */
        .gallery-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: white;
          font-size: 20px;
          cursor: pointer;
        }

        .gallery-image {
          width: 90%;
          max-width: 1200px;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 16px;
        }

        .gallery-prev, .gallery-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          background: white;
          font-size: 32px;
          cursor: pointer;
        }

        .gallery-prev {
          left: 20px;
        }

        .gallery-next {
          right: 20px;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .tabs {
            padding: 0 16px;
          }

          .properties-tab, .thankyou-tab {
            padding: 16px;
          }

          .properties-grid, .messages-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}