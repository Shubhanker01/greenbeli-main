import PlantCard from './PlantCard';
import { Reveal, RevealGroup } from './Reveal'; // adjust path to where you saved Reveal.jsx

const TABS = [
    { id: "all", label: "All Botanical Store" },
    { id: "indoor", label: "Indoor Air Purifiers" },
    { id: "outdoor", label: "Balcony & Garden" },
    { id: "pots", label: "Pots & Planters" },
];

const GRID = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6";

function FeaturedCollection({
    loading,
    filteredProducts,
    activeTab,
    setActiveTab,
}) {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* Warm sand/amber glass panel: the complement to the emerald used everywhere else.
                    (Plain div on purpose: every block inside reveals on its own scroll position.) */}
                <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-amber-100/50 via-orange-50/30 to-amber-100/40 backdrop-blur-sm border border-amber-200/60 shadow-xl shadow-amber-900/10 ring-1 ring-amber-900/5 p-5 sm:p-10 lg:p-14">
                    {/* Soft ambient glows for depth */}
                    <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-300/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-orange-300/20 blur-3xl" />

                    <div className="relative z-10">
                        {/* Header */}
                        <Reveal className="relative isolate text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3">
                            {/* Soft glow so the heading stays crisp over the pattern */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -z-10 inset-x-0 -inset-y-6 mx-auto max-w-xl rounded-full bg-white/60 blur-2xl"
                            />
                            <span className="inline-block text-amber-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-amber-100/90 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-amber-200">
                                Botanist Recommended
                            </span>
                            <h2 className="serif-font text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                Trending & Bestselling Plants
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                Handpicked indoor air purifiers, potted plants, and landscape ornamentals nurtured organically.
                            </p>
                        </Reveal>

                        {/* Category Filter Tabs (Scrollable on mobile) */}
                        <Reveal delay={0.1}>
                            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 sm:pb-4 mb-6 sm:mb-8 px-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap touch-active ${activeTab === tab.id
                                            ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20 scale-105"
                                            : "bg-white/70 backdrop-blur-md text-slate-700 hover:bg-white/90 hover:text-amber-900 border border-amber-200/70 shadow-sm"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </Reveal>

                        {/* Product Cards Grid (2-column on mobile!) */}
                        {loading ? (
                            <div className={GRID}>
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="h-64 sm:h-80 bg-amber-100/60 animate-pulse rounded-2xl sm:rounded-3xl" />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <p className="text-center text-sm text-slate-600 py-10">
                                No plants in this collection yet. Check back soon!
                            </p>
                        ) : (
                            // key={activeTab}: switching tabs replays the staggered reveal for the new set
                            <RevealGroup key={activeTab} stagger={0.08} delay={0} className={GRID}>
                                {filteredProducts.map((product) => (
                                    <Reveal key={product._id} effect="card">
                                        <PlantCard product={product} />
                                    </Reveal>
                                ))}
                            </RevealGroup>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FeaturedCollection