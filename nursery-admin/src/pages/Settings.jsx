import React, { useEffect, useRef, useState } from "react";
import { Pencil, Store, Phone, Mail, MapPin } from "lucide-react";
import StoreSettingsModal from "../components/StoreSettingsModal";
import { getSettingsApi, updateSettingsApi } from "../utils/adminApi";

const DEFAULT_SETTINGS = {
  storeName: "GreenBeli Botanical Hub",
  supportPhone: "+91 98765 43210",
  supportEmail: "support@greenbeli.in",
  address: "GreenBeli Gardeniya,Khasra No. 74, Rewari Highway Road, near Gyansagar School, Kotkasim, Alampur, Rajasthan 301702",
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const timerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => {
    const fetchSettings = async () => {
      const response = await getSettingsApi();
      if (response.success) {
        setSettings(response.data);
      }
      else {
        setError(response.message);
      }
    }
    fetchSettings();
  }, []);

  // Called by the modal with the validated values.
  const handleSave = async (values) => {
    const response = await updateSettingsApi(values);
    if (response.success) {
      setSettings(values);
      setError(null);
    }
    else {
      setError(response.message);
    }

    setSavedSuccess(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSavedSuccess(false), 2500);
  };

  const rows = [
    { icon: Store, label: "Store Name", value: settings.storeName },
    { icon: Phone, label: "Helpline Phone", value: settings.supportPhone },
    { icon: Mail, label: "Support Email", value: settings.supportEmail },
    { icon: MapPin, label: "Store Address", value: settings.address },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
          System Control
        </span>
        <h1 className="serif-font text-3xl font-bold text-slate-900 mt-0.5">
          Nursery Store Settings
        </h1>
      </div>

      {savedSuccess && (
        <div role="status" className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-2xl">
          ✓ Store information updated successfully!
        </div>
      )}

      {error && (
        <div role="status" className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-2xl">
          {error || "Something went wrong please try again."}
        </div>
      )}

      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="serif-font font-bold text-lg text-slate-900">Store Information</h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-900 transition flex items-center gap-2 shadow-md"
          >
            <Pencil className="w-4 h-4" /> Edit Information
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className={`flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 ${label === "Store Address" ? "sm:col-span-2" : ""}`}>
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900 break-words">{value || "N/A"}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <StoreSettingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialValues={settings}
        onSave={handleSave}
      />
    </div>
  );
}