import { useEffect } from "react";
import { Star, Quote, Plus, CheckCircle2, X } from "lucide-react";
import { Reveal, RevealGroup } from "./Reveal";
export default function TestimonialsSection({ testimonials = [], onShare }) {
    if (testimonials.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
            {/* Light emerald glass panel: same look as the category section */}
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-100/40 via-emerald-50/25 to-emerald-100/35 backdrop-blur-sm border border-white/60 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-900/5 p-5 sm:p-10 lg:p-14">
                {/* Soft ambient glows */}
                <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-300/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />

                <div className="relative z-10">
                    {/* Header */}
                    <Reveal className="relative isolate text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -z-10 inset-x-0 -inset-y-6 mx-auto max-w-xl rounded-full bg-white/60 blur-2xl"
                        />
                        <span className="inline-block text-emerald-800 text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-emerald-100/90 px-4 py-1.5 sm:py-2 rounded-full border border-emerald-200">
                            Plant Parent Stories
                        </span>
                        <h2 className="serif-font text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                            What Our Customers Say
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-lg leading-relaxed">
                            Real words from the plant parents who bring our greenery home.
                        </p>
                    </Reveal>

                    {/* Cards */}
                    <RevealGroup stagger={0.14} delay={0.05} className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
                        {testimonials.slice(0, 3).map((item) => {
                            const rating = Math.min(5, Math.max(1, item.rating || 5));
                            const initial = (item.name || "?").trim().charAt(0).toUpperCase();
                            return (
                                <Reveal key={item._id} effect="card" className="h-full">
                                    {/* Reveal owns the entrance transform; the card keeps its own hover lift */}
                                    <figure className="relative h-full flex flex-col justify-between gap-6 bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg shadow-emerald-900/5 transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl">
                                        <Quote
                                            aria-hidden="true"
                                            className="absolute top-5 right-6 w-10 h-10 sm:w-12 sm:h-12 text-emerald-200/80"
                                        />

                                        <div className="space-y-4">
                                            <div
                                                className="flex items-center gap-1"
                                                role="img"
                                                aria-label={`${rating} out of 5 stars`}
                                            >
                                                {[...Array(rating)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>
                                            <blockquote className="text-slate-700 text-base sm:text-lg leading-relaxed">
                                                "{item.comment}"
                                            </blockquote>
                                        </div>

                                        <figcaption className="pt-5 border-t border-emerald-900/10 flex items-center gap-3 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 text-white flex items-center justify-center text-lg sm:text-xl font-bold shadow-md">
                                                {initial}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base sm:text-lg font-bold text-slate-900 truncate">{item.name}</p>
                                                <p className="text-sm sm:text-base text-emerald-700 leading-snug">
                                                    {item.role || "Plant Lover"} • {item.city || "India"}
                                                </p>
                                            </div>
                                        </figcaption>
                                    </figure>
                                </Reveal>
                            );
                        })}
                    </RevealGroup>

                    {/* Share button */}
                    <Reveal className="mt-8 sm:mt-12 flex justify-center">
                        <button
                            onClick={onShare}
                            className="group inline-flex items-center gap-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm sm:text-base font-bold px-6 py-3 sm:px-8 sm:py-3.5 shadow-lg shadow-emerald-900/20 transition touch-active"
                        >
                            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Share Your Garden Story
                        </button>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Review modal (named export)                                         */
/* ------------------------------------------------------------------ */
const FIELD =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15";
const LABEL = "text-sm font-bold text-slate-700 block mb-1.5";

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
    // Escape closes the modal and the page behind it stops scrolling while it's open
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-title"
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100 animate-fade-in relative"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 id="review-title" className="serif-font text-2xl sm:text-3xl font-bold text-slate-900 mb-2 pr-10">
                    Share Your Nursery Review
                </h3>
                <p className="text-sm sm:text-base text-slate-500 mb-6 leading-relaxed">
                    Let other plant lovers know about your experience with GreenBeli.
                </p>

                {reviewSuccess ? (
                    <div className="bg-emerald-50 text-emerald-800 p-6 sm:p-8 rounded-2xl text-center space-y-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                        <p className="text-base sm:text-lg font-bold">Thank you! Your garden review was submitted successfully.</p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 bg-emerald-800 text-white text-sm sm:text-base font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-emerald-900 transition"
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
                                <label htmlFor="rv-role" className={LABEL}>Role/Tag</label>
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

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm sm:text-base font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="bg-emerald-800 text-white text-sm sm:text-base font-bold px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl shadow-md hover:bg-emerald-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
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