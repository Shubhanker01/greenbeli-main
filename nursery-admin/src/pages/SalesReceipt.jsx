import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Sprout } from "lucide-react";
import { getSaleApi } from "../utils/adminApi";

export default function SalesReceipt() {
  const { id } = useParams();
  const [receiptState, setReceiptState] = useState({ id: null, receipt: null, error: "" });

  useEffect(() => {
    let active = true;
    getSaleApi(id)
      .then((data) => {
        if (active) setReceiptState({ id, receipt: data, error: "" });
      })
      .catch((requestError) => {
        if (active) {
          setReceiptState({
            id,
            receipt: null,
            error: requestError.message || "Unable to load this receipt.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const loading = receiptState.id !== id;
  const receipt = loading ? null : receiptState.receipt;
  const error = loading ? "" : receiptState.error;
  const receiptDate = receipt?.createdAt
    ? new Date(receipt.createdAt).toLocaleDateString("en-IN")
    : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/sales" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to POS Sales
      </Link>

      {loading && <p role="status" className="text-xs text-slate-500">Loading receipt...</p>}
      {error && (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-2xl">
          {error}
        </div>
      )}

      {!loading && receipt && (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-700" />
            <h2 className="serif-font font-bold text-xl text-slate-900">GreenBeli Nursery Receipt</h2>
          </div>
          <button onClick={() => window.print()} className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>

        <div className="text-xs space-y-4 text-slate-700">
          <p>Receipt #{receipt.receiptNo} • Date: {receiptDate}</p>
          <p>Customer: {receipt.customerName || "Walk-in Customer"}</p>
          {receipt.customerPhone && <p>Phone: {receipt.customerPhone}</p>}
          <p>Payment method: {receipt.paymentMethod || "Cash"}</p>
          <div className="border-t border-slate-100 pt-3 space-y-2">
            {receipt.items?.map((item, index) => (
              <div key={`${item.productId || item.name}-${index}`} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-bold">₹{Number(item.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold text-emerald-950 pt-2 border-t border-slate-200">
              <span>Total Paid</span>
              <span>₹{Number(receipt.totalAmount || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
