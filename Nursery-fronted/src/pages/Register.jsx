import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Mail, Lock, User, Phone, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setConfirmationSent(false);

    // Basic phone validation matching backend normalizePhone expectations
    const rawPhone = phone.trim();
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!rawPhone) {
      setError("Mobile phone number is required.");
      return;
    }
    const phoneDigits = rawPhone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    let res;
    try {
      res = await register(name, email, password, rawPhone);
    } catch (err) {
      setLoading(false);
      setConfirmationSent(false);
      setError(err?.message || "Registration failed. Please try again.");
      return;
    }
    setLoading(false);

    if (!res?.success) {
      setConfirmationSent(false);
      setError(res?.message || "Registration failed. Please try again.");
      return;
    }

    // Stay on this page — show inbox message; never redirect on success or error
    if (res.requiresConfirmation) {
      setConfirmationSent(true);
      setConfirmationEmail(email);
      return;
    }

    setConfirmationSent(true);
    setConfirmationEmail(email);
  };

  // Email confirmation success screen
  if (confirmationSent) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl p-10 max-w-md w-full text-center space-y-5">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
          <h2 className="serif-font text-2xl font-bold text-slate-900">Check Your Inbox!</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We've sent a confirmation link to{" "}
            <span className="font-bold text-emerald-800">{confirmationEmail}</span>.{" "}
            Click the link within <span className="font-bold">15 minutes</span> to verify your account and start shopping.
          </p>
          <p className="text-xs text-slate-400">
            Didn't receive it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setConfirmationSent(false)}
              className="font-bold text-emerald-700 hover:underline"
            >
              try again
            </button>
            .
          </p>
          <Link
            to="/login"
            className="inline-block w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-2xl text-sm transition"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side */}
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 p-8 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="relative z-10 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-emerald-400" />
              <span className="serif-font text-2xl font-bold text-white">GreenBeli</span>
            </Link>

            <h2 className="serif-font text-2xl font-bold pt-6">
              Join Our Botanical Club &amp; Get 15% OFF
            </h2>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Create a free account to unlock member discounts, fast express checkout, and botanical care guides.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-emerald-800/80 flex items-center gap-2 text-xs text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" /> 100% Healthy Plant Guarantee
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="serif-font text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-xs text-slate-500 mt-1">Fill in your details to get started.</p>
          </div>

          {error && (
            <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  autoComplete="name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Format: 9876543210 or +91 98765 43210</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-emerald-800 hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
