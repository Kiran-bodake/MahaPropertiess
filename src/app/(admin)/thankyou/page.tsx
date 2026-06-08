// src/app/admin/thankyou/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Message = {
  _id?: string;
  title: string;
  message: string;
  buttonText: string;
  backgroundColor: string;
  icon: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminThankYouPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Message | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Message>({
    title: "Thank You!",
    message: "Your property inquiry has been submitted successfully. Our expert will contact you shortly.",
    buttonText: "Close",
    backgroundColor: "#16a34a",
    icon: "✓",
    isActive: false,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/thankyou-messages");
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const url = editing?._id ? `/api/thankyou-messages?id=${editing._id}` : "/api/thankyou-messages";
      const method = editing?._id ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(editing ? "Message updated successfully!" : "Message created successfully!");
        resetForm();
        fetchMessages();
        setShowForm(false);
      } else {
        toast.error(data.message || "Failed to save message");
      }
    } catch (error) {
      toast.error("Failed to save message");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (msg: Message) => {
    setEditing(msg);
    setForm(msg);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/thankyou-messages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Message deleted successfully!");
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
        toast.success("Active message updated successfully!");
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

  const activeMessage = messages.find(m => m.isActive);

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div>
              <h1 className="title">Thank You Message Manager</h1>
              <p className="subtitle">Customize the thank you message shown after property inquiries</p>
            </div>
            {!showForm && (
              <button className="btn-create" onClick={() => setShowForm(true)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Create New Message
              </button>
            )}
          </div>
        </div>

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
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2 className="modal-title">{editing ? "Edit Message" : "Create New Message"}</h2>
                <button className="modal-close" onClick={resetForm}>✕</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Thank You!"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Button Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.buttonText}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      placeholder="e.g., Close, Got it"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-textarea"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      placeholder="Enter your thank you message"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Background Color</label>
                    <div className="color-group">
                      <input
                        type="color"
                        className="color-picker"
                        value={form.backgroundColor}
                        onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={form.backgroundColor}
                        onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                        placeholder="#16a34a"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Icon (Emoji or Text)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      placeholder="✓, 🎉, ✅"
                      maxLength={5}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      />
                      <span>Set as active message (only one message can be active at a time)</span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Saving..." : editing ? "Update Message" : "Create Message"}
                  </button>
                  <button type="button" className="btn-cancel" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>

              {/* Live Preview */}
              <div className="preview-section">
                <h3 className="preview-title">Live Preview</h3>
                <div className="preview-container">
                  <div className="preview-card" style={{ borderTopColor: form.backgroundColor }}>
                    <div className="preview-icon" style={{ backgroundColor: form.backgroundColor }}>
                      {form.icon}
                    </div>
                    <h4 className="preview-heading">{form.title}</h4>
                    <p className="preview-message">{form.message}</p>
                    <button className="preview-button" style={{ backgroundColor: form.backgroundColor }}>
                      {form.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="messages-section">
          <div className="messages-header">
            <h2 className="messages-title">All Messages</h2>
            <span className="messages-count">{messages.length} Total</span>
          </div>

          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3 className="empty-title">No messages yet</h3>
              <p className="empty-text">Create your first thank you message to get started</p>
            </div>
          ) : (
            <div className="messages-grid">
              {messages.map((msg) => (
                <div key={msg._id} className={`message-card ${msg.isActive ? 'active' : ''}`}>
                  <div className="card-header">
                    <div className="card-badges">
                      {msg.isActive && <span className="badge-active">● Active</span>}
                    </div>
                    <span className="card-date">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  
                  <div className="card-preview" style={{ backgroundColor: msg.backgroundColor + '15' }}>
                    <div className="card-icon" style={{ backgroundColor: msg.backgroundColor }}>
                      {msg.icon}
                    </div>
                    <div className="card-info">
                      <h3 className="card-title">{msg.title}</h3>
                      <p className="card-message">{msg.message.substring(0, 100)}...</p>
                    </div>
                  </div>
                  
                  <div className="card-details">
                    <div className="detail-item">
                      <span className="detail-label">Button:</span>
                      <span className="detail-value">{msg.buttonText}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Icon:</span>
                      <span className="detail-value">{msg.icon}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Color:</span>
                      <span className="detail-value" style={{ color: msg.backgroundColor }}>
                        {msg.backgroundColor}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    {!msg.isActive && (
                      <button onClick={() => handleSetActive(msg._id!)} className="action-btn btn-active">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Set Active
                      </button>
                    )}
                    <button onClick={() => handleEdit(msg)} className="action-btn btn-edit">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M8.16667 2.33333L11.6667 5.83333M1.75 12.25L4.08333 11.6667L10.5 5.25L8.75 3.5L2.33333 9.91667L1.75 12.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(msg._id!)} className="action-btn btn-delete">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1.75 3.5H12.25M5.83333 6.41667V10.5M8.16667 6.41667V10.5M9.33333 1.75H4.66667C4.33333 1.75 4.08333 2 4.08333 2.33333V3.5H9.91667V2.33333C9.91667 2 9.66667 1.75 9.33333 1.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        /* Header Styles */
        .header {
          margin-bottom: 32px;
        }

        .header-content {
          background: white;
          border-radius: 24px;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #6b7280;
          font-size: 14px;
        }

        .btn-create {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-create:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(102,126,234,0.4);
        }

        /* Active Banner */
        .active-banner {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 16px;
          padding: 16px 24px;
          margin-bottom: 32px;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          z-index: 1000;
          overflow-y: auto;
          padding: 32px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 32px;
          padding: 32px;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modal-close {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #e5e7eb;
          transform: rotate(90deg);
        }

        /* Form Styles */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-input, .form-textarea {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .color-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .color-picker {
          width: 50px;
          height: 50px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .btn-submit, .btn-cancel {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(102,126,234,0.4);
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Preview Styles */
        .preview-section {
          padding-top: 32px;
          border-top: 2px solid #f3f4f6;
        }

        .preview-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #374151;
        }

        .preview-container {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          justify-content: center;
        }

        .preview-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          border-top: 4px solid #16a34a;
          max-width: 400px;
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1);
        }

        .preview-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin-bottom: 20px;
          animation: scaleIn 0.5s ease;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .preview-heading {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #111827;
        }

        .preview-message {
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .preview-button {
          padding: 12px 28px;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .preview-button:hover {
          transform: scale(1.05);
        }

        /* Messages List Styles */
        .messages-section {
          margin-top: 48px;
        }

        .messages-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .messages-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .messages-count {
          background: rgba(255,255,255,0.2);
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .messages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .message-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.2);
        }

        .message-card.active {
          border: 2px solid #10b981;
          background: linear-gradient(to bottom, white, #f0fdf4);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .badge-active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .card-date {
          color: #9ca3af;
          font-size: 11px;
        }

        .card-preview {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 16px;
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .card-info {
          flex: 1;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #111827;
        }

        .card-message {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
        }

        .card-details {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          gap: 8px;
          font-size: 12px;
        }

        .detail-label {
          color: #9ca3af;
        }

        .detail-value {
          font-weight: 600;
          color: #374151;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .btn-active {
          background: #10b981;
          color: white;
        }

        .btn-active:hover {
          background: #059669;
        }

        .btn-edit {
          background: #3b82f6;
          color: white;
        }

        .btn-edit:hover {
          background: #2563eb;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background: #dc2626;
        }

        /* Empty State */
        .empty-state {
          background: white;
          border-radius: 20px;
          padding: 80px;
          text-align: center;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #111827;
        }

        .empty-text {
          color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-container {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .title {
            font-size: 24px;
          }

          .messages-grid {
            grid-template-columns: 1fr;
          }

          .modal-container {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .preview-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}