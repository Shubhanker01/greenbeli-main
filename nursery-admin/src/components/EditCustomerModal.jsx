import React, { useState, useEffect } from "react";
import api from "../lib/axios";

export default function EditCustomerModal({ isOpen, onClose, customer, onSuccess }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (customer) {
            setName(customer.name || "");
            setEmail(customer.email || "");
            setPhone(customer.phone || "");
            setPassword("");
        }
    }, [customer]);

    if (!isOpen || !customer) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { name, email, phone };
            if (password) payload.password = password;

            const response = await api.put(`/customers/${customer._id}`, payload);
            const updated = response.data.data || response.data;
            onSuccess(updated);
        } catch (err) {
            console.error("Failed to update customer:", err);
            alert(err.response?.data?.message || "Failed to update customer.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
                <h3 className="serif-font font-bold text-lg text-slate-900">Edit Customer Account</h3>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 mb-1">New Password (Optional)</label>
                        <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}