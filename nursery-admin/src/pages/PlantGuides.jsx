import { useCallback, useEffect, useState } from "react";
import { LuBookOpen, LuLoader, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import {
  createPlantCareGuideApi,
  deletePlantCareGuideApi,
  getPlantCareGuidesApi,
  updatePlantCareGuideApi,
} from "../utils/adminApi";
import FormModal, { errorMessage, Field, inputCls } from "../components/FormModal";

function PlantGuideDeleteModal({ guide, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError("");
    try {
      await onDelete(guide._id);
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <FormModal open title="Delete Plant Guide?" onClose={onClose} busy={deleting}>
      <div className="space-y-4 pt-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <LuTrash2 className="text-xl" />
        </div>
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-800">{guide.title}</span> will be permanently deleted.
          This can't be undone.
        </p>

        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-70"
          >
            {deleting && <LuLoader className="animate-spin" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </FormModal>
  );
}

function PlantGuideFormModal({ guide, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    title: guide?.title ?? "",
    description: guide?.description ?? "",
    tip: guide?.tip ?? "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!form.title.trim() || !form.description.trim() || !form.tip.trim()) {
      setError("Title, description, and tip are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        tip: form.tip.trim(),
      });
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <FormModal
      open
      title={guide ? "Edit Plant Guide" : "Create Plant Guide"}
      onClose={onClose}
      busy={saving}
    >
      <form onSubmit={submit} className="space-y-4 pt-2">
        <Field label="Title" required>
          <input
            className={inputCls}
            value={form.title}
            onChange={set("title")}
            maxLength={200}
            autoFocus
          />
        </Field>
        <Field label="Description" required>
          <textarea
            className={inputCls}
            rows={4}
            value={form.description}
            onChange={set("description")}
          />
        </Field>
        <Field label="Tip" required>
          <textarea
            className={inputCls}
            rows={3}
            value={form.tip}
            onChange={set("tip")}
          />
        </Field>

        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            {saving && <LuLoader className="animate-spin" />}
            {saving ? "Saving..." : guide ? "Save changes" : "Create guide"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}

export default function PlantGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadGuides = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setGuides(await getPlantCareGuidesApi());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const handleCreate = async (payload) => {
    const guide = await createPlantCareGuideApi(payload);
    setGuides((current) => [guide, ...current]);
  };

  const handleUpdate = async (payload) => {
    const guide = await updatePlantCareGuideApi(editing._id, payload);
    setGuides((current) => current.map((item) => item._id === guide._id ? guide : item));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    await deletePlantCareGuideApi(id);
    setGuides((current) => current.filter((item) => item._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Plant care
          </span>
          <h1 className="mt-0.5 text-3xl font-bold text-slate-900">Plant Guides</h1>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          <LuPlus /> Create guide
        </button>
      </div>

      {error && guides.length > 0 && !formOpen && !editing && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={loadGuides}
            className="mt-2 font-bold hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-16 text-center text-slate-400">Loading plant guides...</p>
      ) : error && guides.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-rose-600">{error}</p>
          <button type="button" onClick={loadGuides} className="mt-3 text-sm font-bold text-emerald-700 hover:underline">
            Try again
          </button>
        </div>
      ) : guides.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
          <LuBookOpen className="text-3xl" />
          <p>No plant guides yet.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <li
              key={guide._id}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="flex-1 space-y-3 p-5">
                <h2 className="text-lg font-bold text-slate-800">{guide.title}</h2>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Description</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{guide.description}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Care tip</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-emerald-900">{guide.tip}</p>
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-50 p-3">
                <button
                  type="button"
                  onClick={() => setEditing(guide)}
                  aria-label={`Edit ${guide.title}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <LuPencil /> Update
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(guide)}
                  aria-label={`Delete ${guide.title}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                >
                  <LuTrash2 /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <PlantGuideFormModal
          guide={null}
          onClose={() => setFormOpen(false)}
          onSave={handleCreate}
        />
      )}
      {editing && (
        <PlantGuideFormModal
          key={editing._id}
          guide={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}
      {deleting && (
        <PlantGuideDeleteModal
          guide={deleting}
          onClose={() => setDeleting(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
