import { useState } from "react";
import api from "../lib/axios";

export default function DeleteCustomerModal({ isOpen, onClose, customer, onSuccess }) {
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !customer) return null;

    const handleDelete = async () => {
        setSubmitting(true);
        try {
            await api.delete(`/customers/${customer._id}`);
            onSuccess(customer._id);
        } catch (err) {
            console.error("Failed to delete customer:", err);
            alert(err.response?.data?.message || "Failed to delete customer.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto font-bold text-lg">
                    !
                </div>
                <div className="space-y-1">
                    <h3 className="serif-font font-bold text-lg text-slate-900">Delete Customer</h3>
                    <p className="text-xs text-slate-500">
                        Are you sure you want to delete <span className="font-bold text-slate-800">{customer.name}</span>? This will permanently remove their record.
                    </p>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={handleDelete}
                        className="w-1/2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                    >
                        {submitting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}