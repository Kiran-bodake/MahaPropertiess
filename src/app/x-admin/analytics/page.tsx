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
} from "lucide-react";

import { DashboardLayout } from "@/components/admin/layout/DashboardLayout";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#9333ea",
];

const REFRESH_INTERVAL = 10000;

export default function AnalyticsPage() {

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState("");

  const [stats, setStats] =
    useState({

      totalProperties: 0,

      totalLeads: 0,

      totalRevenue: 0,

      conversionRate: 0,

    });

  const [chartData, setChartData] =
    useState<any[]>([]);

  const [propertyTypeData, setPropertyTypeData] =
    useState<any[]>([]);



  useEffect(() => {

    let intervalId: ReturnType<typeof setInterval>;

    const fetchAnalytics = async () => {

      try {

        const response =
          await fetch(
            "/api/admin/dashboard",
            { cache: "no-store" }
          );

        const data =
          await response.json();



        setStats({

          totalProperties:
            data?.propertiesCount || 0,

          totalLeads:
            data?.leadsCount || 0,

          totalRevenue:
            data?.totalRevenue || 0,

          conversionRate:
            data?.conversionRate || 0,

        });



        setChartData(

          data?.chartData || []

        );



        setPropertyTypeData(

          data?.propertyTypeData || [

            {
              name: "Plots",
              value: 45,
            },

            {
              name: "Flats",
              value: 30,
            },

            {
              name: "Villas",
              value: 15,
            },

            {
              name: "Commercial",
              value: 10,
            },

          ]

        );

        setLastUpdated(
          new Date().toLocaleTimeString()
        );

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };



    fetchAnalytics();
    intervalId = setInterval(fetchAnalytics, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);

  }, []);




  const cards = [

    {
      title: "Total Properties",

      value: stats.totalProperties,

      icon: Building2,

      bg: "#eff6ff",

      color: "#2563eb",

      growth: "+12%",
    },

    {
      title: "Total Leads",

      value: stats.totalLeads,

      icon: Users,

      bg: "#f0fdf4",

      color: "#16a34a",

      growth: "+18%",
    },

    {
      title: "Revenue",

      value: `₹${stats.totalRevenue}`,

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




  if (loading) {

    return (

      <DashboardLayout title="Analytics">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
          }}
        >

          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "999px",
              border: "5px solid #dbeafe",
              borderTop: "5px solid #2563eb",
              animation:
                "spin 1s linear infinite",
            }}
          />

        </div>

      </DashboardLayout>

    );

  }




  return (

    <DashboardLayout
      title="Analytics"
      subtitle="Realtime business insights & property performance"
    >

      {/* KPI CARDS */}

      {lastUpdated ? (
        <p
          style={{
            marginBottom: "18px",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          Updated at {lastUpdated}
        </p>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >

        {cards.map((card, idx) => {

          const Icon = card.icon;

          return (

            <div
              key={idx}
              style={{
                background: "#ffffff",
                borderRadius: "28px",
                border: "1px solid #edf2f7",
                padding: "24px",
                boxShadow:
                  "0 10px 40px rgba(15,23,42,.05)",
                transition: "0.3s",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >

                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "18px",
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  <Icon
                    size={30}
                    color={card.color}
                  />

                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#f0fdf4",
                    color: "#16a34a",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >

                  <BadgeCheck size={16} />

                  {card.growth}

                </div>

              </div>



              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {card.title}
              </p>



              <h2
                style={{
                  marginTop: "14px",
                  marginBottom: 0,
                  fontSize: "40px",
                  fontWeight: 900,
                  color: "#111827",
                  letterSpacing: "-0.04em",
                }}
              >
                {card.value}
              </h2>

            </div>

          );

        })}

      </div>




      {/* CHART GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >

        {/* LINE CHART */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "30px",
            padding: "28px",
            border: "1px solid #edf2f7",
            boxShadow:
              "0 10px 40px rgba(15,23,42,.05)",
          }}
        >

          <div
            style={{
              marginBottom: "28px",
            }}
          >

            <h2
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-0.03em",
              }}
            >
              Monthly Growth
            </h2>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "#6b7280",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              Track property listings and
              customer inquiries growth
            </p>

          </div>



          <ResponsiveContainer
            width="100%"
            height={360}
          >

            <LineChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="properties"
                stroke="#2563eb"
                strokeWidth={4}
                name="Properties"
              />

              <Line
                type="monotone"
                dataKey="leads"
                stroke="#16a34a"
                strokeWidth={4}
                name="Leads"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>




        {/* PIE CHART */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "30px",
            padding: "28px",
            border: "1px solid #edf2f7",
            boxShadow:
              "0 10px 40px rgba(15,23,42,.05)",
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 900,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            Property Types
          </h2>

          <p
            style={{
              marginTop: "10px",
              marginBottom: "24px",
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Property category distribution
          </p>



          <ResponsiveContainer
            width="100%"
            height={360}
          >

            <PieChart>

              <Pie
                data={propertyTypeData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >

                {propertyTypeData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>




      {/* BAR CHART */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "30px",
          padding: "28px",
          border: "1px solid #edf2f7",
          boxShadow:
            "0 10px 40px rgba(15,23,42,.05)",
        }}
      >

        <div
          style={{
            marginBottom: "28px",
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 900,
              color: "#111827",
              letterSpacing: "-0.03em",
            }}
          >
            Deals Overview
          </h2>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#6b7280",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            Monthly property deal conversion
            analytics
          </p>

        </div>



        <ResponsiveContainer
          width="100%"
          height={360}
        >

          <BarChart
            data={chartData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="deals"
              fill="#9333ea"
              radius={[10, 10, 0, 0]}
              name="Deals"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </DashboardLayout>

  );

}