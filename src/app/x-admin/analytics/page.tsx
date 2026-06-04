"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  Building2,
  IndianRupee,
  BadgeCheck,
  RefreshCw,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#9333ea"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const [stats, setStats] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<any[]>([]);

  const connectSSE = () => {
    if (eventSource) {
      eventSource.close();
    }

    const es = new EventSource("http://localhost:3000/api/admin/dashboard/stream");
    setEventSource(es);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;

        setStats({
          totalProperties: data.propertiesCount ?? 0,
          totalLeads: data.inquiriesCount ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
          conversionRate: data.conversionRate ?? 0,
        });

        if (data.chartData && Array.isArray(data.chartData)) {
          setChartData(data.chartData);
        }
        if (data.propertyTypeData && Array.isArray(data.propertyTypeData)) {
          setPropertyTypeData(data.propertyTypeData);
        }

        setLastUpdated(new Date(data.timestamp || Date.now()));
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("SSE parse error:", err);
        setError("Invalid data received.");
      }
    };

    es.onerror = () => {
      es.close();
      setEventSource(null);
      setError("Connection lost. Refresh the page.");
      setLoading(false);
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    connectSSE();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    connectSSE();
    return () => eventSource?.close();
  }, []);

  const cards = [
    {
      title: "Properties",
      value: stats.totalProperties,
      icon: Building2,
      bg: "#eff6ff",
      color: "#2563eb",
      growth: "+15%",
    },
    {
      title: "Leads",
      value: stats.totalLeads,
      icon: Users,
      bg: "#f0fdf4",
      color: "#16a34a",
      growth: "+18%",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      bg: "#fff7ed",
      color: "#ea580c",
      growth: "+22%",
    },
    {
      title: "Conversion",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      bg: "#faf5ff",
      color: "#9333ea",
      growth: "+9%",
    },
  ];

  if (loading && chartData.length === 0) {
    return (
      <DashboardLayout title="Analytics">
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p>Waiting for live data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics" subtitle="Real‑time insights & performance">
      <div style={styles.pageWrapper}>
        <div style={styles.headerBar}>
          <div style={styles.timestamp}>
            {lastUpdated && (
              <>
                <Clock size={12} color="#94a3b8" />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </>
            )}
          </div>
          <button style={styles.refreshButton} onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={14} style={refreshing ? { animation: "spin 0.8s linear infinite" } : undefined} />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>

        {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

        {/* KPI Cards - Compact */}
        <div style={styles.kpiGrid}>
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} style={styles.kpiCard}>
                <div style={styles.kpiTop}>
                  <div style={{ ...styles.iconBox, backgroundColor: card.bg }}>
                    <Icon size={18} color={card.color} />
                  </div>
                  <div style={styles.growthBadge}>
                    <BadgeCheck size={10} />
                    {card.growth}
                  </div>
                </div>
                <p style={styles.kpiTitle}>{card.title}</p>
                <h2 style={styles.kpiValue}>{card.value}</h2>
              </div>
            );
          })}
        </div>

        {/* Charts - More compact with fixed heights */}
        <div style={styles.chartsArea}>
          <div style={styles.chartRow}>
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h2>Monthly Trends</h2>
                <p>Properties & leads</p>
              </div>
              <div style={styles.lineChartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="properties" stroke="#2563eb" strokeWidth={2} dot={false} name="Properties" />
                    <Line type="monotone" dataKey="inquiries" stroke="#16a34a" strokeWidth={2} dot={false} name="Leads" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h2>Property Types</h2>
                <p>Distribution</p>
              </div>
              <div style={styles.pieChartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {propertyTypeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={styles.barRow}>
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h2>Deals Overview</h2>
                <p>Monthly conversions</p>
              </div>
              <div style={styles.barChartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="deals" fill="#9333ea" radius={[4, 4, 0, 0]} barSize={28} name="Deals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #e2e8f0",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    height: "calc(100vh - 70px)",
    overflow: "auto",
    paddingRight: 2,
  },
  headerBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  timestamp: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#64748b",
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  errorBanner: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    flexShrink: 0,
  },
  kpiCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #edf2f7",
    padding: "14px 16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  kpiTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  growthBadge: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    padding: "2px 8px",
    borderRadius: 20,
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: 11,
    fontWeight: 600,
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: 500,
    color: "#64748b",
    margin: 0,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    margin: "4px 0 0",
    letterSpacing: "-0.02em",
  },
  chartsArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: 0,
  },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 12,
    flex: 1,
    minHeight: 0,
  },
  barRow: {
    flex: 0.8,
    minHeight: 0,
  },
  chartCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #edf2f7",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  chartHeader: {
    marginBottom: 8,
    flexShrink: 0,
  },
  lineChartContainer: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  pieChartContainer: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  barChartContainer: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
};

// Inject global keyframes for spin animation (since inline styles don't support keyframes)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}