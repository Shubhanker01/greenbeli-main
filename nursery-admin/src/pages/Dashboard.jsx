import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Sprout,
  PhoneCall,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Users,
  FileText,
  Star,
  BookOpen,
  CircleHelp,
  Calendar,
  RefreshCw,
  Layers,
  ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getDashboardStatsApi, getSalesAnalyticsApi } from "../utils/adminApi";

// Primary KPI Cards configuration
const KPI_CARDS = [
  {
    key: "totalProducts",
    label: "Active Products",
    note: "In live catalog",
    to: "/products",
    icon: Sprout,
    iconBox: "bg-emerald-50 text-emerald-700",
    borderColor: "hover:border-emerald-300",
  },
  {
    key: "totalCustomers",
    label: "Registered Users",
    note: "Customer accounts",
    to: "/customers",
    icon: Users,
    iconBox: "bg-sky-50 text-sky-700",
    borderColor: "hover:border-sky-300",
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    note: "Online store orders",
    to: "/orders",
    icon: ShoppingBag,
    iconBox: "bg-indigo-50 text-indigo-700",
    borderColor: "hover:border-indigo-300",
  },
  {
    key: "inquiryLeads",
    label: "Inquiry Leads",
    note: "Submitted leads",
    to: "/leads",
    icon: PhoneCall,
    iconBox: "bg-amber-50 text-amber-700",
    borderColor: "hover:border-amber-300",
  },
  {
    key: "totalProposals",
    label: "Landscape Proposals",
    note: "Projects planned",
    to: "/proposals",
    icon: FileText,
    iconBox: "bg-teal-50 text-teal-700",
    borderColor: "hover:border-teal-300",
  },
  {
    key: "totalTestimonials",
    label: "Customer Reviews",
    note: "Feedback & rating",
    to: "/testimonials",
    icon: Star,
    iconBox: "bg-rose-50 text-rose-700",
    borderColor: "hover:border-rose-300",
  },
  {
    key: "totalJournals",
    label: "Journal Articles",
    note: "Plant care guides",
    to: "/journals",
    icon: BookOpen,
    iconBox: "bg-violet-50 text-violet-700",
    borderColor: "hover:border-violet-300",
  },
  {
    key: "totalFaqs",
    label: "Knowledge FAQs",
    note: "Help center items",
    to: "/faqs",
    icon: CircleHelp,
    iconBox: "bg-cyan-50 text-cyan-700",
    borderColor: "hover:border-cyan-300",
  },
];

const PIE_COLORS = ["#059669", "#6366f1", "#f59e0b", "#0284c7", "#ec4899", "#14b8a6"];

// Custom Tooltip for Area & Bar Charts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-xs min-w-[180px] space-y-2">
        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, idx) => (
            <div key={`item-${idx}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-semibold text-white">
                {typeof entry.value === "number" && entry.value >= 100
                  ? `₹${entry.value.toLocaleString("en-IN")}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Pie Tooltip
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
        <p className="font-semibold text-slate-300">{data.name}</p>
        <p className="text-emerald-400 font-bold text-sm mt-0.5">
          {data.value.toLocaleString("en-IN")} units
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [monthsRange, setMonthsRange] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, analyticsData] = await Promise.all([
        getDashboardStatsApi().catch((err) => {
          console.warn("Failed to load dashboard stats:", err);
          return null;
        }),
        getSalesAnalyticsApi(monthsRange).catch((err) => {
          console.warn("Failed to load sales analytics:", err);
          return null;
        }),
      ]);

      if (!statsData && !analyticsData) {
        throw new Error("Unable to load dashboard data. Please try again later.");
      }

      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (requestError) {
      setError(requestError.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [monthsRange]);

  // Derived financial & growth stats
  const totalGrossRevenue = useMemo(() => {
    if (analytics?.summary?.orderRevenue != null) {
      return analytics.summary.orderRevenue;
    }
    return stats?.orderRevenue ?? 0;
  }, [analytics, stats]);

  const totalDeliveredRevenue = analytics?.summary?.orderRevenue ?? stats?.orderRevenue ?? 0;

  // Chart datasets
  const revenueChartData = useMemo(() => {
    if (analytics?.chart && analytics.chart.length > 0) {
      return analytics.chart;
    }
    // Fallback placeholder data if analytics is empty
    return [
      { month: "Nov", orderRevenue: 12000, totalRevenue: 12000, orderCount: 14 },
      { month: "Dec", orderRevenue: 18500, totalRevenue: 18500, orderCount: 22 },
      { month: "Jan", orderRevenue: 16000, totalRevenue: 16000, orderCount: 19 },
      { month: "Feb", orderRevenue: 24500, totalRevenue: 24500, orderCount: 31 },
      { month: "Mar", orderRevenue: 29000, totalRevenue: 29000, orderCount: 38 },
      { month: "Apr", orderRevenue: 34000, totalRevenue: 34000, orderCount: 45 },
    ];
  }, [analytics]);

  // Catalog & Content distribution for Pie Chart
  const distributionData = useMemo(() => {
    const items = [
      { name: "Plants & Products", value: stats?.totalProducts || 0 },
      { name: "Proposals", value: stats?.totalProposals || 0 },
      { name: "Inquiry Leads", value: stats?.inquiryLeads || 0 },
      { name: "Testimonials", value: stats?.totalTestimonials || 0 },
      { name: "Journals", value: stats?.totalJournals || 0 },
      { name: "FAQs", value: stats?.totalFaqs || 0 },
    ];
    // Filter out 0 values if there are non-zero values, otherwise keep minimal
    const hasValues = items.some((item) => item.value > 0);
    return hasValues ? items.filter((item) => item.value > 0) : items;
  }, [stats]);

  // Overall counts for Bar Chart
  const orderVolumeData = useMemo(() => {
    return revenueChartData.map((d) => ({
      month: d.month,
      "Online Orders": d.orderCount || 0,
    }));
  }, [revenueChartData]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-8">
      {/* Top Header / Executive Summary Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              Executive Analytics
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Real-time Nursery Metrics</span>
          </div>
          <h1 className="serif-font text-3xl font-bold text-slate-900 mt-1">
            Nursery Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm text-xs font-semibold text-slate-600">
            <Calendar className="w-3.5 h-3.5 ml-2 text-slate-400" />
            <select
              value={monthsRange}
              onChange={(e) => setMonthsRange(Number(e.target.value))}
              className="bg-transparent px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
            >
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
            </select>
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 shadow-sm transition disabled:opacity-50"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-700" : ""}`} />
          </button>

          <Link
            to="/products/new"
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition flex items-center gap-1.5 shadow-md shadow-emerald-900/10"
          >
            <Plus className="w-4 h-4" /> Add Plant
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Total Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-200">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="serif-font text-3xl sm:text-4xl font-extrabold tracking-tight">
              {loading ? "…" : `₹${totalGrossRevenue.toLocaleString("en-IN")}`}
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1.5 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              Delivered Store Orders
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Delivered Store Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="serif-font text-3xl font-bold text-slate-900">
              {loading ? "…" : `₹${totalDeliveredRevenue.toLocaleString("en-IN")}`}
            </h3>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                {analytics?.summary?.deliveredOrders ?? stats?.totalOrders ?? 0} Orders Fulfilled
              </span>
              <Link to="/orders" className="text-xs font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5">
                View orders <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Growth Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="serif-font text-xl font-bold text-slate-900">
                  Revenue Growth Trends
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Delivered eCommerce orders revenue over the selected timeline.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-slate-600">Online Store</span>
              </div>
            </div>
          </div>

          <div className="h-[310px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orderRevenue"
                  name="Online Store"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#orderGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content & Catalog Breakdown Donut/Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="serif-font text-lg font-bold text-slate-900">
                Data & Catalog Spread
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown across products, leads, proposals & content.
            </p>
          </div>

          <div className="h-[210px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catalog</span>
              <span className="serif-font text-xl font-black text-slate-900">
                {(stats?.totalProducts ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {distributionData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-[11px]">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Volume Bar Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="serif-font text-xl font-bold text-slate-900">
              Transaction Volume & Order Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly quantity of website customer orders.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-600" />
              <span className="text-slate-600">Online Orders</span>
            </div>
          </div>
        </div>

        <div className="h-[260px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderVolumeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Bar dataKey="Online Orders" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Navigation KPI Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="serif-font text-lg font-bold text-slate-900">
              Department & Resource Overview
            </h3>
            <p className="text-xs text-slate-500">
              Quick access cards for all catalog, inventory, reviews, and customer activities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {KPI_CARDS.map(({ key, label, note, to, icon: Icon, iconBox, borderColor }) => (
            <Link
              key={key}
              to={to}
              className={`group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${borderColor}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {label}
                </span>
                <div className={`w-9 h-9 shrink-0 rounded-2xl flex items-center justify-center ${iconBox} transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="serif-font text-2xl font-bold text-slate-900">
                  {loading ? "…" : (stats?.[key] ?? 0).toLocaleString("en-IN")}
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-between mt-1 group-hover:text-emerald-700 transition-colors">
                  <span>{note}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
