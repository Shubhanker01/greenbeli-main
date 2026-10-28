import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { deleteLeadStatusApi, getAdminLeadsApi, updateLeadStatusApi } from "../utils/adminApi";

const PAGE_SIZE = 10;

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [updatingLeadIds, setUpdatingLeadIds] = useState(() => new Set());
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const data = await getAdminLeadsApi(page, PAGE_SIZE);
        if (isCurrentRequest) {
          setLeads(Array.isArray(data.items) ? data.items : []);
          setPagination({
            total: data.total || 0,
            totalPages: Math.max(1, Math.ceil((data.total || 0) / PAGE_SIZE)),
          });
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setLeads([]);
          setPagination({ total: 0, totalPages: 1 });
          setError(`Could not load leads: ${requestError.message}`);
        }
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    }
    loadData();

    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  const handleStatusChange = async (id, status) => {
    setError("");
    setUpdatingLeadIds(prev => new Set(prev).add(id));
    try {
      await updateLeadStatusApi(id, status);
      setLeads(prev => prev.map(lead => lead._id === id ? { ...lead, status } : lead));
    } catch (requestError) {
      setError(`Could not update lead status: ${requestError.message}`);
    } finally {
      setUpdatingLeadIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;

    setDeleting(true);
    setError("");
    try {
      await deleteLeadStatusApi(leadToDelete._id);
      setLeads(prev => prev.filter(lead => lead._id !== leadToDelete._id));
      setPagination(prev => {
        const total = Math.max(0, prev.total - 1);
        return {
          total,
          totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        };
      });
      if (leads.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      }
      setLeadToDelete(null);
    } catch (requestError) {
      setError(`Could not delete lead: ${requestError.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const firstVisiblePage = Math.max(1, page - 2);
  const lastVisiblePage = Math.min(pagination.totalPages, page + 2);
  const visiblePages = Array.from(
    { length: lastVisiblePage - firstVisiblePage + 1 },
    (_, index) => firstVisiblePage + index
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          Inquiries & Leads
        </span>
        <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
          Customer Inquiry Tracker
        </h1>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </p>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading leads...</div>
        ) : pagination.total === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No active leads received.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-4 font-bold">Contact Name</th>
                  <th className="py-3.5 px-4 font-bold">Email & Phone</th>
                  <th className="py-3.5 px-4 font-bold">Subject</th>
                  <th className="py-3.5 px-4 font-bold">Message Details</th>
                  <th className="py-3.5 px-4 font-bold">Lead Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <p className="font-bold">{lead.email}</p>
                      <p className="text-slate-400">{lead.phone || "+91 98765 43210"}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">{lead.subject || "Inquiry"}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{lead.message}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status || "New"}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        disabled={updatingLeadIds.has(lead._id)}
                        className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1"
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                        <option value="Lost">Lost</option>
                      </select>
                      {updatingLeadIds.has(lead._id) && (
                        <span role="status" className="block mt-1 text-[10px] text-slate-500">
                          Updating lead...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setLeadToDelete(lead)}
                        disabled={updatingLeadIds.has(lead._id)}
                        aria-label={`Delete lead from ${lead.name}`}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && pagination.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} of {pagination.total} leads
            </p>
            <nav aria-label="Lead pagination" className="flex flex-wrap items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setPage(current => Math.max(1, current - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              {firstVisiblePage > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    className="h-9 min-w-9 rounded-lg px-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                  >
                    1
                  </button>
                  {firstVisiblePage > 2 && <span className="px-1 text-slate-400">...</span>}
                </>
              )}
              {visiblePages.map(pageNumber => (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={pageNumber === page ? "page" : undefined}
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${
                    pageNumber === page
                      ? "bg-emerald-800 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              {lastVisiblePage < pagination.totalPages && (
                <>
                  {lastVisiblePage < pagination.totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
                  <button
                    type="button"
                    onClick={() => setPage(pagination.totalPages)}
                    className="h-9 min-w-9 rounded-lg px-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setPage(current => Math.min(pagination.totalPages, current + 1))}
                disabled={page === pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>

      {leadToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) setLeadToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-lead-title"
            className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div>
              <h2 id="delete-lead-title" className="serif-font text-xl font-bold text-slate-900">
                Delete this lead?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                This will permanently delete the inquiry from {leadToDelete.name}.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setLeadToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
