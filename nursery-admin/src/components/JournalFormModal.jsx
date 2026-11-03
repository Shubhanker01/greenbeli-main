// components/JournalFormModal.jsx
import { useState } from "react";
import { LuLoader } from "react-icons/lu";
import FormModal, { Field, inputCls, errorMessage } from "./FormModal";

const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const EMPTY = {
    title: "", slug: "", category: "", description: "",
    content: "", image: "", imageAlt: "", isPublished: true,
};

const Content = ({ onClose, onCreate }) => {
    const [form, setForm] = useState(EMPTY);
    const [slugTouched, setSlugTouched] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const onTitle = (e) => {
        const title = e.target.value;
        setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
    };

    const submit = async (e) => {
        e.preventDefault();
        if (saving) return;
        if (!form.title.trim() || !form.slug.trim()) {
            setError("Title and slug are required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await onCreate({ ...form, title: form.title.trim(), slug: slugify(form.slug) });
            onClose();
        } catch (err) {
            setError(errorMessage(err));
            setSaving(false);
        }
    };

    return (
        <FormModal open title="New journal" className="h-100" onClose={onClose} busy={saving}>
            <form onSubmit={submit} className="space-y-4 pt-2">
                <Field label="Title" required>
                    <input className={inputCls} value={form.title} onChange={onTitle} maxLength={160} autoFocus />
                </Field>
                <Field label="Slug" required>
                    <input
                        className={inputCls}
                        value={form.slug}
                        onChange={(e) => { setSlugTouched(true); set("slug")(e); }}
                        maxLength={160}
                    />
                </Field>
                <Field label="Category">
                    <input className={inputCls} value={form.category} onChange={set("category")} maxLength={80} />
                </Field>
                <Field label="Description">
                    <textarea className={inputCls} rows={2} value={form.description} onChange={set("description")} />
                </Field>
                <Field label="Content">
                    <textarea className={inputCls} rows={6} value={form.content} onChange={set("content")} />
                </Field>
                <Field label="Image URL">
                    <input className={inputCls} value={form.image} onChange={set("image")} placeholder="https://" />
                </Field>
                <Field label="Image alt text">
                    <input className={inputCls} value={form.imageAlt} onChange={set("imageAlt")} maxLength={160} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                        className="h-4 w-4 accent-emerald-600"
                    />
                    Published
                </label>

                {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} disabled={saving}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={saving}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-70">
                        {saving && <LuLoader className="animate-spin" />}
                        {saving ? "Creating..." : "Create journal"}
                    </button>
                </div>
            </form>
        </FormModal>
    );
};

// Mounted only while open, so the form starts fresh every time
const JournalFormModal = ({ open, ...props }) => (open ? <Content {...props} /> : null);
export default JournalFormModal;