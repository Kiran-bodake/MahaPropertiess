"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Search, 
  Users, 
  Shield, 
  Mail, 
  User, 
  RefreshCw,
  ChevronDown,
  Check,
  X,
  MoreVertical,
  Filter,
  UserPlus
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/roles"),
        ]);

        const usersData = await uRes.json();
        const rolesData = await rRes.json();

        setUsers(usersData.users || []);
        setRoles(rolesData.roles || []);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function assignRole(userId: string, roleId: string) {
    if (!roleId) return;
    
    try {
      setUpdating(userId);

      const res = await fetch("/api/admin/users/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, roleId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update role");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: data.user.role } : u
        )
      );
      
      setSelectedUser(null);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setUpdating(null);
    }
  }

  const getRoleColor = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case "super-admin":
        return { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" };
      case "admin":
        return { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" };
      case "manager":
        return { bg: "#d1fae5", text: "#065f46", border: "#10b981" };
      case "agent":
        return { bg: "#fce7f3", text: "#831843", border: "#ec4899" };
      default:
        return { bg: "#f3f4f6", text: "#4b5563", border: "#9ca3af" };
    }
  };

  const getRoleIcon = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case "super-admin":
        return <Shield className="w-3 h-3" />;
      case "admin":
        return <Shield className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role?.name === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const roleOptions = ["all", ...new Set(users.map(u => u.role?.name).filter(Boolean))];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
        <p style={styles.loadingText}>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>
            Manage user roles and permissions across the platform
          </p>
        </div>
        <button 
  style={styles.addButton}
  onClick={() => router.push("/users/create")}
>
  <UserPlus className="w-4 h-4" />
  Add User
</button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p style={styles.statLabel}>Total Users</p>
            <p style={styles.statValue}>{users.length}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#fef3c7" }}>
            <Shield className="w-5 h-5" style={{ color: "#92400e" }} />
          </div>
          <div>
            <p style={styles.statLabel}>Admins</p>
            <p style={styles.statValue}>
              {users.filter(u => u.role?.name === "admin").length}
            </p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#d1fae5" }}>
            <User className="w-5 h-5" style={{ color: "#065f46" }} />
          </div>
          <div>
            <p style={styles.statLabel}>Agents</p>
            <p style={styles.statValue}>
              {users.filter(u => u.role?.name === "agent").length}
            </p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#fce7f3" }}>
            <User className="w-5 h-5" style={{ color: "#831843" }} />
          </div>
          <div>
            <p style={styles.statLabel}>Managers</p>
            <p style={styles.statValue}>
              {users.filter(u => u.role?.name === "manager").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchWrapper}>
          <Search className="w-4 h-4" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={styles.clearSearch}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div style={styles.filterWrapper}>
          <Filter className="w-4 h-4" style={styles.filterIcon} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Roles</option>
            {roleOptions.filter(r => r !== "all").map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User Grid */}
      <div style={styles.grid}>
        {filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            <Users className="w-12 h-12" style={styles.emptyIcon} />
            <p style={styles.emptyTitle}>No users found</p>
            <p style={styles.emptySubtitle}>
              {searchTerm ? "Try adjusting your search" : "Users will appear here"}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const roleColor = getRoleColor(user.role?.name);
            const isUpdating = updating === user._id;

            return (
              <div key={user._id} style={styles.card}>
                {/* Avatar */}
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} style={styles.avatarImage} />
                    ) : (
                      <span style={styles.avatarText}>
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div style={styles.statusDot} />
                </div>

                {/* User Info */}
                <div style={styles.userInfo}>
                  <h3 style={styles.name}>{user.name || "User"}</h3>
                  <div style={styles.emailWrapper}>
                    <Mail className="w-3 h-3" style={styles.emailIcon} />
                    <p style={styles.email}>{user.email || "No Email"}</p>
                  </div>
                </div>

                {/* Role Badge */}
                <div
                  style={{
                    ...styles.badge,
                    backgroundColor: roleColor.bg,
                    color: roleColor.text,
                    borderColor: roleColor.border,
                  }}
                >
                  {getRoleIcon(user.role?.name)}
                  <span>{user.role?.name || "No Role"}</span>
                </div>

                {/* Role Selector */}
                <div style={styles.roleSelector}>
                  <select
                    disabled={isUpdating}
                    onChange={(e) => assignRole(user._id, e.target.value)}
                    defaultValue=""
                    style={styles.select}
                  >
                    <option value="">Change Role</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </select>

                  {isUpdating ? (
                    <div style={styles.updatingBadge}>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <ChevronDown className="w-4 h-4" style={styles.selectArrow} />
                  )}
                </div>

                {/* Update Status */}
                {isUpdating && (
                  <div style={styles.updateStatus}>
                    <div style={styles.updateSpinner} />
                    <span>Updating role...</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    padding: "32px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // Loading
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    gap: "16px",
  },
  loadingSpinner: {
    color: "#3b82f6",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
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
    margin: "4px 0 0 0",
  },
  addButton: {
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
    whiteSpace: "nowrap",
  },
  addButtonHover: {
    backgroundColor: "#1e293b",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
  },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3b82f6",
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

  // Filters
  filtersContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: "1",
    minWidth: "250px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    padding: "10px 40px 10px 40px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s",
  },
  clearSearch: {
    position: "absolute",
    right: "12px",
    backgroundColor: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
  },
  filterWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    minWidth: "180px",
  },
  filterIcon: {
    position: "absolute",
    left: "12px",
    color: "#94a3b8",
  },
  filterSelect: {
    width: "100%",
    padding: "10px 16px 10px 36px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    transition: "all 0.2s",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "relative",
  },
  cardHover: {
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    borderColor: "#cbd5e1",
    transform: "translateY(-2px)",
  },

  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    objectFit: "cover",
  },
  avatarText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#475569",
  },
  statusDot: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    border: "2px solid #ffffff",
  },

  userInfo: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  name: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  emailWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  emailIcon: {
    color: "#94a3b8",
    flexShrink: 0,
  },
  email: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid",
    width: "fit-content",
  },

  roleSelector: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  select: {
    width: "100%",
    padding: "8px 36px 8px 14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    transition: "all 0.2s",
  },
  selectArrow: {
    position: "absolute",
    right: "12px",
    color: "#94a3b8",
    pointerEvents: "none",
  },

  updatingBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    backgroundColor: "#eff6ff",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#3b82f6",
    fontWeight: "500",
  },

  updateStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#f0fdf4",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#15803d",
    fontWeight: "500",
  },
  updateSpinner: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "2px solid #bbf7d0",
    borderTopColor: "#15803d",
    animation: "spin 0.6s linear infinite",
  },

  // Empty state
  emptyState: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "2px dashed #e2e8f0",
  },
  emptyIcon: {
    color: "#94a3b8",
    marginBottom: "12px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },
};

// Add this to your global CSS or component
const globalStyles = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  select:hover {
    border-color: #94a3b8;
  }
  
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;