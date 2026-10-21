import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { User, Package, Heart, LogOut, Save, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import PlantCard from "../components/PlantCard";

export default function Profile() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";

  const { user, logout, updateProfile } = useAuth();
  const { wishlist } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name, phone });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* User Header Badge */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white text-2xl font-bold flex items-center justify-center border-2 border-emerald-400">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="serif-font text-2xl font-bold">{user?.name || "Botanical Lover"}</h1>
            <p className="text-xs text-emerald-200/80">{user?.email || "user@example.com"}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 text-emerald-200 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-emerald-100 gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition relative ${
            activeTab === "profile" ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <User className="w-4 h-4" /> Personal Information
          {activeTab === "profile" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition relative ${
            activeTab === "wishlist" ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
          {activeTab === "wishlist" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full" />}
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm max-w-2xl space-y-6">
          <h3 className="serif-font font-bold text-lg text-slate-900">Account Details</h3>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl">
              ✓ Profile information updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === "wishlist" && (
        <div className="space-y-6">
          {wishlist.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="serif-font text-xl font-bold text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tap the heart icon on any plant card to save your favorite varieties here!
              </p>
              <Link
                to="/products"
                className="bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold inline-block hover:bg-emerald-900"
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <PlantCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
