import { useState, useEffect } from "react";
import { Star, Quote, Plus, CheckCircle2 } from "lucide-react";
import { Reveal, RevealGroup } from "./Reveal";
import axiosApi from "../lib/axios"; // Adjust path to your axios instance
import { X } from 'lucide-react';

// Color Palette Tokens based on Figma Design
const GREEN = "#1f4a34";
const GREEN_DARK = "#163828";
const SAGE = "#e8ede1";

export default function TestimonialsSection({ onShare }) {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                // Adjust route path to match your backend testimonials endpoint
                const response = await axiosApi.get('/testimonials', {
                    signal: controller.signal
                });
                setTestimonials(response.data.items);
            } catch (err) {
                if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                    console.error("Failed to load testimonials:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();

        return () => {
            controller.abort();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
            </div>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
            {/* Main Section Outer Box - Matches Cream/Sage Warm Aesthetic */}
            <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 border border-[#e2decb] shadow-sm bg-cream">
                <div className="relative z-10">
                    {/* Header Block matching Figma typography */}
                    <Reveal className="relative text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
                        <span
                            className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border border-[#d8d2bf]"
                            style={{ backgroundColor: SAGE, color: GREEN_DARK }}
                        >
                            PLANT PARENT STORIES
                        </span>

                        <h2
                            className="serif-font text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
                            style={{ color: GREEN_DARK }}
                        >
                            What Our Customers Say
                        </h2>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                            Real words from the plant parents who bring our greenery home.
                        </p>
                    </Reveal>

                    {/* Testimonial Cards Grid */}
                    <RevealGroup stagger={0.14} delay={0.05} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {testimonials.slice(0, 3).map((item) => {
                            const rating = Math.min(5, Math.max(1, item.rating || 5));
                            const initial = (item.name || "?").trim().charAt(0).toUpperCase();

                            return (
                                <Reveal key={item._id} effect="card" className="h-full">
                                    <figure
                                        className="relative h-full flex flex-col justify-between gap-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#eae5d8] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <Quote
                                            aria-hidden="true"
                                            className="absolute top-6 right-6 w-8 h-8 sm:w-10 sm:h-10 opacity-20"
                                            style={{ color: GREEN }}
                                        />

                                        <div className="space-y-4">
                                            {/* Rating Stars */}
                                            <div
                                                className="flex items-center gap-1"
                                                role="img"
                                                aria-label={`${rating} out of 5 stars`}
                                            >
                                                {[...Array(rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                ))}
                                            </div>

                                            {/* Quote Text */}
                                            <blockquote className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
                                                "{item.comment}"
                                            </blockquote>
                                        </div>

                                        {/* Author Footer */}
                                        <figcaption className="pt-5 border-t border-slate-100 flex items-center gap-3 sm:gap-4">
                                            <div
                                                className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full text-white flex items-center justify-center text-sm sm:text-base font-bold"
                                                style={{ backgroundColor: GREEN }}
                                            >
                                                {initial}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs sm:text-sm text-slate-500 truncate">
                                                    {item.city || "India"}
                                                </p>
                                            </div>
                                        </figcaption>
                                    </figure>
                                </Reveal>
                            );
                        })}
                    </RevealGroup>

                    {/* Action Button styled like Figma Primary Green Buttons */}
                    <Reveal className="mt-10 sm:mt-14 flex justify-center">
                        <button
                            onClick={onShare}
                            className="group inline-flex items-center gap-2 rounded-full text-white text-sm font-bold px-7 py-3.5 shadow-sm transition hover:opacity-95 touch-active"
                            style={{ backgroundColor: GREEN }}
                        >
                            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                            Share Your Garden Story
                        </button>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Review Modal Component                                             */
/* ------------------------------------------------------------------ */
const FIELD =
    "w-full bg-[#faf8f5] border border-[#e2decb] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:bg-white focus:border-[#1f4a34] focus:ring-2 focus:ring-[#1f4a34]/15";
const LABEL = "text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider";

export function TestimonialModal({
    open,
    onClose,
    reviewSuccess,
    reviewSubmitting,
    handleTestimonialSubmit,
    reviewName,
    setReviewName,
    reviewRole,
    setReviewRole,
    reviewCity,
    setReviewCity,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-title"
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#e2decb] animate-fade-in relative"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3
                    id="review-title"
                    className="serif-font text-2xl sm:text-3xl font-bold mb-2 pr-10"
                    style={{ color: GREEN_DARK }}
                >
                    Share Your Nursery Review
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Let other plant parents know about your experience with GreenBeli.
                </p>

                {reviewSuccess ? (
                    <div
                        className="p-6 sm:p-8 rounded-2xl text-center space-y-4 border border-[#d3ddc7]"
                        style={{ backgroundColor: SAGE }}
                    >
                        <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: GREEN }} />
                        <p className="text-base font-bold" style={{ color: GREEN_DARK }}>
                            Thank you! Your garden review was submitted successfully.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 text-white text-sm font-bold px-6 py-2.5 rounded-full transition hover:opacity-95"
                            style={{ backgroundColor: GREEN }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="rv-name" className={LABEL}>Your Name</label>
                            <input
                                id="rv-name"
                                type="text"
                                required
                                autoFocus
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="e.g. Ananya Sharma"
                                className={FIELD}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="rv-role" className={LABEL}>Role / Tag</label>
                                <input
                                    id="rv-role"
                                    type="text"
                                    value={reviewRole}
                                    onChange={(e) => setReviewRole(e.target.value)}
                                    placeholder="e.g. Balcony Gardener"
                                    className={FIELD}
                                />
                            </div>
                            <div>
                                <label htmlFor="rv-city" className={LABEL}>City</label>
                                <input
                                    id="rv-city"
                                    type="text"
                                    value={reviewCity}
                                    onChange={(e) => setReviewCity(e.target.value)}
                                    placeholder="e.g. Mumbai"
                                    className={FIELD}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="rv-rating" className={LABEL}>Rating</label>
                            <select
                                id="rv-rating"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                className={FIELD}
                            >
                                <option value={5}>5 Stars ★★★★★</option>
                                <option value={4}>4 Stars ★★★★☆</option>
                                <option value={3}>3 Stars ★★★☆☆</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="rv-comment" className={LABEL}>Your Feedback</label>
                            <textarea
                                id="rv-comment"
                                required
                                rows={4}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Tell us how your plant arrived and how it is doing..."
                                className={`${FIELD} resize-none`}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="text-white text-sm font-bold px-7 py-2.5 rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95"
                                style={{ backgroundColor: GREEN }}
                            >
                                {reviewSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}