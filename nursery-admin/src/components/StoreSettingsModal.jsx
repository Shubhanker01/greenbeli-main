import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Save, Store, Phone, Mail, MapPin } from "lucide-react";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;


function isValidPhone(value) {
    if (!/^[+\d\s()-]+$/.test(value)) return false;
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
}

function validate(values) {
    const errors = {};
    const name = values.storeName.trim();
    if (!name) errors.storeName = "Store name is required.";
    else if (name.length > 80) errors.storeName = "Store name must be 80 characters or fewer.";

    const phone = values.supportPhone.trim();
    if (!phone) errors.supportPhone = "Helpline phone is required.";
    else if (!isValidPhone(phone)) errors.supportPhone = "Enter a valid phone number (10-15 digits).";

    const email = values.supportEmail.trim();
    if (!email) errors.supportEmail = "Support email is required.";
    else if (!EMAIL_RE.test(email)) errors.supportEmail = "Enter a valid email address.";

    const address = values.address.trim();
    if (!address) errors.address = "Address is required"

    return errors;
}

const INPUT =
    "w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";


export default function StoreSettingsModal({ open, ...rest }) {

    return open ? createPortal(<ModalContent {...rest} />, document.body) : null;
}

function ModalContent({ onClose, initialValues, onSave }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const firstFieldRef = useRef(null);

    // Focus the first field when the modal appears
    useEffect(() => {
        firstFieldRef.current?.focus();
    }, []);

    // Escape to close + lock page scroll while open
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && !saving) onClose();
        };
        document.addEventListener("keydown", onKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [saving, onClose]);

    const unchanged =
        values.storeName.trim() === initialValues.storeName &&
        values.supportPhone.trim() === initialValues.supportPhone &&
        values.supportEmail.trim() === initialValues.supportEmail &&
        values.address.trim() === initialValues.address

    const setField = (field) => (e) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
        if (saveError) setSaveError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        const found = validate(values);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            return;
        }

        setSaving(true);
        setSaveError("");
        try {
            await onSave({
                storeName: values.storeName.trim(),
                supportPhone: values.supportPhone.trim(),
                supportEmail: values.supportEmail.trim(),
                address: values.address.trim()
            });
            onClose();
        } catch (err) {
            console.error("Settings save failed:", err);
            setSaveError("Could not save your changes. Please try again.");
            setSaving(false);
        }
    };

    const fields = [
        { key: "storeName", label: "Store Name", type: "text", icon: Store, ref: firstFieldRef, autoComplete: "organization", maxLength: 80 },
        { key: "supportPhone", label: "Helpline Phone", type: "tel", icon: Phone, autoComplete: "tel", maxLength: 20 },
        { key: "supportEmail", label: "Support Email", type: "email", icon: Mail, autoComplete: "email", maxLength: 120 },
        { key: "address", label: "address", type: "text", icon: MapPin, autoComplete: "add", maxLength: 120 },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !saving) onClose(); // click on the dark backdrop
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="store-settings-title"
                className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80"
            >
                <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">System Control</span>
                            <h2 id="store-settings-title" className="serif-font text-2xl font-bold text-slate-900 mt-0.5">
                                Edit Store Information
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            aria-label="Close"
                            className="p-2 -mr-2 -mt-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {saveError && (
                        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3.5 rounded-xl">
                            {saveError}
                        </div>
                    )}

                    {fields.map(({ key, label, type, icon: Icon, ref, autoComplete, maxLength }) => (
                        <div key={key}>
                            <label htmlFor={`setting-${key}`} className="block text-sm font-bold text-slate-700 mb-1.5">
                                {label}
                            </label>
                            <div className="relative">
                                <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    id={`setting-${key}`}
                                    ref={ref}
                                    type={type}
                                    value={values[key]}
                                    onChange={setField(key)}
                                    autoComplete={autoComplete}
                                    maxLength={maxLength}
                                    aria-invalid={errors[key] ? "true" : undefined}
                                    aria-describedby={errors[key] ? `setting-${key}-error` : undefined}
                                    className={`${INPUT} pl-10 ${errors[key] ? "border-rose-400" : "border-slate-200 focus:border-emerald-600"}`}
                                />
                            </div>
                            {errors[key] && (
                                <p id={`setting-${key}-error`} className="mt-1.5 text-xs font-medium text-rose-600">
                                    {errors[key]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || unchanged}
                            className="bg-emerald-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}