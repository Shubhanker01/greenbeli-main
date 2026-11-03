// pages/Journal.jsx : admin list of journal articles
import { useCallback, useEffect, useState } from "react";
import { LuPlus, LuBookOpen, LuPencil, LuTrash2 } from "react-icons/lu";
import api from "../lib/axios";
import JournalFormModal from "../components/JournalFormModal";
import JournalEditModal from "../components/JournalEditModal";
import JournalDeleteModal from "../components/JournalDeleteModal";
import { errorMessage } from "../components/FormModal";

const JOURNAL_URL = "/content/journal"; // GET/POST here, PUT/DELETE on `${JOURNAL_URL}/:id`

const Journal = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);   // the article being edited
  const [deleting, setDeleting] = useState(null); // the article awaiting delete confirmation

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(JOURNAL_URL);
      setItems(res.data?.items ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // The handlers below throw on failure so the modals can show the error and stay open
  const handleCreate = async (payload) => {
    const res = await api.post(JOURNAL_URL, payload);
    setItems((prev) => [res.data, ...prev]);
  };

  const handleUpdate = async (id, changes) => {
    const res = await api.put(`${JOURNAL_URL}/${id}`, changes);
    setItems((prev) => prev.map((a) => (a._id === id ? res.data : a)));
  };

  const handleDelete = async (id) => {
    await api.delete(`${JOURNAL_URL}/${id}`);
    setItems((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Journal</h1>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          <LuPlus /> Create journal
        </button>
      </div>

      {loading ? (
        <p className="py-16 text-center text-slate-400">Loading...</p>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-rose-600">{error}</p>
          <button onClick={load} className="mt-3 text-sm font-bold text-emerald-700 hover:underline">
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
          <LuBookOpen className="text-3xl" />
          <p>No journals</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((a) => (
            <li key={a._id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              {a.image && (
                <img src={a.image} alt={a.imageAlt || a.title} className="h-40 w-full object-cover" loading="lazy" />
              )}
              <div className="flex-1 space-y-2 p-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-emerald-700">{a.category || "Uncategorised"}</span>
                  <span className={a.isPublished ? "text-emerald-600" : "text-slate-400"}>
                    {a.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800">{a.title}</h3>
                {a.description && <p className="line-clamp-2 text-sm text-slate-500">{a.description}</p>}
                <p className="text-xs text-slate-400">/{a.slug}</p>
              </div>
              <div className="flex gap-2 border-t border-slate-50 p-3">
                <button
                  type="button"
                  onClick={() => setEditing(a)}
                  aria-label={`Edit ${a.title}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <LuPencil /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(a)}
                  aria-label={`Delete ${a.title}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  <LuTrash2 /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <JournalFormModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <JournalEditModal item={editing} onClose={() => setEditing(null)} onUpdate={handleUpdate} />
      <JournalDeleteModal item={deleting} onClose={() => setDeleting(null)} onDelete={handleDelete} />
    </div>
  );
};

export default Journal;