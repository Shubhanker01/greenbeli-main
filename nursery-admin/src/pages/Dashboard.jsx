import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Sprout,
  PhoneCall,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Receipt,
  Users,
  FileText,
  Star
} from "lucide-react";
import { getDashboardStatsApi, updateOrderStatusApi } from "../utils/adminApi";

// One entry per KPI card: add or remove cards here
const KPI_CARDS = [
  {
    key: "totalProducts",
    span: "lg:col-span-2",
    label: "Active Products",
    note: "Currently active in catalog",
    to: "/products",
    icon: Sprout,
    iconBox: "bg-amber-50 text-amber-700",
    noteColor: "text-amber-600",
  },
  {
    key: "totalCustomers",
    span: "lg:col-span-2",
    label: "Registered Customers",
    note: "Confirmed shopper accounts",
    to: "/customers",
    icon: Users,
    iconBox: "bg-sky-50 text-sky-700",
    noteColor: "text-sky-600",
  },
  {
    key: "inquiryLeads",
    span: "lg:col-span-2",
    label: "Inquiry Leads",
    note: "Total submitted inquiries",
    to: "/leads",
    icon: PhoneCall,
    iconBox: "bg-purple-50 text-purple-700",
    noteColor: "text-purple-600",
  },
  {
    key: "totalProposals",
    span: "lg:col-span-3",
    label: "Landscape Proposals",
    note: "Proposals created so far",
    to: "/proposals",
    icon: FileText,
    iconBox: "bg-emerald-50 text-emerald-700",
    noteColor: "text-emerald-600",
  },
  {
    key: "totalTestimonials",
    span: "sm:col-span-2 lg:col-span-3",
    label: "Testimonials",
    note: "Customer reviews received",
    to: "/testimonials",
    icon: Star,
    iconBox: "bg-rose-50 text-rose-700",
    noteColor: "text-rose-600",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const data = await getDashboardStatsApi();
        setStats(data);
      } catch (requestError) {
        setError(requestError.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      setStats((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        ),
      }));
    } catch (e) {
      setError(e.message || "Unable to update order status.");
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl">
          {error}
        </div>
      )}
      {loading && (
        <p role="status" className="text-xs text-slate-500">
          Loading current dashboard data...
        </p>
      )}

      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Executive Summary
          </span>
          <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
            Nursery Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products/new"
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Plant
          </Link>
          <Link
            to="/sales"
            className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-emerald-700" /> POS Counter Sale
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {KPI_CARDS.map(({ key, label, note, to, span, icon: Icon, iconBox, noteColor }) => (
          <Link
            key={key}
            to={to}
            className={`group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 transition hover:shadow-md hover:border-slate-300 ${span}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
              <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center ${iconBox}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="serif-font text-3xl font-bold text-slate-900">
                {loading ? "…" : (stats?.[key] ?? 0).toLocaleString("en-IN")}
              </h3>
              <span className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${noteColor}`}>
                {note}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}