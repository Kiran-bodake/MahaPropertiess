"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Key,
  Users,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Lock,
  Unlock,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterModule, setFilterModule] = useState("all");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleName, setRoleName] = useState("");
  const [creatingRole, setCreatingRole] = useState(false);

  // Load data
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  async function fetchRoles() {
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  }

  async function fetchPermissions() {
    try {
      const res = await fetch("/api/admin/permissions");
      const data = await res.json();
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  }

  function selectRole(role: any) {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions?.map((p: any) => p._id) || []);
    setShowSaveSuccess(false);
  }

  function togglePermission(id: string) {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  }

  function toggleAllPermissions(checked: boolean) {
    if (checked) {
      setSelectedPermissions(permissions.map(p => p._id));
    } else {
      setSelectedPermissions([]);
    }
  }

  async function savePermissions() {
    if (!selectedRole) return;

    setSaving(true);

    try {
      const res = await fetch("/api/admin/roles/update-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: selectedRole._id,
          permissions: selectedPermissions,
        }),
      });

      if (!res.ok) throw new Error("Failed to update permissions");

      await fetchRoles();
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update permissions. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function createRole() {
    if (!roleName.trim()) {
      alert("Enter role name");
      return;
    }

    try {
      setCreatingRole(true);

      const res = await fetch("/api/admin/roles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roleName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Role created successfully!");
        setRoleName("");
        setEditingRole(null);
        fetchRoles();
      } else {
        alert(data.message || "Failed to create role");
      }
    } catch (error) {
      console.log(error);
      alert("Failed creating role");
    } finally {
      setCreatingRole(false);
    }
  }

  const getRoleColor = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case "super-admin":
        return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b", dot: "#f59e0b" };
      case "admin":
        return { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", dot: "#3b82f6" };
      case "manager":
        return { bg: "#d1fae5", text: "#065f46", border: "#10b981", dot: "#10b981" };
      case "agent":
        return { bg: "#fce7f3", text: "#831843", border: "#ec4899", dot: "#ec4899" };
      case "sales manager":
        return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b", dot: "#f59e0b" };
      case "field manager":
        return { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6", dot: "#3b82f6" };
      case "contact person":
        return { bg: "#d1fae5", text: "#065f46", border: "#10b981", dot: "#10b981" };
      default:
        return { bg: "#f3f4f6", text: "#4b5563", border: "#9ca3af", dot: "#9ca3af" };
    }
  };

  const getModuleIcon = (module: string) => {
    const icons: Record<string, any> = {
      "users": <Users className="w-4 h-4" />,
      "roles": <Shield className="w-4 h-4" />,
      "permissions": <Key className="w-4 h-4" />,
      "properties": <Grid className="w-4 h-4" />,
      "inquiries": <Search className="w-4 h-4" />,
      "deals": <List className="w-4 h-4" />,
    };
    return icons[module?.toLowerCase()] || <Shield className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    switch (action?.toLowerCase()) {
      case "create":
        return "#10b981";
      case "read":
        return "#3b82f6";
      case "update":
        return "#f59e0b";
      case "delete":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const filteredPermissions = permissions.filter(perm => {
    const matchesSearch = 
      perm.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.action?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === "all" || perm.module === filterModule;
    
    return matchesSearch && matchesModule;
  });

  const modules = ["all", ...new Set(permissions.map(p => p.module).filter(Boolean))];

  // Get count of selected permissions
  const selectedCount = selectedPermissions.length;
  const totalPermissions = permissions.length;
  const isAllSelected = selectedCount === totalPermissions && totalPermissions > 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 style={styles.title}>Role Management</h1>
            <p style={styles.subtitle}>
              Manage roles and their permissions across the platform
            </p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button
            onClick={() => setEditingRole({})}
            style={styles.headerButton}
          >
            <Plus className="w-4 h-4" />
            New Role
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p style={styles.statLabel}>Total Roles</p>
            <p style={styles.statValue}>{roles.length}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#dbeafe", color: "#3b82f6" }}>
            <Key className="w-5 h-5" />
          </div>
          <div>
            <p style={styles.statLabel}>Total Permissions</p>
            <p style={styles.statValue}>{permissions.length}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#d1fae5", color: "#10b981" }}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p style={styles.statLabel}>Users with Roles</p>
            <p style={styles.statValue}>
              {roles.reduce((acc, role) => acc + (role.users?.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Sidebar - Roles */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Roles</h2>
            <span style={styles.roleCount}>{roles.length}</span>
          </div>

          <div style={styles.roleList}>
            {roles.map((role) => {
              const roleColor = getRoleColor(role.name);
              const isSelected = selectedRole?._id === role._id;

              return (
                <div
                  key={role._id}
                  onClick={() => selectRole(role)}
                  style={{
                    ...styles.roleItem,
                    background: isSelected ? "#f1f5f9" : "#ffffff",
                    borderColor: isSelected ? "#3b82f6" : "#e2e8f0",
                  }}
                >
                  <div style={styles.roleItemLeft}>
                    <div
                      style={{
                        ...styles.roleDot,
                        background: roleColor.dot,
                      }}
                    />
                    <div>
                      <div style={styles.roleName}>{role.name}</div>
                      <div style={styles.rolePermissions}>
                        {role.permissions?.length || 0} permissions
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <ChevronRight className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Permissions */}
        <div style={styles.panel}>
          {!selectedRole ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Shield className="w-16 h-16" />
              </div>
              <h3 style={styles.emptyTitle}>Select a Role</h3>
              <p style={styles.emptySubtitle}>
                Choose a role from the sidebar to manage its permissions
              </p>
            </div>
          ) : (
            <>
              {/* Panel Header */}
              <div style={styles.panelHeader}>
                <div>
                  <div style={styles.panelTitleWrapper}>
                    <h2 style={styles.panelTitle}>{selectedRole.name}</h2>
                    <div
                      style={{
                        ...styles.roleBadge,
                        backgroundColor: getRoleColor(selectedRole.name).bg,
                        color: getRoleColor(selectedRole.name).text,
                        borderColor: getRoleColor(selectedRole.name).border,
                      }}
                    >
                      <span style={styles.roleBadgeDot} />
                      {selectedRole.name}
                    </div>
                  </div>
                  <p style={styles.panelSubtitle}>
                    Managing permissions for this role
                  </p>
                </div>
                <div style={styles.panelActions}>
                  <button
                    onClick={savePermissions}
                    disabled={saving}
                    style={{
                      ...styles.saveButton,
                      opacity: saving ? 0.7 : 1,
                      cursor: saving ? "not-allowed" : "pointer",
                    }}
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {showSaveSuccess && (
                <div style={styles.successBanner}>
                  <CheckCircle className="w-5 h-5" />
                  <span>Permissions updated successfully!</span>
                </div>
              )}

              {/* Filters */}
              <div style={styles.filtersContainer}>
                <div style={styles.searchWrapper}>
                  <Search className="w-4 h-4" style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      style={styles.clearSearch}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div style={styles.filterWrapper}>
                  <Filter className="w-4 h-4" style={styles.filterIcon} />
                  <select
                    value={filterModule}
                    onChange={(e) => setFilterModule(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Modules</option>
                    {modules.filter(m => m !== "all").map((module) => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.viewToggle}>
                  <button
                    onClick={() => setViewMode("grid")}
                    style={{
                      ...styles.viewButton,
                      background: viewMode === "grid" ? "#e2e8f0" : "transparent",
                    }}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    style={{
                      ...styles.viewButton,
                      background: viewMode === "list" ? "#e2e8f0" : "transparent",
                    }}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Selection Summary */}
              <div style={styles.selectionSummary}>
                <div style={styles.selectionInfo}>
                  <span style={styles.selectionCount}>
                    {selectedCount} of {filteredPermissions.length} permissions selected
                  </span>
                  <label style={styles.selectAllLabel}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => toggleAllPermissions(e.target.checked)}
                      style={styles.selectAllCheckbox}
                    />
                    Select All
                  </label>
                </div>
              </div>

              {/* Permissions Grid/List */}
              <div style={viewMode === "grid" ? styles.permissionsGrid : styles.permissionsList}>
                {filteredPermissions.length === 0 ? (
                  <div style={styles.noResults}>
                    <Search className="w-12 h-12" style={{ color: "#94a3b8", marginBottom: "12px" }} />
                    <p style={styles.noResultsText}>No permissions found</p>
                    <p style={styles.noResultsSubtext}>
                      {searchTerm ? "Try adjusting your search" : "No permissions available"}
                    </p>
                  </div>
                ) : (
                  filteredPermissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm._id);
                    const actionColor = getActionColor(perm.action);

                    return viewMode === "grid" ? (
                      <label
                        key={perm._id}
                        style={{
                          ...styles.permissionCard,
                          borderColor: isChecked ? "#3b82f6" : "#e2e8f0",
                          background: isChecked ? "#eff6ff" : "#ffffff",
                        }}
                      >
                        <div style={styles.permissionCardHeader}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(perm._id)}
                            style={styles.permissionCheckbox}
                          />
                          <div style={styles.permissionIcon}>
                            {getModuleIcon(perm.module)}
                          </div>
                        </div>
                        <div style={styles.permissionCardBody}>
                          <div style={styles.permissionKey}>{perm.key}</div>
                          <div style={styles.permissionMeta}>
                            <span style={styles.permissionModule}>{perm.module}</span>
                            <span
                              style={{
                                ...styles.permissionAction,
                                color: actionColor,
                                background: `${actionColor}15`,
                              }}
                            >
                              {perm.action}
                            </span>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <label
                        key={perm._id}
                        style={{
                          ...styles.permissionListItem,
                          borderColor: isChecked ? "#3b82f6" : "#e2e8f0",
                          background: isChecked ? "#eff6ff" : "#ffffff",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm._id)}
                          style={styles.permissionCheckbox}
                        />
                        <div style={styles.permissionListContent}>
                          <div>
                            <div style={styles.permissionKey}>{perm.key}</div>
                            <div style={styles.permissionMeta}>
                              <span style={styles.permissionModule}>{perm.module}</span>
                              <span
                                style={{
                                  ...styles.permissionAction,
                                  color: actionColor,
                                  background: `${actionColor}15`,
                                }}
                              >
                                {perm.action}
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      {editingRole && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setEditingRole(null)}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "32px",
              borderRadius: "16px",
              width: "420px",
              maxWidth: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{ 
                padding: "8px", 
                background: "#eff6ff", 
                borderRadius: "10px",
                color: "#3b82f6"
              }}>
                <Shield className="w-5 h-5" />
              </div>
              <h2 style={{ 
                fontSize: "20px", 
                fontWeight: "600", 
                color: "#0f172a", 
                margin: 0 
              }}>
                Create New Role
              </h2>
            </div>
            
            <p style={{ 
              fontSize: "14px", 
              color: "#64748b", 
              margin: "0 0 20px 0" 
            }}>
              Add a new role to manage user permissions
            </p>

            <input
              placeholder="Enter role name (e.g., Sales Manager)"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createRole();
                }
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#0f172a",
                outline: "none",
                transition: "all 0.2s",
                boxSizing: "border-box",
                marginBottom: "20px",
              }}
              autoFocus
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setEditingRole(null)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                Cancel
              </button>
              <button
                onClick={createRole}
                disabled={creatingRole}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: creatingRole ? "not-allowed" : "pointer",
                  opacity: creatingRole ? 0.7 : 1,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
                }}
              >
                {creatingRole ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Role
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    padding: "32px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3b82f6",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  headerButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "#fef3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f59e0b",
  },
  statLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
    margin: "0 0 2px 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  // Main Content
  mainContent: {
    display: "flex",
    gap: "24px",
    minHeight: "600px",
  },

  // Sidebar
  sidebar: {
    width: "300px",
    flexShrink: 0,
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
  },
  sidebarTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  roleCount: {
    backgroundColor: "#f1f5f9",
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
  },
  roleList: {
    padding: "12px",
  },
  roleItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  roleItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  roleDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  roleName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  },
  rolePermissions: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  // Panel
  panel: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    minHeight: "500px",
  },

  // Empty State
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minHeight: "400px",
  },
  emptyIcon: {
    color: "#d1d5db",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },

  // Panel Header
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  panelTitleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  panelTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  panelSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid",
  },
  roleBadgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  panelActions: {
    display: "flex",
    gap: "8px",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },

  // Success Banner
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#f0fdf4",
    borderRadius: "10px",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "20px",
    border: "1px solid #bbf7d0",
  },

  // Filters
  filtersContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: 1,
    minWidth: "200px",
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    padding: "8px 36px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
  },
  clearSearch: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
  },
  filterWrapper: {
    position: "relative",
    minWidth: "150px",
  },
  filterIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  filterSelect: {
    width: "100%",
    padding: "8px 12px 8px 36px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
  },
  viewToggle: {
    display: "flex",
    gap: "4px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    padding: "4px",
  },
  viewButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#475569",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
  },

  // Selection Summary
  selectionSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "16px",
  },
  selectionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  selectionCount: {
    fontSize: "13px",
    color: "#64748b",
  },
  selectAllLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#0f172a",
    cursor: "pointer",
  },
  selectAllCheckbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },

  // Permissions Grid
  permissionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
  },
  permissionCard: {
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  permissionCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  permissionIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },
  permissionCardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  permissionKey: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0f172a",
  },
  permissionMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  permissionModule: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  permissionAction: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "4px",
    textTransform: "capitalize",
  },

  // Permissions List
  permissionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  permissionListItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  permissionListContent: {
    flex: 1,
  },

  permissionCheckbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#3b82f6",
  },

  // No Results
  noResults: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    textAlign: "center",
  },
  noResultsText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#64748b",
    margin: "0 0 4px 0",
  },
  noResultsSubtext: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
};

// Add animation for spinner
const globalStyles = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 0.6s linear infinite;
  }
  
  input[type="checkbox"] {
    accent-color: #3b82f6;
  }
  
  select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;