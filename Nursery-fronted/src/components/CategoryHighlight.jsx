import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { resolveImageUrl } from '../utils/api'
import { Reveal, RevealGroup } from './Reveal'
import axiosApi from '../lib/axios'

function CategoryHighlight() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axiosApi.get('/categories');
                setCategories(response.data.items);
            } catch (err) {
                if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                    setError(err.response?.data?.message || err.message || 'Failed to load categories');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

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

    if (error) {
        return (
            <div className="max-w-md mx-auto my-10 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
            </div>
        );
    }

    if (!categories.length) {
        return null; // Or a friendly empty state
    }

    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* Light emerald glass panel wrapping the whole section */}
                <div className="relative overflow-hidden p-5 sm:p-10 lg:p-14">
                    {/* Soft ambient glow for depth */}
                    <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-300/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />

                    <div className="relative z-10">
                        {/* Centered header */}
                        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                            <Reveal>
                                <span className="inline-block text-emerald-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-emerald-100/90 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-emerald-200">
                                    Curated Nursery Collections
                                </span>
                                <h2 className="serif-font text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1f4a34] mt-3">
                                    Browse by Botanical Category
                                </h2>
                            </Reveal>
                        </div>

                        {/* Category Grid: 3 columns on desktop, generous spacing */}
                        <RevealGroup className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10">
                            {categories.map((cat) => (
                                <Reveal key={cat._id || cat.slug} effect='card' className="h-full">
                                    {/* Figma card: no background, border or padding. Photo on top, text underneath. */}
                                    <Link
                                        to={`/category/${cat.slug}`}
                                        className="group block touch-active"
                                    >
                                        <div className="relative aspect-[8/9] sm:aspect-square overflow-hidden rounded-md bg-emerald-100/60">
                                            <img
                                                src={resolveImageUrl(cat.imageUrl || cat.image)}
                                                alt={cat.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                            />

                                            {/* Round corner button, like the "+" on the Figma cards */}
                                            <span
                                                aria-hidden="true"
                                                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#1f4a34] shadow-md flex items-center justify-center transition-colors duration-300 group-hover:bg-[#1f4a34] group-hover:text-white"
                                            >
                                                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </span>
                                        </div>

                                        <div className="pt-3 sm:pt-4">
                                            <h3 className="serif-font text-lg sm:text-2xl font-bold text-[#1f4a34] leading-snug">
                                                {cat.name}
                                            </h3>
                                            <p className="mt-1 inline-flex items-center gap-1.5 text-sm sm:text-base text-stone-600 transition-colors group-hover:text-[#1f4a34]">
                                                Explore category
                                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </p>
                                        </div>
                                    </Link>
                                </Reveal>
                            ))}
                        </RevealGroup>

                        {/* View-all link, bottom right of the panel */}
                        <div className="mt-8 sm:mt-12 flex justify-center sm:justify-end">
                            <Link
                                to="/products"
                                className="group inline-flex items-center gap-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold px-5 py-2.5 sm:px-6 sm:py-3 shadow-lg shadow-emerald-900/20 transition touch-active"
                            >
                                View Entire Shop Catalog
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CategoryHighlight