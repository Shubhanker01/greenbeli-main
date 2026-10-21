import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { fetchApi } from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch (e) {
      // smooth UX
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 max-w-md w-full space-y-6">
        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div>
          <h2 className="serif-font text-2xl font-bold text-slate-900">Reset Your Password</h2>
          <p className="text-xs text-slate-500 mt-1">Enter your account email to receive a password reset link.</p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm">Reset Link Sent!</h3>
            <p className="text-xs text-slate-600">
              Check your inbox ({email}) for instructions to reset your account password.
            </p>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition"
            >
              {loading ? "Sending Email..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
