'use client';

import { useState, useEffect } from 'react';

interface EmailSettings {
  'real-estate': string;
  'commercial': string;
  'residential': string;
  'industrial': string;
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>({
    'real-estate': '',
    'commercial': '',
    'residential': '',
    'industrial': ''
  });
  const [originalSettings, setOriginalSettings] = useState<EmailSettings>({
    'real-estate': '',
    'commercial': '',
    'residential': '',
    'industrial': ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      const data = await response.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        setOriginalSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOriginalSettings(settings);
        setMessage({ type: 'success', text: '✅ Email settings saved successfully! Changes take effect immediately.' });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage({ type: 'success', text: '🔄 Settings reset to last saved state' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (category: keyof EmailSettings, value: string) => {
    setSettings(prev => ({ ...prev, [category]: value }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }
    
    setSendingTest(true);
    try {
      const response = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail, settings })
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Test email sent successfully! Check your inbox.');
        setShowTestModal(false);
        setTestEmail('');
      } else {
        alert('❌ Failed to send test email: ' + data.error);
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading email settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span style={styles.headerIconEmoji}>📧</span>
          </div>
          <div>
            <h1 style={styles.headerTitle}>Email Settings</h1>
            <p style={styles.headerSubtitle}>
              Configure email addresses for each property category. Changes take effect immediately.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div style={styles.grid}>
          {/* Left Column - Settings Form */}
          <div style={styles.leftColumn}>
            {/* Real Estate */}
            <div style={styles.card}>
              <div style={{ ...styles.cardHeader, ...styles.cardHeaderGreen }}>
                <div style={styles.cardHeaderLeft}>
                  <div style={styles.cardIcon}>🏠</div>
                  <div>
                    <h3 style={styles.cardTitle}>Real Estate Category</h3>
                    <p style={styles.cardSubtitle}>Configure recipient email</p>
                  </div>
                </div>
                {settings['real-estate'] && (
                  <div style={styles.badgeConfigured}>
                    <span>✓</span> Configured
                  </div>
                )}
              </div>
              <div style={styles.cardBody}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>📧</span>
                  <input
                    type="email"
                    value={settings['real-estate']}
                    onChange={(e) => handleChange('real-estate', e.target.value)}
                    placeholder="realestate@mahaproperties.com"
                    style={styles.input}
                  />
                </div>
                <p style={styles.inputHint}>
                  All real estate property inquiries will be forwarded to this email address
                </p>
              </div>
            </div>

            {/* Commercial */}
            <div style={styles.card}>
              <div style={{ ...styles.cardHeader, ...styles.cardHeaderBlue }}>
                <div style={styles.cardHeaderLeft}>
                  <div style={styles.cardIcon}>🏢</div>
                  <div>
                    <h3 style={styles.cardTitle}>Commercial Category</h3>
                    <p style={styles.cardSubtitle}>Configure recipient email</p>
                  </div>
                </div>
                {settings['commercial'] && (
                  <div style={styles.badgeConfigured}>
                    <span>✓</span> Configured
                  </div>
                )}
              </div>
              <div style={styles.cardBody}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>📧</span>
                  <input
                    type="email"
                    value={settings['commercial']}
                    onChange={(e) => handleChange('commercial', e.target.value)}
                    placeholder="commercial@mahaproperties.com"
                    style={styles.input}
                  />
                </div>
                <p style={styles.inputHint}>
                  All commercial property inquiries will be forwarded to this email address
                </p>
              </div>
            </div>

            {/* Residential */}
            <div style={styles.card}>
              <div style={{ ...styles.cardHeader, ...styles.cardHeaderOrange }}>
                <div style={styles.cardHeaderLeft}>
                  <div style={styles.cardIcon}>🏡</div>
                  <div>
                    <h3 style={styles.cardTitle}>Residential Category</h3>
                    <p style={styles.cardSubtitle}>Configure recipient email</p>
                  </div>
                </div>
                {settings['residential'] && (
                  <div style={styles.badgeConfigured}>
                    <span>✓</span> Configured
                  </div>
                )}
              </div>
              <div style={styles.cardBody}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>📧</span>
                  <input
                    type="email"
                    value={settings['residential']}
                    onChange={(e) => handleChange('residential', e.target.value)}
                    placeholder="residential@mahaproperties.com"
                    style={styles.input}
                  />
                </div>
                <p style={styles.inputHint}>
                  All residential property inquiries will be forwarded to this email address
                </p>
              </div>
            </div>

            {/* Industrial */}
            <div style={styles.card}>
              <div style={{ ...styles.cardHeader, ...styles.cardHeaderPurple }}>
                <div style={styles.cardHeaderLeft}>
                  <div style={styles.cardIcon}>🏭</div>
                  <div>
                    <h3 style={styles.cardTitle}>Industrial Category</h3>
                    <p style={styles.cardSubtitle}>Configure recipient email</p>
                  </div>
                </div>
                {settings['industrial'] && (
                  <div style={styles.badgeConfigured}>
                    <span>✓</span> Configured
                  </div>
                )}
              </div>
              <div style={styles.cardBody}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>📧</span>
                  <input
                    type="email"
                    value={settings['industrial']}
                    onChange={(e) => handleChange('industrial', e.target.value)}
                    placeholder="industrial@mahaproperties.com"
                    style={styles.input}
                  />
                </div>
                <p style={styles.inputHint}>
                  All industrial property inquiries will be forwarded to this email address
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionCard}>
              <div style={styles.buttonGroup}>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  style={{
                    ...styles.saveButton,
                    ...(!hasChanges && styles.buttonDisabled)
                  }}
                >
                  {saving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={!hasChanges}
                  style={{
                    ...styles.resetButton,
                    ...(!hasChanges && styles.buttonDisabled)
                  }}
                >
                  🔄 Reset
                </button>
              </div>
              {hasChanges && (
                <p style={styles.unsavedWarning}>⚠️ You have unsaved changes. Click Save to apply.</p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div style={styles.rightColumn}>
            {/* Status Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusHeader}>
                <span style={styles.statusIcon}>✓</span>
                <h3 style={styles.statusTitle}>Configuration Status</h3>
              </div>
              <div style={styles.statusList}>
                <div style={styles.statusItem}>
                  <span style={styles.statusLabel}>🏠 Real Estate</span>
                  {settings['real-estate'] ? (
                    <span style={styles.statusBadgeSuccess}>✓ Configured</span>
                  ) : (
                    <span style={styles.statusBadgeWarning}>Not set</span>
                  )}
                </div>
                <div style={styles.statusItem}>
                  <span style={styles.statusLabel}>🏢 Commercial</span>
                  {settings['commercial'] ? (
                    <span style={styles.statusBadgeSuccess}>✓ Configured</span>
                  ) : (
                    <span style={styles.statusBadgeWarning}>Not set</span>
                  )}
                </div>
                <div style={styles.statusItem}>
                  <span style={styles.statusLabel}>🏡 Residential</span>
                  {settings['residential'] ? (
                    <span style={styles.statusBadgeSuccess}>✓ Configured</span>
                  ) : (
                    <span style={styles.statusBadgeWarning}>Not set</span>
                  )}
                </div>
                <div style={styles.statusItem}>
                  <span style={styles.statusLabel}>🏭 Industrial</span>
                  {settings['industrial'] ? (
                    <span style={styles.statusBadgeSuccess}>✓ Configured</span>
                  ) : (
                    <span style={styles.statusBadgeWarning}>Not set</span>
                  )}
                </div>
              </div>
              <div style={styles.statusFooter}>
                <span style={styles.statusFooterText}>Total Configured</span>
                <span style={styles.statusFooterCount}>
                  {Object.values(settings).filter(e => e && e.trim()).length} / 4
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsCard}>
              <h3 style={styles.actionsTitle}>Quick Actions</h3>
              <button
                onClick={() => setShowTestModal(true)}
                style={styles.actionButton}
              >
                📧 Send Test Email
              </button>
              <button
                onClick={fetchSettings}
                style={styles.actionButton}
              >
                🔄 Refresh Settings
              </button>
            </div>

            {/* Help Card */}
            <div style={styles.helpCard}>
              <div style={styles.helpHeader}>
                <span style={styles.helpIcon}>ℹ️</span>
                <h3 style={styles.helpTitle}>Need Help?</h3>
              </div>
              <p style={styles.helpText}>
                Make sure the email addresses are verified in your Brevo account.
              </p>
              <button
                onClick={() => window.open('https://app.brevo.com', '_blank')}
                style={styles.helpButton}
              >
                Go to Brevo Dashboard →
              </button>
            </div>
          </div>
        </div>

        {/* Toast Message */}
        {message && (
          <div style={{
            ...styles.toast,
            ...(message.type === 'success' ? styles.toastSuccess : styles.toastError)
          }}>
            <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
            <span style={styles.toastText}>{message.text}</span>
          </div>
        )}

        {/* Test Email Modal */}
        {showTestModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <div style={styles.modalHeaderIcon}>📧</div>
                <div>
                  <h3 style={styles.modalTitle}>Send Test Email</h3>
                  <p style={styles.modalSubtitle}>Verify your email configuration</p>
                </div>
              </div>
              <div style={styles.modalBody}>
                <label style={styles.modalLabel}>Email Address</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@example.com"
                  style={styles.modalInput}
                  autoFocus
                />
                <p style={styles.modalHint}>
                  A test email will be sent to this address using the current settings.
                </p>
              </div>
              <div style={styles.modalFooter}>
                <button
                  onClick={() => setShowTestModal(false)}
                  style={styles.modalCancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={sendTestEmail}
                  disabled={sendingTest}
                  style={styles.modalSendButton}
                >
                  {sendingTest ? 'Sending...' : 'Send Test Email'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    padding: '40px 20px',
  } as React.CSSProperties,
  
  contentWrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  } as React.CSSProperties,
  
  headerIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  } as React.CSSProperties,
  
  headerIconEmoji: {
    fontSize: '28px',
  } as React.CSSProperties,
  
  headerTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
  } as React.CSSProperties,
  
  headerSubtitle: {
    fontSize: '14px',
    color: '#718096',
  } as React.CSSProperties,
  
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  } as React.CSSProperties,
  
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  } as React.CSSProperties,
  
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  } as React.CSSProperties,
  
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  } as React.CSSProperties,
  
  cardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  
  cardHeaderGreen: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  } as React.CSSProperties,
  
  cardHeaderBlue: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
  } as React.CSSProperties,
  
  cardHeaderOrange: {
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
  } as React.CSSProperties,
  
  cardHeaderPurple: {
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
  } as React.CSSProperties,
  
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,
  
  cardIcon: {
    fontSize: '28px',
  } as React.CSSProperties,
  
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '4px',
  } as React.CSSProperties,
  
  cardSubtitle: {
    fontSize: '12px',
    color: '#718096',
  } as React.CSSProperties,
  
  badgeConfigured: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    background: '#10b981',
    color: '#ffffff',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  } as React.CSSProperties,
  
  cardBody: {
    padding: '24px',
  } as React.CSSProperties,
  
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  } as React.CSSProperties,
  
  inputWrapper: {
    position: 'relative' as 'relative',
  } as React.CSSProperties,
  
  inputIcon: {
    position: 'absolute' as 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
  } as React.CSSProperties,
  
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1a202c',
    backgroundColor: '#ffffff',
  } as React.CSSProperties,
  
  inputHint: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '8px',
  } as React.CSSProperties,
  
  actionCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  } as React.CSSProperties,
  
  saveButton: {
    flex: 1,
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  } as React.CSSProperties,
  
  resetButton: {
    padding: '12px 24px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  } as React.CSSProperties,
  
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as React.CSSProperties,
  
  unsavedWarning: {
    fontSize: '12px',
    color: '#d97706',
    marginTop: '12px',
    padding: '8px',
    background: '#fffbeb',
    borderRadius: '8px',
  } as React.CSSProperties,
  
  statusCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e2e8f0',
  } as React.CSSProperties,
  
  statusIcon: {
    width: '32px',
    height: '32px',
    background: '#10b981',
    color: '#ffffff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  } as React.CSSProperties,
  
  statusTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
  } as React.CSSProperties,
  
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,
  
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  
  statusLabel: {
    fontSize: '13px',
    color: '#4a5568',
  } as React.CSSProperties,
  
  statusBadgeSuccess: {
    fontSize: '11px',
    padding: '4px 10px',
    background: '#dcfce7',
    color: '#166534',
    borderRadius: '20px',
    fontWeight: '600',
  } as React.CSSProperties,
  
  statusBadgeWarning: {
    fontSize: '11px',
    padding: '4px 10px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: '20px',
    fontWeight: '600',
  } as React.CSSProperties,
  
  statusFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  } as React.CSSProperties,
  
  statusFooterText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b',
  } as React.CSSProperties,
  
  statusFooterCount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
  } as React.CSSProperties,
  
  actionsCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  
  actionsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '16px',
  } as React.CSSProperties,
  
  actionButton: {
    width: '100%',
    padding: '10px 16px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#334155',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'background 0.2s ease',
  } as React.CSSProperties,
  
  helpCard: {
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #fde68a',
  } as React.CSSProperties,
  
  helpHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  } as React.CSSProperties,
  
  helpIcon: {
    fontSize: '20px',
  } as React.CSSProperties,
  
  helpTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#92400e',
  } as React.CSSProperties,
  
  helpText: {
    fontSize: '13px',
    color: '#78350f',
    marginBottom: '16px',
    lineHeight: '1.5',
  } as React.CSSProperties,
  
  helpButton: {
    background: 'transparent',
    border: 'none',
    color: '#d97706',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  } as React.CSSProperties,
  
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f7fa',
  } as React.CSSProperties,
  
  loadingWrapper: {
    textAlign: 'center' as 'center',
  } as React.CSSProperties,
  
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  } as React.CSSProperties,
  
  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  } as React.CSSProperties,
  
  toast: {
    position: 'fixed' as 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    zIndex: 1000,
    animation: 'slideUp 0.3s ease',
  } as React.CSSProperties,
  
  toastSuccess: {
    background: '#10b981',
    color: '#ffffff',
  } as React.CSSProperties,
  
  toastError: {
    background: '#ef4444',
    color: '#ffffff',
  } as React.CSSProperties,
  
  toastText: {
    fontSize: '13px',
    fontWeight: '500',
  } as React.CSSProperties,
  
  modalOverlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  } as React.CSSProperties,
  
  modal: {
    background: '#ffffff',
    borderRadius: '20px',
    maxWidth: '480px',
    width: '90%',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    overflow: 'hidden',
  } as React.CSSProperties,
  
  modalHeader: {
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,
  
  modalHeaderIcon: {
    fontSize: '32px',
  } as React.CSSProperties,
  
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '4px',
  } as React.CSSProperties,
  
  modalSubtitle: {
    fontSize: '13px',
    opacity: 0.9,
  } as React.CSSProperties,
  
  modalBody: {
    padding: '24px',
  } as React.CSSProperties,
  
  modalLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  } as React.CSSProperties,
  
  modalInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1a202c',
    backgroundColor: '#ffffff',
  } as React.CSSProperties,
  
  modalHint: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '8px',
  } as React.CSSProperties,
  
  modalFooter: {
    padding: '16px 24px',
    background: '#f8fafc',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  
  modalCancelButton: {
    padding: '10px 20px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b',
    cursor: 'pointer',
  } as React.CSSProperties,
  
  modalSendButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
  } as React.CSSProperties,
};

// Add global styles for animations and placeholder color
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    button:hover {
      transform: translateY(-1px);
    }
    input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    /* ✅ Placeholder text color - dark gray, NOT white */
    input::placeholder {
      color: #9ca3af;
      opacity: 1;
    }
    input::-webkit-input-placeholder {
      color: #9ca3af;
    }
    input::-moz-placeholder {
      color: #9ca3af;
    }
    input:-ms-input-placeholder {
      color: #9ca3af;
    }
  `;
  document.head.appendChild(styleSheet);
}