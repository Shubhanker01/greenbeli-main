import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side Decorative Image */}
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 p-8 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
              alt="Plants"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-emerald-400" />
              <span className="serif-font text-2xl font-bold text-white">GreenBeli</span>
            </Link>

            <h2 className="serif-font text-2xl font-bold pt-6">
              Welcome Back to Your Plant Haven
            </h2>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Track active plant shipments, access personalized care advice, and save your wishlist items.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-800/80 flex items-center gap-2 text-xs text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Over 10,000+ Happy Plant Lovers
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="serif-font text-2xl font-bold text-slate-900">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials below to access your botanical profile.</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-emerald-800 font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-emerald-800 hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}