import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight, Sprout } from "lucide-react";
import { getMyOrdersApi } from "../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await getMyOrdersApi();
        if (Array.isArray(res)) setOrders(res);
        else if (Array.isArray(res?.items)) setOrders(res.items);
        else if (Array.isArray(res?.orders)) setOrders(res.orders);
        else throw new Error("The orders response is invalid.");
      } catch (error) {
        setOrders([]);
        setLoadError(error.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "shipped":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="border-b border-emerald-100 pb-6">
        <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
          <Package className="w-4 h-4" /> Order History
        </span>
        <h1 className="serif-font text-3xl font-bold text-slate-900 mt-1">My Nursery Orders</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track transit status, review purchased plants, and download order receipts.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-100 rounded-3xl h-48 animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <p role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 text-sm">
          {loadError}
        </p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="serif-font text-xl font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover our fresh plant collection and place your first order today!
          </p>
          <Link
            to="/products"
            className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold inline-block hover:bg-emerald-900"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = order.orderStatus || order.status;
            const orderItems = order.orderItems || order.items || [];
            const shippingInfo = order.shippingInfo || order.shippingAddress || {};
            return (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition space-y-6"
            >
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Order ID</span>
                  <h3 className="serif-font font-bold text-slate-900 text-base">#{order._id}</h3>
                  <span className="text-xs text-slate-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(status)}`}>
                    {status || "Processing"}
                  </span>
                  <div className="text-right">
                    <span className="serif-font text-lg font-extrabold text-emerald-950 block">
                      ₹{order.totalPrice ?? order.totalAmount}
                    </span>
                    {Number(order.discountAmount || 0) > 0 && (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Saved ₹{order.discountAmount} ({order.couponCode || "Promo"})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Step Tracker */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Order Confirmed
                </div>
                <div className="w-8 sm:w-16 h-0.5 bg-emerald-300" />
                <div className={`flex items-center gap-2 ${status === "Processing" ? "text-emerald-800 font-extrabold" : "text-slate-400"}`}>
                  <Clock className="w-4 h-4" /> Packing Plants
                </div>
                <div className="w-8 sm:w-16 h-0.5 bg-emerald-200" />
                <div className={`flex items-center gap-2 ${status === "Shipped" || status === "Delivered" ? "text-emerald-800 font-extrabold" : "text-slate-400"}`}>
                  <Truck className="w-4 h-4" /> Eco Delivery
                </div>
              </div>

              {/* Items List & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Items Purchased</h4>
                  <div className="space-y-2">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl">
                        <span className="font-bold flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5 text-emerald-700" /> {item.name} x {item.quantity}
                        </span>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Delivery Address
                  </h4>
                  {shippingInfo.fullName && <p className="font-bold text-slate-900">{shippingInfo.fullName}</p>}
                  <p className="text-slate-600">{shippingInfo.address}, {shippingInfo.city}</p>
                  <p className="text-slate-600">{shippingInfo.state} - {shippingInfo.pincode}</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
