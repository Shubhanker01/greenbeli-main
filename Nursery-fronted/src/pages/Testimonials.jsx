import React, { useState, useEffect } from "react";
import { Star, Quote, Sparkles, Plus, UserRound } from "lucide-react";
import { getTestimonials, submitTestimonial } from "../utils/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        setLoadError(error.message || "Unable to load testimonials. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("city", city);
    formData.append("rating", rating);
    formData.append("comment", comment);

    await submitTestimonial(formData);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccess(false);
      setName("");
      setComment("");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-sm font-extrabold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Customer Stories
          </span>
          <h1 className="serif-font text-4xl sm:text-5xl font-bold text-slate-900 mt-1">
            Nursery Reviews & Feedback
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-emerald-900 transition flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" /> Share Your Review
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-100 rounded-3xl h-48 animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 rounded-3xl p-8 text-center text-base">
          {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.length === 0 ? (
            <p className="md:col-span-2 rounded-3xl border border-emerald-100 bg-white p-8 text-center text-base text-slate-600">
              No testimonials are available yet. Be the first to share your experience.
            </p>
          ) : testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-sm space-y-5 relative overflow-hidden"
            >
              <Quote className="w-16 h-16 text-emerald-50 absolute top-5 right-5 pointer-events-none" />
              
              <div className="flex items-center gap-1 text-amber-400" aria-label={`${Math.min(5, Math.max(1, Number(t.rating) || 5))} out of 5 stars`}>
                {[...Array(Math.min(5, Math.max(1, Number(t.rating) || 5)))].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>

              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
                "{t.comment || t.review}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserRound className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg">{t.name}</h4>
                  {(t.role || t.city) && (
                    <p className="text-sm text-emerald-700">
                      {[t.role, t.city].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100">
            <h3 className="serif-font text-2xl font-bold text-slate-900 mb-2">Write a Testimonial</h3>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-2xl text-center">
                ✨ Thank you! Your review has been submitted for approval.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Role / Passion</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Plant Parent"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Review Details</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-800 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
