import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Sprout } from "lucide-react";
import api from "../lib/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email")?.trim() || "";
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/admin/reset-password", {
        email,
        token,
        password,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to reset your password.");
      }
      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasValidLink = Boolean(email && token);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 border border-emerald-800/40">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-lg">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="serif-font text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="text-xs text-slate-500">
            {success
              ? "Your admin password has been updated."
              : "Choose a new password for your GreenBeli admin account."}
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl font-medium">
            {error}
          </div>
        )}

        {!hasValidLink ? (
          <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl font-medium">
            This password reset link is missing its email or token. Request a new link and try again.
          </div>
        ) : success ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 text-center">You can now sign in with your new password.</p>
            <Link
              to="/login"
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              Go to login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600 text-center">
              Resetting password for <span className="font-semibold text-slate-800">{email}</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-xs font-bold text-slate-700 mb-1">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter the password again"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg transition"
              >
                {loading ? "Updating password..." : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
