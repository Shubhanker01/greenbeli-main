// components/FaqEditModal.jsx : edit an existing FAQ
import { useState } from "react";
import { LuLoader } from "react-icons/lu";
import FormModal, { Field, inputCls, errorMessage } from "./FormModal";

const fromItem = (f) => ({
  question: f.question ?? "",
  answer: f.answer ?? "",
  category: f.category ?? "General",
  sortOrder: String(f.sortOrder ?? 0),
  isActive: f.isActive !== false,
});

const Content = ({ item, onClose, onUpdate }) => {
  const [initial] = useState(() => fromItem(item));
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are required.");
      return;
    }

    const next = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || "General",
      sortOrder: String(Number(form.sortOrder) || 0),
      isActive: form.isActive,
    };
    // Send only what changed
    const changes = {};
    for (const key of Object.keys(initial)) {
      if (next[key] !== initial[key]) changes[key] = key === "sortOrder" ? Number(next[key]) : next[key];
    }
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onUpdate(item._id, changes);
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <FormModal open title="Edit FAQ" onClose={onClose} busy={saving}>
      <form onSubmit={submit} className="space-y-4 pt-2">
        <Field label="Question" required>
          <input className={inputCls} value={form.question} onChange={set("question")} maxLength={300} autoFocus />
        </Field>
        <Field label="Answer" required>
          <textarea className={inputCls} rows={5} value={form.answer} onChange={set("answer")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <input className={inputCls} value={form.category} onChange={set("category")} maxLength={80} />
          </Field>
          <Field label="Sort order">
            <input type="number" className={inputCls} value={form.sortOrder} onChange={set("sortOrder")} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="h-4 w-4 accent-emerald-600"
          />
          Active
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
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </FormModal>
  );
};

// Mount only while an item is selected, so every open starts from that item's data
const FaqEditModal = ({ item, ...props }) => (item ? <Content key={item._id} item={item} {...props} /> : null);
export default FaqEditModal;