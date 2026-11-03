import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import {
  changePasswordApi,
  validatePasswordResetTokenApi,
} from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    let active = true;
    if (!token) {
      setValidToken(false);
      setError("This password reset link is invalid or expired.");
      setChecking(false);
      return () => {
        active = false;
      };
    }

    validatePasswordResetTokenApi(token)
      .then(() => {
        if (active) setValidToken(true);
      })
      .catch((requestError) => {
        if (active) {
          setValidToken(false);
          setError(requestError.message || "This password reset link is invalid or expired.");
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi(token, password);
      setUpdated(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to update your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 max-w-md w-full space-y-6">
        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div>
          <h1 className="serif-font text-2xl font-bold text-slate-900">Choose a New Password</h1>
          <p className="text-xs text-slate-500 mt-1">Your reset link is valid for 15 minutes.</p>
        </div>

        {checking ? (
          <p role="status" className="text-sm text-slate-500">Checking your reset link…</p>
        ) : updated ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-sm">Password updated</h2>
            <p className="text-xs text-slate-600">You can now sign in with your new password.</p>
            <Link to="/login" className="inline-block bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold">
              Go to Login
            </Link>
          </div>
        ) : validToken ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg transition disabled:opacity-60"
            >
              {loading ? "Updating Password…" : "Update Password"}
            </button>
          </form>
        ) : (
          <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm space-y-3">
            <p>{error || "This password reset link is invalid or expired."}</p>
            <Link to="/forgot-password" className="font-bold underline">Request a new reset link</Link>
          </div>
        )}
      </div>
    </div>
  );
}
