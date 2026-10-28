import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function ResetMfa() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const requestedOnMount = useRef(false);

  const requestCode = useCallback(async () => {
    setError("");
    setMessage("");
    setSendingCode(true);
    try {
      const response = await api.post("/mfa/reset");
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || data.error || "Unable to send a verification code.");
      }
      setMessage(data.message || "A verification code has been sent to your admin email.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          requestError.message ||
          "Unable to send a verification code. Please try again."
      );
    } finally {
      setSendingCode(false);
    }
  }, []);

  useEffect(() => {
    if (!requestedOnMount.current) {
      requestedOnMount.current = true;
      requestCode();
    }
  }, [requestCode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/mfa/reset-verify", { otp });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || data.error || "Unable to verify the code.");
      }

      navigate("/mfa-enrollment", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          requestError.message ||
          "Unable to verify the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 border border-emerald-800/40">
        <div className="text-center space-y-2">
          <h1 className="serif-font text-2xl font-bold text-slate-900">Reset authenticator</h1>
          <p className="text-sm text-slate-500">
            Enter the 6-digit verification code sent to your admin email to set up a new authenticator.
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl font-medium">
            {error}
          </div>
        )}
        {message && (
          <p role="status" className="text-emerald-800 text-sm text-center">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-mfa-otp" className="block text-sm font-bold text-slate-700 mb-1">
              Verification code
            </label>
            <input
              id="reset-mfa-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || sendingCode || otp.length !== 6}
            className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg transition"
          >
            {loading ? "Verifying code..." : sendingCode ? "Sending code..." : "Verify and reset authenticator"}
          </button>
        </form>
        <button
          type="button"
          onClick={requestCode}
          disabled={sendingCode || loading}
          className="w-full text-sm font-semibold text-emerald-800 hover:text-emerald-950 disabled:opacity-60"
        >
          {sendingCode ? "Sending code..." : "Resend verification code"}
        </button>
      </div>
    </div>
  );
}
