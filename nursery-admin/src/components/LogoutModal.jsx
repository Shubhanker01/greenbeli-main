import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuLogOut, LuLoader } from "react-icons/lu";

/**
 * Props:
 *  open        boolean
 *  onClose()   Cancel, Escape and backdrop click (disabled while logging out)
 *  onConfirm() async: do the logout. Throw / reject to show an error and let the user retry.
 */
export default function LogoutModal({ open, ...rest }) {
    // Mounted only while open (fresh state every time) and rendered on <body>: the sidebar uses a CSS
    // transform, which would otherwise trap a fixed-position modal inside the sidebar's own box.
    return open ? createPortal(<ModalContent {...rest} />, document.body) : null;
}

function ModalContent({ onClose, onConfirm }) {
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState("");
    const dialogRef = useRef(null);
    const cancelRef = useRef(null);

    // Start on "Cancel" so an accidental Enter key never logs the admin out
    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    // Escape closes, Tab stays inside the dialog, page scroll is locked
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && !loggingOut) {
                onClose();
                return;
            }
            if (e.key === "Tab" && dialogRef.current) {
                const items = dialogRef.current.querySelectorAll("button:not([disabled])");
                if (items.length === 0) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener("keydown", onKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [loggingOut, onClose]);

    const handleConfirm = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        setError("");
        try {
            await onConfirm();
        } catch (err) {
            console.error("Logout failed:", err);
            setError("We couldn't log you out. Check your connection and try again.");
            setLoggingOut(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loggingOut) onClose();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
                aria-describedby="logout-desc"
                className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 text-center"
            >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <LuLogOut className="text-2xl" />
                </div>

                <h2 id="logout-title" className="serif-font text-2xl font-bold text-slate-900 mt-5">
                    Log out of admin?
                </h2>
                <p id="logout-desc" className="mt-2 text-sm text-slate-500 leading-relaxed">
                    You'll need to sign in again and verify with your authenticator app to get back in.
                </p>

                {error && (
                    <div role="alert" className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onClose}
                        disabled={loggingOut}
                        className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loggingOut}
                        className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-rose-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loggingOut ? (
                            <>
                                <LuLoader className="animate-spin text-base" /> Logging out…
                            </>
                        ) : (
                            "Log out"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}