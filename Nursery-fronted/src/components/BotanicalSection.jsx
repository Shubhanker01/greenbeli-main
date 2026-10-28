import { ShieldCheck, Truck, Award, HelpCircle } from "lucide-react"
import { Reveal, RevealGroup } from "./Reveal" // adjust path to where you saved Reveal.jsx

/* Palette from the Figma design (same values as the hero) */
const GREEN = "#1f4a34"
const SAGE = "#cfe3c8"

const FEATURES = [
    {
        icon: ShieldCheck,
        title: "7-Day Transit Guarantee",
        desc: "If your plant arrives damaged or unhealthy, we replace it completely free of charge.",
    },
    {
        icon: Truck,
        title: "Eco Express Shipping",
        desc: "Custom breathable, plastic-free box packaging ensures zero stress delivery.",
    },
    {
        icon: Award,
        title: "100% Organic Soil Mix",
        desc: "Pre-potted with nutrient-rich coco peat, vermicompost & micro-nutrients.",
    },
    {
        icon: HelpCircle,
        title: "Free Botanist Care Help",
        desc: "Direct WhatsApp access to our horticulture team for watering & soil advice.",
    },
]

function BotanicalSection() {
    return (
        <div>
            <section className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* Deep green band: the dark counterpart to the cream sections.
                    The large top-left curve echoes the hero photo.
                    (Plain div on purpose: each block inside reveals on its own scroll position.) */}
                <div
                    style={{ backgroundColor: GREEN, color: "var(--color-cream)" }}
                    className="relative overflow-hidden rounded-tl-[4.5rem] sm:rounded-tl-[8rem] lg:rounded-tl-[10rem] rounded-tr-xl rounded-b-xl shadow-2xl shadow-emerald-950/25 p-6 sm:p-10 lg:p-14"
                >
                    {/* Soft light wash so the green isn't flat */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_60%)]"
                    />

                    <div className="relative z-10">
                        {/* Header: left-aligned like the rest of the Figma sections */}
                        <Reveal className="max-w-4xl mb-10 sm:mb-14 pt-6 sm:pt-4 space-y-3 sm:space-y-4">
                            <p style={{ color: SAGE }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                                GreenBeli Quality Standard
                            </p>
                            <h2 className="serif-font text-3xl sm:text-5xl font-bold leading-[1.1] tracking-tight">
                                Why Thousands Trust{" "}
                                <span style={{ color: SAGE }} className="italic">Our Nursery</span>
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "color-mix(in srgb, var(--color-cream) 78%, transparent)" }}>
                                We take extreme care in growing, packaging, and supporting your plant parent journey.
                            </p>
                        </Reveal>

                        {/* Features: open columns separated by hairlines, no card boxes */}
                        <RevealGroup stagger={0.12} delay={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12">
                            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                                <Reveal
                                    key={title}
                                    className={`group relative ${i > 0 ? "pt-8" : ""} sm:pt-0 ${i > 0 ? "border-t border-white/15 sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l sm:border-white/15 sm:pl-8" : "sm:pr-8"} ${i > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""} ${i < 3 ? "lg:pr-8" : ""}`}
                                >
                                    <div className="flex items-center gap-4 mb-5">
                                        <span
                                            style={{ borderColor: "color-mix(in srgb, var(--color-cream) 30%, transparent)" }}
                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center transition-colors duration-300 group-hover:bg-cream group-hover:text-[#1f4a34]"
                                        >
                                            <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.6} />
                                        </span>
                                        <span style={{ color: SAGE }} className="serif-font text-lg font-bold tracking-widest opacity-70">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <h3 className="serif-font text-xl sm:text-2xl font-bold leading-snug mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-cream) 75%, transparent)" }}>
                                        {desc}
                                    </p>
                                </Reveal>
                            ))}
                        </RevealGroup>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BotanicalSection