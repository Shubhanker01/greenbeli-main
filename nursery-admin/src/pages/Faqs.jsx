// pages/Faqs.jsx : admin list of FAQs
import { useCallback, useEffect, useState } from "react";
import { LuPlus, LuCircleHelp, LuPencil, LuTrash2 } from "react-icons/lu";
import api from "../lib/axios"; // adjust to however you export your axios instance
import FaqFormModal from "../components/FaqFormModal";
import FaqEditModal from "../components/FaqEditModal";
import FaqDeleteModal from "../components/FaqDeleteModal";
import { errorMessage } from "../components/FormModal";

const FAQS_URL = "/content/faqs"; // GET/POST here, PUT/DELETE on `${FAQS_URL}/:id`

const bySortOrder = (list) => [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

const Faqs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);   // the FAQ being edited
  const [deleting, setDeleting] = useState(null); // the FAQ awaiting delete confirmation

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(FAQS_URL);
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
    const res = await api.post(FAQS_URL, payload);
    setItems((prev) => bySortOrder([...prev, res.data]));
  };

  const handleUpdate = async (id, changes) => {
    const res = await api.put(`${FAQS_URL}/${id}`, changes);
    // re-sort in case the sort order changed
    setItems((prev) => bySortOrder(prev.map((f) => (f._id === id ? res.data : f))));
  };

  const handleDelete = async (id) => {
    await api.delete(`${FAQS_URL}/${id}`);
    setItems((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">FAQs</h1>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          <LuPlus /> Create FAQ
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
          <LuCircleHelp className="text-3xl" />
          <p>No FAQs</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((f) => (
            <li key={f._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-emerald-700">{f.category}</span>
                <span className="text-slate-400">
                  {f.isActive === false && <span className="mr-3 font-bold text-slate-400">Inactive</span>}
                  Order {f.sortOrder ?? 0}
                </span>
              </div>
              <h3 className="font-bold text-slate-800">{f.question}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-500">{f.answer}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(f)}
                  aria-label={`Edit ${f.question}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <LuPencil /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(f)}
                  aria-label={`Delete ${f.question}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  <LuTrash2 /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <FaqFormModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <FaqEditModal item={editing} onClose={() => setEditing(null)} onUpdate={handleUpdate} />
      <FaqDeleteModal item={deleting} onClose={() => setDeleting(null)} onDelete={handleDelete} />
    </div>
  );
};

export default Faqs;