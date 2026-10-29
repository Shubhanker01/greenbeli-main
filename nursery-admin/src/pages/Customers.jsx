import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../lib/axios";
import EditCustomerModal from "../components/EditCustomerModal";
import DeleteCustomerModal from "../components/DeleteCustomerModal";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCustomers() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/customers?page=${page}&limit=${limit}`, {
          signal: controller.signal
        });

        const resultData = response.data.data || response.data;
        if (Array.isArray(resultData)) {
          setCustomers(resultData);
          setTotalPages(response.data.totalPages || 1);
          setTotalUsers(response.data.total || resultData.length);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          if (err.response?.status === 404) {
            setCustomers([]);
            setTotalPages(1);
            setTotalUsers(0);
          } else {
            setError(err.response?.data?.message || err.message || 'Failed to load customers');
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();

    return () => {
      controller.abort();
    };
  }, [page]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/customers', { name, email, phone, password });
      const newCustomer = response.data.data || response.data;
      setCustomers(prev => [newCustomer, ...prev]);
      setTotalUsers(prev => prev + 1);
      setIsCreateModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err) {
      console.error("Failed to create customer:", err);
      alert(err.response?.data?.message || "Failed to create customer account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSuccess = (updatedCustomer) => {
    setCustomers(prev =>
      prev.map(c => (c._id === updatedCustomer._id ? updatedCustomer : c))
    );
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteSuccess = (deletedId) => {
    setCustomers(prev => prev.filter(c => c._id !== deletedId));
    setTotalUsers(prev => Math.max(0, prev - 1));
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Community Directory
          </span>
          <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
            Registered Customers
          </h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-3 rounded-2xl transition flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs font-bold text-slate-500">Total {totalUsers} Users</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex justify-center items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-800"></div>
            Loading customers directory...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No registered customer found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-4 font-bold">Customer Name</th>
                  <th className="py-3.5 px-4 font-bold">Email</th>
                  <th className="py-3.5 px-4 font-bold">Phone</th>
                  <th className="py-3.5 px-4 font-bold">Registered Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                        {u.name ? u.name[0].toUpperCase() : "U"}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.phone || "N/A"}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(u);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition"
                        title="Edit Customer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(u);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs">
            <span className="text-slate-500 font-medium">
              Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 font-bold"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="serif-font font-bold text-lg text-slate-900">Add New Customer Account</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
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
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {submitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal Component */}
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onSuccess={handleUpdateSuccess}
      />

      {/* Delete Customer Modal Component */}
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        customer={selectedCustomer}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}