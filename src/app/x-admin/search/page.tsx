"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Home,
  Users,
  Phone,
  FileText,
  Building,
  Calendar,
  ArrowRight,
  Loader,
  X,
  Filter,
  Clock,
  TrendingUp,
} from "lucide-react";

interface SearchResult {
  _id: string;
  type: "property" | "lead" | "contact" | "deal" | "booking";
  title: string;
  subtitle: string;
  status?: string;
  date?: string;
  url: string;
}

// Mock data - Replace with actual API call
const mockResults: SearchResult[] = [
  {
    _id: "1",
    type: "property",
    title: "Luxury Villa in Beverly Hills",
    subtitle: "5 BHK • 4,500 sqft • $2.5M",
    status: "Active",
    date: "2024-01-15",
    url: "/x-admin/properties/1",
  },
  {
    _id: "2",
    type: "lead",
    title: "John Smith",
    subtitle: "Interested in Commercial Property",
    status: "Hot",
    date: "2024-01-14",
    url: "/x-admin/leads/2",
  },
  {
    _id: "3",
    type: "contact",
    title: "Sarah Johnson",
    subtitle: "sarah@example.com • +1 234-567-8900",
    status: "New",
    date: "2024-01-13",
    url: "/x-admin/contacts/3",
  },
  {
    _id: "4",
    type: "deal",
    title: "Deal #1234 - Ocean View Apartment",
    subtitle: "Buyer: Michael Brown • Agent: Lisa Davis",
    status: "In Progress",
    date: "2024-01-12",
    url: "/x-admin/deals/4",
  },
  {
    _id: "5",
    type: "booking",
    title: "Site Visit - Green Valley Plot",
    subtitle: "Scheduled: Jan 20, 2024 • 11:00 AM",
    status: "Confirmed",
    date: "2024-01-11",
    url: "/x-admin/bookings/5",
  },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  property: { icon: Home, color: "#3b82f6", bg: "#eff6ff", label: "Property" },
  lead: { icon: Users, color: "#10b981", bg: "#ecfdf5", label: "Lead" },
  contact: { icon: Phone, color: "#a855f7", bg: "#faf5ff", label: "Contact" },
  deal: { icon: FileText, color: "#f59e0b", bg: "#fffbeb", label: "Deal" },
  booking: { icon: Calendar, color: "#ef4444", bg: "#fef2f2", label: "Booking" },
};

const filterTypes = ["All", "Property", "Lead", "Contact", "Deal", "Booking"];

export default function AdminSearchPage() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Luxury Villa",
    "Commercial Space",
    "John Smith",
    "Green Valley",
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize query from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") ?? "";
      setQuery(q);
      setSearchQuery(q);
      if (q) {
        performSearch(q);
      }
    }
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call - Replace with actual API
    setTimeout(() => {
      const filtered = mockResults.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 500);

    // Actual API call would be:
    // try {
    //   const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchTerm)}`);
    //   const data = await response.json();
    //   setResults(data);
    // } catch (error) {
    //   console.error("Search failed:", error);
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchQuery);
      window.history.pushState({}, "", url.toString());
      
      setQuery(searchQuery);
      performSearch(searchQuery);
      setShowSuggestions(false);

      // Save to recent searches
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev].slice(0, 5));
      }
    }
  };

  // Filter results
  const filteredResults = activeFilter === "All"
    ? results
    : results.filter((item) => typeConfig[item.type].label === activeFilter);

  // Get result counts by type
  const resultCounts = results.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Global Search</h1>
          <p style={styles.subtitle}>
            Search across properties, leads, contacts, deals, and bookings
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchInputWrapper}>
            <Search size={20} color="#9ca3af" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for properties, leads, contacts, deals..."
              style={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                  setShowSuggestions(false);
                }}
                style={styles.clearButton}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button type="submit" style={styles.searchButton}>
            <Search size={18} />
            Search
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && !loading && results.length === 0 && (
          <div style={styles.suggestionsDropdown}>
            <div style={styles.suggestionsHeader}>
              <Clock size={14} color="#9ca3af" />
              <span>Recent Searches</span>
            </div>
            {recentSearches
              .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search);
                    setQuery(search);
                    performSearch(search);
                    setShowSuggestions(false);
                  }}
                  style={styles.suggestionItem}
                >
                  <Clock size={14} color="#9ca3af" />
                  <span>{search}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      {query && !loading && (
        <div style={styles.resultsHeader}>
          <div style={styles.resultsInfo}>
            <h2 style={styles.resultsTitle}>
              {filteredResults.length > 0
                ? `Showing ${filteredResults.length} result${filteredResults.length > 1 ? "s" : ""} for`
                : "No results found for"}
            </h2>
            <span style={styles.queryText}>"{query}"</span>
          </div>

          {results.length > 0 && (
            <div style={styles.resultStats}>
              {Object.entries(resultCounts).map(([type, count]) => {
                const config = typeConfig[type];
                const Icon = config.icon;
                return (
                  <div key={type} style={styles.statBadge}>
                    <Icon size={12} color={config.color} />
                    <span style={{ color: config.color }}>
                      {count} {config.label}{count > 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      {results.length > 0 && (
        <div style={styles.filterBar}>
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              style={{
                ...styles.filterTab,
                ...(activeFilter === type ? styles.filterTabActive : {}),
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <Loader size={32} color="#3b82f6" className="animate-spin" />
          <p style={styles.loadingText}>Searching...</p>
        </div>
      )}

      {/* Results List */}
      {!loading && filteredResults.length > 0 && (
        <div style={styles.resultsGrid}>
          {filteredResults.map((result) => {
            const config = typeConfig[result.type];
            const Icon = config.icon;

            return (
              <a
                key={result._id}
                href={result.url}
                style={styles.resultCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.06)";
                }}
              >
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div
                    style={{
                      ...styles.typeIcon,
                      backgroundColor: config.bg,
                    }}
                  >
                    <Icon size={20} color={config.color} />
                  </div>
                  <div style={styles.cardHeaderInfo}>
                    <h3 style={styles.cardTitle}>{result.title}</h3>
                    <span
                      style={{
                        ...styles.typeLabel,
                        color: config.color,
                        backgroundColor: config.bg,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <ArrowRight size={18} color="#d1d5db" />
                </div>

                {/* Card Body */}
                <p style={styles.cardSubtitle}>{result.subtitle}</p>

                {/* Card Footer */}
                <div style={styles.cardFooter}>
                  {result.status && (
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          result.status === "Active" || result.status === "Hot"
                            ? "#ecfdf5"
                            : result.status === "New"
                            ? "#eff6ff"
                            : "#fffbeb",
                        color:
                          result.status === "Active" || result.status === "Hot"
                            ? "#166534"
                            : result.status === "New"
                            ? "#1e40af"
                            : "#92400e",
                      }}
                    >
                      {result.status}
                    </span>
                  )}
                  {result.date && (
                    <span style={styles.dateText}>
                      <Calendar size={12} />
                      {new Date(result.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && query && filteredResults.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Search size={48} color="#d1d5db" />
          </div>
          <h3 style={styles.emptyTitle}>No results found</h3>
          <p style={styles.emptyText}>
            We couldn't find any matches for "{query}". Try adjusting your
            search terms or browse through the categories.
          </p>
          <div style={styles.emptySuggestions}>
            <p style={styles.emptySuggestionsTitle}>Suggestions:</p>
            <ul style={styles.emptySuggestionsList}>
              <li>Check for spelling errors</li>
              <li>Use more general keywords</li>
              <li>Try searching by name, email, or property type</li>
            </ul>
          </div>
        </div>
      )}

      {/* Initial State - No Search */}
      {!query && !loading && (
        <div style={styles.initialState}>
          <div style={styles.initialIcon}>
            <Search size={64} color="#d1d5db" />
          </div>
          <h2 style={styles.initialTitle}>Global Search</h2>
          <p style={styles.initialText}>
            Search across your entire database including properties, leads,
            contacts, deals, and bookings.
          </p>

          {/* Quick Access Cards */}
          <div style={styles.quickAccessGrid}>
            {Object.entries(typeConfig).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSearchQuery(type);
                    setQuery(type);
                    performSearch(type);
                  }}
                  style={styles.quickAccessCard}
                >
                  <div
                    style={{
                      ...styles.quickAccessIcon,
                      backgroundColor: config.bg,
                    }}
                  >
                    <Icon size={24} color={config.color} />
                  </div>
                  <span style={styles.quickAccessLabel}>{config.label}s</span>
                </button>
              );
            })}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div style={styles.recentSearches}>
              <h3 style={styles.recentTitle}>
                <Clock size={16} color="#9ca3af" />
                Recent Searches
              </h3>
              <div style={styles.recentList}>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search);
                      setQuery(search);
                      performSearch(search);
                    }}
                    style={styles.recentItem}
                  >
                    <TrendingUp size={14} color="#9ca3af" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
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
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },

  // Header
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginTop: "8px",
    fontWeight: 500,
  },

  // Search
  searchContainer: {
    position: "relative",
    marginBottom: "32px",
  },
  searchForm: {
    display: "flex",
    gap: "12px",
  },
  searchInputWrapper: {
    flex: 1,
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "2px solid #e2e8f0",
    padding: "0 20px",
    transition: "all 0.2s ease",
  },
  searchInput: {
    width: "100%",
    padding: "16px 40px 16px 14px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    color: "#0f172a",
    backgroundColor: "transparent",
    fontFamily: "inherit",
  },
  clearButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 28px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },

  // Suggestions
  suggestionsDropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
    padding: "12px",
    zIndex: 100,
  },
  suggestionsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  suggestionItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    borderRadius: "10px",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  },

  // Results Header
  resultsHeader: {
    marginBottom: "24px",
  },
  resultsInfo: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginBottom: "12px",
  },
  resultsTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  queryText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#3b82f6",
    fontStyle: "italic",
  },
  resultStats: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  statBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    fontSize: "12px",
    fontWeight: 600,
  },

  // Filter Tabs
  filterBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  filterTab: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  filterTabActive: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderColor: "#3b82f6",
  },

  // Loading
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    gap: "16px",
  },
  loadingText: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#6b7280",
  },

  // Results Grid
  resultsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  resultCard: {
    display: "block",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    textDecoration: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "12px",
  },
  typeIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardHeaderInfo: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  typeLabel: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 14px 0",
    lineHeight: 1.5,
    paddingLeft: "58px",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingLeft: "58px",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
  },
  dateText: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#9ca3af",
    fontWeight: 500,
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  emptyIcon: {
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 12px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
    margin: "0 0 24px 0",
  },
  emptySuggestions: {
    textAlign: "left",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "16px 20px",
    border: "1px solid #e2e8f0",
  },
  emptySuggestionsTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#64748b",
    margin: "0 0 8px 0",
  },
  emptySuggestionsList: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: 1.8,
  },

  // Initial State
  initialState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  initialIcon: {
    marginBottom: "24px",
  },
  initialTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 12px 0",
  },
  initialText: {
    fontSize: "15px",
    color: "#64748b",
    maxWidth: "500px",
    margin: "0 auto 40px",
    lineHeight: 1.6,
  },

  // Quick Access
  quickAccessGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    maxWidth: "800px",
    margin: "0 auto 40px",
  },
  quickAccessCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  quickAccessIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  quickAccessLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },

  // Recent Searches
  recentSearches: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  recentTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#9ca3af",
    marginBottom: "12px",
  },
  recentList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
  },
  recentItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
};