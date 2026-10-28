import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { deleteProposalApi, getAdminProposalsApi, updateProposalApi } from "../utils/adminApi";

const PAGE_SIZE = 10;

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadData() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getAdminProposalsApi(page, PAGE_SIZE);
        if (isCurrentRequest) {
          setProposals(Array.isArray(data?.proposals) ? data.proposals : []);
          setPagination({
            total: data?.total || 0,
            totalPages: Math.max(1, data?.totalPages || Math.ceil((data?.total || 0) / PAGE_SIZE)),
          });
        }
      } catch (error) {
        if (isCurrentRequest) {
          setLoadError(error.message || "Unable to load proposal requests.");
          setProposals([]);
          setPagination({ total: 0, totalPages: 1 });
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateProposalApi(id, status);
      setProposals(prev => prev.map(p => (p._id === id ? { ...p, status } : p)));
    } catch (err) {
      setLoadError(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!proposalToDelete) return;

    setDeleting(true);
    setLoadError("");
    try {
      await deleteProposalApi(proposalToDelete._id);
      setProposals(prev => prev.filter(p => p._id !== proposalToDelete._id));
      setPagination(prev => {
        const total = Math.max(0, prev.total - 1);
        return {
          total,
          totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        };
      });
      if (proposals.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      }
      setProposalToDelete(null);
    } catch (err) {
      setLoadError(`Failed to delete proposal: ${err.message}`);
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
          Landscape Projects
        </span>
        <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
          Custom Proposal Requests
        </h1>
      </div>

      {loadError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {loadError}
        </p>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading proposal requests...</div>
        ) : loadError && proposals.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">Proposal requests could not be loaded.</div>
        ) : proposals.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">No proposal requests received.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider bg-slate-50/50 text-xs">
                  <th className="py-4 px-5 font-bold">Client Name</th>
                  <th className="py-4 px-5 font-bold">Project Type</th>
                  <th className="py-4 px-5 font-bold">Est. Budget</th>
                  <th className="py-4 px-5 font-bold">Requirements</th>
                  <th className="py-4 px-5 font-bold">Status</th>
                  <th className="py-4 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {proposals.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      <p className="text-sm font-semibold">{prop.name}</p>
                      <p className="text-xs text-slate-400 font-normal">{prop.phone || prop.email}</p>
                    </td>
                    <td className="py-4 px-5 font-bold text-emerald-800 text-sm">{prop.projectType}</td>
                    <td className="py-4 px-5 font-extrabold text-slate-900 text-sm">{prop.estimatedBudget}</td>
                    <td className="py-4 px-5 text-slate-600 max-w-xs text-sm truncate" title={prop.requirements}>
                      {prop.requirements}
                    </td>
                    <td className="py-4 px-5">
                      <select
                        value={prop.status || "Pending"}
                        disabled={updatingId === prop._id}
                        onChange={(e) => handleStatusChange(prop._id, e.target.value)}
                        className="text-sm font-bold bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="Pending">🟡 Pending Review</option>
                        <option value="Proposal Sent">🔵 Proposal Sent</option>
                        <option value="Approved">🟢 Approved</option>
                        <option value="Rejected">🔴 Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setProposalToDelete(prop)}
                        aria-label={`Delete proposal from ${prop.name}`}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none"
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
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {Math.min((page - 1) * PAGE_SIZE + 1, pagination.total)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(page * PAGE_SIZE, pagination.total)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{pagination.total}</span> proposal requests
            </p>

            <nav aria-label="Proposals pagination" className="flex items-center gap-1 self-center sm:self-auto">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
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

              {visiblePages.map((pageNumber) => (
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
                onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
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

      {/* Delete Confirmation Modal */}
      {proposalToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) setProposalToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-proposal-title"
            className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div>
              <h2 id="delete-proposal-title" className="serif-font text-xl font-bold text-slate-900">
                Delete this proposal request?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                This will permanently delete the proposal request from <span className="font-semibold text-slate-900">{proposalToDelete.name}</span>.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProposalToDelete(null)}
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
                {deleting ? "Deleting..." : "Delete Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
