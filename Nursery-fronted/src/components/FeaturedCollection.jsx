import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PlantCard from './PlantCard';
import { Reveal, RevealGroup } from './Reveal';
import axiosApi from '../lib/axios'; // Adjust path to your axios instance

const TABS = [
    { id: "all", label: "All Botanical Store" },
    { id: "indoor", label: "Indoor Air Purifiers" },
    { id: "outdoor", label: "Balcony & Garden" },
    { id: "pots", label: "Pots & Planters" },
];

const GREEN = "#1f4a34";
const GRID = "grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10";

function FeaturedCollection() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Adjust route path to match your backend product endpoint
                const response = await axiosApi.get('/products', {
                    signal: controller.signal
                });
                setFeaturedProducts(response.data.items);
            } catch (err) {
                if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                    console.error("Failed to load products:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            controller.abort();
        };
    }, []);

    const filteredProducts = featuredProducts.filter((product) => {
        if (activeTab === "all") return true;
        if (activeTab === "indoor") {
            return (
                product.categorySlug === "indoor-plants" ||
                product.category === "Indoor Plants" ||
                product.careLevel === "Easy" ||
                product.name.toLowerCase().includes("plant") ||
                product.name.toLowerCase().includes("lily")
            );
        }
        if (activeTab === "outdoor") {
            return (
                product.categorySlug === "outdoor-plants" ||
                product.category === "Outdoor Plants" ||
                product.name.toLowerCase().includes("bonsai") ||
                product.name.toLowerCase().includes("bougainvillea")
            );
        }
        if (activeTab === "pots") {
            return (
                product.categorySlug === "pots-planters" ||
                product.category === "Pots & Planters" ||
                product.name.toLowerCase().includes("planter") ||
                product.name.toLowerCase().includes("pot")
            );
        }
        return true;
    });

    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                <Reveal className="relative isolate flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-10">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -z-10 -inset-x-3 sm:-inset-x-6 -inset-y-4 rounded-[3rem] bg-white/60 blur-2xl"
                    />

                    <div className="max-w-3xl space-y-3 sm:space-y-4">
                        <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                            Botanist Recommended
                        </p>
                        <h2
                            style={{ color: GREEN }}
                            className="serif-font text-3xl sm:text-5xl font-bold leading-[1.05] tracking-tight"
                        >
                            Trending & Bestselling Plants
                        </h2>
                        <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
                            Handpicked indoor air purifiers, potted plants, and landscape ornamentals nurtured organically.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        style={{ color: GREEN, borderColor: GREEN }}
                        className="group inline-flex items-center gap-1.5 self-start sm:self-end shrink-0 border-b-2 pb-1 text-base font-semibold"
                    >
                        Shop all plants
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </Reveal>

                <Reveal delay={0.1}>
                    <div className="flex items-center justify-start gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-6 sm:mb-10">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                aria-pressed={activeTab === tab.id}
                                style={activeTab === tab.id ? { backgroundColor: GREEN, borderColor: GREEN } : { color: GREEN, borderColor: `${GREEN}40` }}
                                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border text-sm sm:text-base font-semibold transition whitespace-nowrap touch-active ${activeTab === tab.id
                                    ? "text-white shadow-md shadow-emerald-950/15"
                                    : "bg-white/40 hover:bg-white/80"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </Reveal>

                {loading ? (
                    <div className={GRID}>
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="space-y-3">
                                <div className="aspect-[8/9] bg-emerald-100/70 animate-pulse rounded-md" />
                                <div className="h-5 w-2/3 bg-emerald-100/70 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-emerald-100/70 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-left text-base text-stone-600 py-10">
                        No plants in this collection yet. Check back soon!
                    </p>
                ) : (
                    <RevealGroup key={activeTab} stagger={0.08} delay={0} className={GRID}>
                        {filteredProducts.map((product) => (
                            <Reveal key={product._id} effect="card" className="h-full">
                                <PlantCard product={product} variant="minimal" />
                            </Reveal>
                        ))}
                    </RevealGroup>
                )}
            </section>
        </div>
    );
}

export default FeaturedCollection;