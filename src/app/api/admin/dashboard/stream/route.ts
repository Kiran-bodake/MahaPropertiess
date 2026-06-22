import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Deal from "@/models/Deal";
import Task from "@/models/Task";
import Property from "@/models/Property";
import PropertyInquiry from "@/models/PropertyInquiry";
import PropertyFlag from "@/models/PropertyFlags";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const safeEnqueue = (data: any) => {
        if (isClosed) return;

        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          isClosed = true;
        }
      };

      let interval: NodeJS.Timeout;
      let heartbeat: NodeJS.Timeout;

      const stop = () => {
        isClosed = true;
        clearInterval(interval);
        clearInterval(heartbeat);
        controller.close();
      };

      try {
        await connectDB();

        const sendDashboardData = async () => {

          // =========================
          // BASE COUNTS (ALL TIME)
          // =========================
          const [
            inquiriesCount,
            dealsCount,
            tasksCount,
            totalProperties,

            activeProperties,
            featuredProperties,
            verifiedProperties,
            zeroBrokerageProperties,
          ] = await Promise.all([
            PropertyInquiry.countDocuments(),
            Deal.countDocuments(),
            Task.countDocuments(),
            Property.countDocuments(),

            PropertyFlag.countDocuments({ isActive: true }),
            PropertyFlag.countDocuments({ isFeatured: true }),
            PropertyFlag.countDocuments({ isVerified: true }),
            PropertyFlag.countDocuments({ isZeroBrokerage: true }),
          ]);

          // =========================
          // 🔥 CHANGED: DATE RANGES FOR MONTH-OVER-MONTH
          // =========================
          const now = new Date();

          // This month (from 1st of this month to now)
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          // Last month (from 1st of last month to end of last month)
          const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month

          // =========================
          // 🔥 CHANGED: MONTH-OVER-MONTH COMPARISON DATA
          // =========================
          const [
            currentInquiries,
            previousInquiries,
            currentProperties,
            previousProperties,
            currentDeals,
            previousDeals,
          ] = await Promise.all([
            // This month's inquiries
            PropertyInquiry.countDocuments({
              createdAt: { $gte: thisMonthStart },
            }),
            // Last month's inquiries
            PropertyInquiry.countDocuments({
              createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
            }),
            // This month's properties
            Property.countDocuments({
              createdAt: { $gte: thisMonthStart },
            }),
            // Last month's properties
            Property.countDocuments({
              createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
            }),
            // This month's deals
            Deal.countDocuments({
              createdAt: { $gte: thisMonthStart },
            }),
            // Last month's deals
            Deal.countDocuments({
              createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
            }),
          ]);

          // =========================
          // MONTHLY TREND (LAST 12 MONTHS)
          // =========================
          const year = new Date().getFullYear();

          const months = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
          ];

          const chartData = await Promise.all(
            months.map(async (_, i) => {
              const start = new Date(year, i, 1);
              const end = new Date(year, i + 1, 1);

              const [properties, inquiries] = await Promise.all([
                Property.countDocuments({
                  createdAt: { $gte: start, $lt: end },
                }),
                PropertyInquiry.countDocuments({
                  createdAt: { $gte: start, $lt: end },
                }),
              ]);

              return {
                month: months[i],
                properties,
                inquiries,
                deals: Math.floor(inquiries * 0.3), // Or actual deals if you have them
              };
            })
          );

          // =========================
          // PROPERTY TYPE BREAKDOWN
          // =========================
          const [commercial, residential, shopShowroom] =
            await Promise.all([
              Property.countDocuments({ category: "commercial" }),
              Property.countDocuments({ category: "residential" }),
              Property.countDocuments({
                categoryLabel: { $regex: /shop|showroom/i },
              }),
            ]);

          const conversionRate =
            inquiriesCount > 0
              ? Math.round((dealsCount / inquiriesCount) * 100)
              : 0;

          const totalRevenue = dealsCount * 50000;

          // =========================
          // RESPONSE
          // =========================
          safeEnqueue({
            success: true,

            // =========================
            // KPI (ALL TIME)
            // =========================
            propertiesCount: totalProperties,
            inquiriesCount,
            dealsCount,
            tasksCount,

            activeProperties,
            featuredProperties,
            verifiedProperties,
            saleProperties: zeroBrokerageProperties,

            conversionRate,
            totalRevenue,

            chartData,

            propertyTypeData: [
              { name: "Commercial", value: commercial },
              { name: "Residential", value: residential },
              { name: "Shop/Showroom", value: shopShowroom },
            ],

            // =========================
            // 🔥 CHANGED: MONTH-OVER-MONTH COMPARISON
            // =========================
            currentPeriod: {
              inquiries: currentInquiries,
              properties: currentProperties,
              deals: currentDeals,
            },

            previousPeriod: {
              inquiries: previousInquiries,
              properties: previousProperties,
              deals: previousDeals,
            },

            timestamp: Date.now(),
          });
        };

        // initial connection event
        safeEnqueue({ type: "connected" });

        await sendDashboardData();

        // refresh every 5 seconds
        interval = setInterval(() => {
          sendDashboardData().catch(console.error);
        }, 5000);

        // heartbeat
        heartbeat = setInterval(() => {
          safeEnqueue({ heartbeat: true });
        }, 30000);

        req.signal.addEventListener("abort", stop);
      } catch (err) {
        console.error("SSE error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}