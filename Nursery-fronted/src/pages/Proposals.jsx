import React, { useState } from "react";
import { Sparkles, Send, CheckCircle2, Building2, Home, TreePine } from "lucide-react";
import { submitProposal } from "../utils/api";

export default function Proposals() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Residential Balcony",
    estimatedBudget: "₹10,000 - ₹25,000",
    spaceSize: "",
    requirements: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await submitProposal(formData);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Custom Botanical Landscape
        </span>
        <h1 className="serif-font text-3xl sm:text-4xl font-bold text-slate-900">
          Request a Custom Garden Proposal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Fill in your project scope below and our landscape architects will prepare a 3D layout & plant estimation.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-xl space-y-6">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-3xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="serif-font font-bold text-xl">Proposal Request Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our landscape horticulturist will analyze your space details and contact you within 24 hours with a custom proposal.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-900"
            >
              Submit Another Project
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Project Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Select Project Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { type: "Residential Balcony", icon: Home, desc: "Apartment balcony & terrace greens" },
                  { type: "Villa Garden", icon: TreePine, desc: "Full garden landscape & lawn design" },
                  { type: "Corporate Office", icon: Building2, desc: "Indoor biophilic office planters" },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, projectType: item.type })}
                    className={`p-4 rounded-2xl border text-left transition ${
                      formData.projectType === item.type
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                        : "border-slate-200 text-slate-700 hover:border-emerald-300"
                    }`}
                  >
                    <item.icon className="w-5 h-5 text-emerald-700 mb-2" />
                    <h4 className="font-bold text-xs">{item.type}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vikram@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget</label>
                <select
                  value={formData.estimatedBudget}
                  onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Under ₹10,000">Under ₹10,000</option>
                  <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000+">₹50,000+ (Custom Landscape)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Scope & Requirements</label>
              <textarea
                required
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Describe space dimensions, sunlight direction, favorite plant varieties, ceramic planter preferences..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-4 rounded-2xl text-xs shadow-xl transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {submitting ? "Submitting Request..." : "Request Proposal Design"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
