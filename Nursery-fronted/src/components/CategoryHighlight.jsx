import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { resolveImageUrl } from '../utils/api'
import { Reveal, RevealGroup } from './Reveal'

function CategoryHighlight({ categories }) {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* Light emerald glass panel wrapping the whole section */}
                <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-100/40 via-emerald-50/25 to-emerald-100/35 backdrop-blur-sm border border-white/60 shadow-xl shadow-emerald-900/10 ring-1 ring-emerald-900/5 p-5 sm:p-10 lg:p-14">
                    {/* Soft ambient glow for depth */}
                    <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-300/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />

                    <div className="relative z-10">
                        {/* Centered header */}
                        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
                            <Reveal>
                                <span className="inline-block text-emerald-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-emerald-100/90 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-emerald-200">
                                    Curated Nursery Collections
                                </span>
                                <h2 className="serif-font text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                    Browse by Botanical Category
                                </h2>
                            </Reveal>

                        </div>

                        {/* Category Grid: 3 columns on desktop, generous spacing */}
                        <RevealGroup className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
                            {categories.map((cat) => (
                                <Reveal key={cat._id || cat.slug} effect='card' className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 border border-emerald-700/40 shadow-xl shadow-emerald-950/25 p-3 sm:p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-950/40 hover:border-emerald-500/50 touch-active">
                                    <Link
                                        key={cat._id || cat.slug}
                                        to={`/category/${cat.slug}`}

                                    >
                                        <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5 bg-emerald-950 relative">
                                            <img
                                                src={resolveImageUrl(cat.image)}
                                                alt={cat.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent group-hover:opacity-60 transition-opacity" />
                                        </div>

                                        <div className="text-center pb-1 sm:pb-2">
                                            <h3 className="serif-font text-sm sm:text-xl font-bold text-white group-hover:text-emerald-300 transition truncate">
                                                {cat.name}
                                            </h3>
                                            <p className="text-[10px] sm:text-xs text-emerald-300 font-semibold mt-1 sm:mt-1.5 inline-flex items-center gap-1">
                                                Explore Category
                                                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
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