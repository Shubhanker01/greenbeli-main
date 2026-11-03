// components/FormModal.jsx : shared shell for the create modals
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

const FormModal = ({ open, title, onClose, busy = false, children }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && !busy && onClose();
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, busy, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        aria-label="Close"
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 disabled:opacity-50"
                    >
                        <LuX className="text-xl" />
                    </button>
                </div>
                <div className="px-6 pb-6">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export const inputCls =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export const Field = ({ label, required, children }) => (
    <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
            {required && <span className="text-rose-500"> *</span>}
        </span>
        {children}
    </label>
);

export const errorMessage = (err) =>
    err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";

export default FormModal;