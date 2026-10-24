import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function RequireAdmin() {
    const { status } = useAdminAuth();
    if (status === "loading") {
        return <div className="min-h-screen grid place-items-center text-stone-600">Checking access…</div>;
    }
    if (status === "mfa_enroll") return <Navigate to="/mfa-enrollment" replace />;
    if (status === "mfa_required") return <Navigate to="/mfa-verify" replace />;
    if (status !== "ok") return <Navigate to="/login" replace />; // unauthenticated / forbidden

    return <Outlet />;
}