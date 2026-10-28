import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Edit3, Trash2, Sprout, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminProductsApi, deleteProductApi } from "../utils/adminApi";

const PAGE_SIZE = 10;

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load paginated data whenever page or debounced search changes
  useEffect(() => {
    let isCurrentRequest = true;

    async function loadData() {
      setLoading(true);
      setDeleteError("");
      try {
        const data = await getAdminProductsApi(page, PAGE_SIZE, debouncedSearch);
        if (isCurrentRequest) {
          setProducts(Array.isArray(data?.items) ? data.items : []);
          setPagination({
            total: data?.total || 0,
            totalPages: Math.max(1, data?.totalPages || Math.ceil((data?.total || 0) / PAGE_SIZE)),
          });
        }
      } catch (error) {
        if (isCurrentRequest) {
          setDeleteError(error.message || "Unable to load products.");
          setProducts([]);
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
  }, [page, debouncedSearch]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProductApi(productToDelete._id);
      setProducts((currentProducts) => currentProducts.filter((p) => p._id !== productToDelete._id));
      setPagination((prev) => {
        const newTotal = Math.max(0, prev.total - 1);
        return {
          total: newTotal,
          totalPages: Math.max(1, Math.ceil(newTotal / PAGE_SIZE)),
        };
      });
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
      setProductToDelete(null);
    } catch (error) {
      setDeleteError(error.message || "Unable to delete the product. Please try again.");
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Inventory Management
          </span>
          <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
            Plant Catalog Products
          </h1>
        </div>

        <Link
          to="/products/new"
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-3 rounded-2xl transition flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Plant Product
        </Link>
      </div>

      {deleteError && (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl">
          {deleteError}
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plant name, SKU, or category..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs font-bold text-slate-500">
          Total {pagination.total} products
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading products catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Sprout className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="serif-font text-lg font-bold text-slate-800">No products found</h3>
            <Link to="/products/new" className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl inline-block">
              Add First Plant Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-4 font-bold">Plant Image</th>
                  <th className="py-3.5 px-4 font-bold">Product Name</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Price</th>
                  <th className="py-3.5 px-4 font-bold">Stock Amount</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const categoryName = p.categoryId?.name || p.category || "Indoor Plants";
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <img
                          src={p.images?.[0] || p.image || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=200&q=80"}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-emerald-50"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <p>{p.name}</p>
                        {p.sku && <p className="text-[10px] text-slate-400 font-normal">SKU: {p.sku}</p>}
                      </td>
                      <td className="py-3 px-4 text-emerald-800 font-semibold">{categoryName}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">₹{p.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          (p.stock || 0) < 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {p.stock ?? 0} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/products/edit/${p._id}`)}
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && pagination.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {Math.min((page - 1) * PAGE_SIZE + 1, pagination.total)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(page * PAGE_SIZE, pagination.total)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{pagination.total}</span> products
            </p>

            <nav aria-label="Products pagination" className="flex items-center gap-1 self-center sm:self-auto">
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
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) setProductToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div>
              <h2 id="delete-product-title" className="serif-font text-xl font-bold text-slate-900">
                Delete plant product?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-slate-900">{productToDelete.name}</span>?
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
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
                {deleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
