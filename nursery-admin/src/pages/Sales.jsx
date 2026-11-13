import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  PackageCheck,
  Store,
  RefreshCw,
  Calendar,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { getSalesAnalyticsApi } from "../utils/adminApi";

const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-100 text-xs space-y-1.5">
        <p className="font-bold text-slate-800 text-sm mb-1">{label}</p>
        <p className="text-emerald-700 font-semibold flex items-center justify-between gap-4">
          <span>Delivered Orders:</span>
          <span>{formatCurrency(payload[0]?.value)}</span>
        </p>
        {payload[1] && (
          <p className="text-indigo-600 font-semibold flex items-center justify-between gap-4">
            <span>POS Sales:</span>
            <span>{formatCurrency(payload[1]?.value)}</span>
          </p>
        )}
        <div className="border-t border-slate-100 pt-1 mt-1 text-slate-900 font-extrabold flex items-center justify-between gap-4">
          <span>Total Monthly:</span>
          <span>
            {formatCurrency(
              (Number(payload[0]?.value) || 0) + (Number(payload[1]?.value) || 0)
            )}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Sales() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthsRange, setMonthsRange] = useState(12);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSalesAnalyticsApi(monthsRange);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to load sales analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [monthsRange]);

  const summary = analytics?.summary || {};
  const chartData = analytics?.chart || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Sales & Revenue Analytics
          </span>
          <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
            Sales Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time track of delivered revenue, total orders, and all-over sales performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm text-xs font-semibold text-slate-600">
            <Calendar className="w-3.5 h-3.5 ml-2 text-slate-400" />
            <select
              value={monthsRange}
              onChange={(e) => setMonthsRange(Number(e.target.value))}
              className="bg-transparent px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
            >
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
              <option value={24}>Last 24 Months</option>
            </select>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 shadow-sm transition disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-700" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Delivered Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Delivered Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="serif-font text-3xl font-extrabold text-slate-900">
              {loading ? "…" : formatCurrency(summary.orderRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>{summary.deliveredOrders ?? 0} delivered orders</span>
            </div>
          </div>
        </div>

        {/* Total Orders Count */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders Count
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="serif-font text-3xl font-extrabold text-slate-900">
              {loading ? "…" : (summary.totalOrders ?? 0).toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Storewide digital customer orders
            </p>
          </div>
        </div>

        {/* Total Sales All Over */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Sales All Over
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="serif-font text-3xl font-extrabold text-slate-900">
              {loading ? "…" : (summary.totalSalesAll ?? 0).toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              {summary.totalOrders ?? 0} Orders + {summary.posSales ?? 0} POS Counter Sales
            </p>
          </div>
        </div>

        {/* Total Cumulative Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="serif-font text-3xl font-extrabold text-slate-900">
              {loading ? "…" : formatCurrency(summary.totalRevenue)}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1">
              Delivered Orders + POS Counter Sales
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart Section using Recharts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="serif-font text-xl font-bold text-slate-900">
              Revenue Growth Over Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly revenue breakdown from delivered customer orders and retail POS sales.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-600">Delivered Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span className="text-slate-600">POS Sales</span>
            </div>
          </div>
        </div>

        <div className="h-[360px] w-full pt-4">
          {loading && (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Loading chart data...
            </div>
          )}
          {!loading && chartData.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No revenue records found for this period.
            </div>
          )}
          {!loading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="posRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
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
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orderRevenue"
                  name="Delivered Orders"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#orderRevenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="posRevenue"
                  name="POS Sales"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#posRevenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
