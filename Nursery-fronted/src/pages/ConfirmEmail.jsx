// pages/ConfirmEmail.jsx  → <Route path="/confirm-email" element={<ConfirmEmail />} />
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5007/api";

export default function ConfirmEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    // const { refresh } = useAuth();
    const [state, setState] = useState({ status: "checking", message: "" }); // checking | success | error
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        const token_hash = params.get("token_hash");
        console.log(token_hash)
        const type = params.get("type");
        console.log(type);
        if (!token_hash) {
            return setState({ status: "error", message: "This confirmation link is invalid." });
        }

        (async () => {
            try {
                const res = await fetch(`${API_URL}/confirm`, {
                    method: "POST",
                    credentials: "include", // lets the browser store the session cookies
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token_hash, type }),
                });
                const data = await res.json().catch(() => ({}));
                console.log(data)
                if (res.ok) {
                    // await refresh(); // AuthContext now knows the user is logged in
                    setState({ status: "success", message: "Email confirmed! Taking you to your account…" });
                    setTimeout(() => navigate("/login", { replace: true }), 1500);
                } else {
                    setState({ status: "error", message: data.message || "Something went wrong." });
                }
            } catch {
                setState({ status: "error", message: "Network error. Please try again." });
            }
        })();
    }, [params, navigate]);

    return (
        <div className="max-w-md mx-auto px-4 py-24 text-center">
            {state.status === "checking" && <p className="text-lg text-stone-600">Confirming your email…</p>}

            {state.status === "success" && (
                <>
                    <h1 className="serif-font text-3xl font-bold text-[#1f4a34]">You're all set</h1>
                    <p className="mt-3 text-stone-600">{state.message}</p>
                </>
            )}

            {state.status === "error" && (
                <>
                    <h1 className="serif-font text-3xl font-bold text-[#1f4a34]">Couldn't confirm</h1>
                    <p className="mt-3 text-stone-600">{state.message}</p>
                    <Link to="/register" className="inline-block mt-6 px-6 py-3 rounded-full bg-[#1f4a34] text-white font-semibold">
                        Register again
                    </Link>
                </>
            )}
        </div>
    );
}