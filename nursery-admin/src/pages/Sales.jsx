import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, Plus, Trash2 } from "lucide-react";
import { getPosProductsApi, createSaleApi } from "../utils/adminApi";

export default function Sales() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [saleItems, setSaleItems] = useState([
    { productId: "", quantity: 1 },
  ]);

  useEffect(() => {
    let active = true;
    getPosProductsApi()
      .then((items) => {
        if (active) setProducts(items.filter((product) => product.isActive !== false));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load products.");
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleProductSelect = (index, prodId) => {
    setSaleItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, productId: prodId }
          : item
      )
    );
  };

  const updateQuantity = (index, qty) => {
    setSaleItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const addItemRow = () => {
    setSaleItems((items) => [...items, { productId: "", quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    setSaleItems((items) => items.filter((_, idx) => idx !== index));
  };

  const selectedLines = saleItems.map((item) => {
    const product = products.find((candidate) => candidate._id === item.productId);
    const basePrice = Number(product?.price || 0);
    const discount = Number(product?.discount || 0);
    const unitPrice = product?.discountType === "percent"
      ? Math.max(0, basePrice - (basePrice * discount) / 100)
      : Math.max(0, basePrice - discount);
    return { ...item, product, unitPrice };
  });
  const totalAmount = selectedLines.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const sale = await createSaleApi({
        customerName: customerName.trim() || "Walk-in Customer",
        customerPhone: customerPhone.trim(),
        paymentMethod,
        items: saleItems.map(({ productId, quantity }) => ({ productId, quantity })),
      });
      if (!sale?._id) throw new Error("Sale was created but no receipt ID was returned.");
      navigate(`/sales/${sale._id}`);
    } catch (requestError) {
      setError(requestError.message || "Unable to create the sale.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          Store POS Terminal
        </span>
        <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
          Counter Sale & Receipt Generator
        </h1>
      </div>

      {error && (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl">
          {error}
        </div>
      )}
      <form onSubmit={handleCreateSale} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / GPay</option>
                <option value="Card">Card POS</option>
              </select>
            </div>
          </div>

          {/* Sale Items Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Purchased Items</h4>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-bold text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            {selectedLines.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <select
                  required
                  value={item.productId}
                  onChange={(e) => handleProductSelect(idx, e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800"
                >
                  <option value="">{loadingProducts ? "Loading products..." : "Select Plant Product..."}</option>
                  {products.filter((product) => product.stock > 0 || product._id === item.productId).map((product) => (
                    <option key={product._id} value={product._id} disabled={product.stock <= 0}>
                      {product.name} - ₹{product.price} ({product.stock} in stock)
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  max={item.product?.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(idx, Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 rounded-xl p-2 text-xs text-center font-bold"
                />

                <span className="w-20 text-right text-xs font-extrabold text-slate-900">
                  ₹{item.unitPrice * item.quantity}
                </span>

                {saleItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Total Sale Amount</span>
              <h3 className="serif-font text-2xl font-extrabold text-emerald-950">₹{totalAmount}</h3>
            </div>

            <button
              type="submit"
              disabled={submitting || loadingProducts || products.length === 0}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" /> {submitting ? "Processing Sale..." : "Complete Sale"}
            </button>
          </div>
      </form>
    </div>
  );
}
