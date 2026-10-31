// pages/ConfirmEmail.jsx  → <Route path="/confirm-email" element={<ConfirmEmail />} />
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5007/api";

export default function ConfirmEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [state, setState] = useState({ status: "checking", message: "" }); // checking | success | error
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const token_hash = params.get("token_hash") || params.get("token");

        if (!token_hash) {
            setState({
                status: "error",
                message: "No confirmation token found in this link. It may have already been used.",
            });
            return;
        }

        (async () => {
            try {
                const res = await fetch(`${API_URL}/confirm`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token_hash }),
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    setState({
                        status: "success",
                        message: "Email confirmed! Taking you to sign in…",
                    });
                    setTimeout(() => navigate("/login?confirmed=1", { replace: true }), 1800);
                } else {
                    setState({
                        status: "error",
                        message: data.message || "This confirmation link is invalid or has expired.",
                    });
                }
            } catch {
                setState({
                    status: "error",
                    message: "Network error. Please try again.",
                });
            }
        })();
    }, [params, navigate]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cream">
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 sm:p-10 max-w-md w-full text-center space-y-5">
                {state.status === "checking" && (
                    <div className="space-y-4 py-6">
                        <Loader2 className="w-12 h-12 text-emerald-700 animate-spin mx-auto" />
                        <h2 className="serif-font text-2xl font-bold text-slate-900">Confirming your email…</h2>
                        <p className="text-sm text-stone-600">Please wait while we verify your GreenBeli account.</p>
                    </div>
                )}

                {state.status === "success" && (
                    <div className="space-y-4 py-4">
                        <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                        <h1 className="serif-font text-3xl font-bold text-[#1f4a34]">You're all set!</h1>
                        <p className="text-sm text-stone-600 leading-relaxed">{state.message}</p>
                        <div className="pt-2">
                            <Link
                                to="/login"
                                className="inline-block w-full bg-[#1f4a34] hover:bg-[#163828] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-md"
                            >
                                Continue to Sign In
                            </Link>
                        </div>
                    </div>
                )}

                {state.status === "error" && (
                    <div className="space-y-4 py-4">
                        <AlertCircle className="w-14 h-14 text-amber-600 mx-auto" />
                        <h1 className="serif-font text-3xl font-bold text-slate-900">Couldn't Confirm Email</h1>
                        <p className="text-sm text-stone-600 leading-relaxed">{state.message}</p>
                        <div className="pt-2 flex flex-col gap-2.5">
                            <Link
                                to="/login"
                                className="inline-block w-full bg-[#1f4a34] hover:bg-[#163828] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-md"
                            >
                                Try Signing In
                            </Link>
                            <Link
                                to="/register"
                                className="inline-block w-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold py-3 rounded-2xl text-xs transition"
                            >
                                Register with Another Email
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
