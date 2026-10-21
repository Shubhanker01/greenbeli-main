import { ShieldCheck, Truck, Award, HelpCircle } from "lucide-react"
import { Reveal, RevealGroup } from "./Reveal" // adjust path to where you saved Reveal.jsx

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
                {/* Deep terracotta / soil panel: a warm dark counterpart to the light glass sections.
                    (Plain div on purpose: each block inside reveals on its own scroll position.) */}
                <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-orange-950/95 via-stone-900/95 to-stone-950 backdrop-blur-sm text-white shadow-2xl shadow-stone-900/30 border border-orange-900/40 ring-1 ring-white/5 p-5 sm:p-10 lg:p-14">
                    {/* Ambient glows */}
                    <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-orange-600/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-28 -right-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

                    <div className="relative z-10">
                        {/* Header */}
                        <Reveal className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
                            <span className="inline-block bg-orange-500/15 border border-orange-400/30 text-orange-200 text-xs sm:text-sm font-bold px-4 py-1.5 sm:py-2 rounded-full uppercase tracking-wider">
                                GreenBeli Quality Standard
                            </span>
                            <h2 className="serif-font text-3xl sm:text-5xl font-bold leading-tight">
                                Why Thousands Trust{" "}
                                <span className="text-orange-300 italic">Our Nursery</span>
                            </h2>
                            <p className="text-sm sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto">
                                We take extreme care in growing, packaging, and supporting your plant parent journey.
                            </p>
                        </Reveal>

                        {/* Feature cards: reveal one after another */}
                        <RevealGroup stagger={0.12} delay={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                                <Reveal key={title} effect="card" className="h-full">
                                    {/* Reveal owns the entrance transform; this card keeps its own hover lift */}
                                    <div className="group relative h-full overflow-hidden bg-white/5 backdrop-blur-md p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/10 shadow-lg transition duration-300 hover:bg-white/10 hover:border-orange-300/30 hover:-translate-y-1 hover:shadow-2xl">
                                        {/* Faint step number for rhythm */}
                                        <span
                                            aria-hidden="true"
                                            className="serif-font absolute top-3 right-5 text-5xl sm:text-6xl font-bold text-white/[0.06] select-none"
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>

                                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-orange-900/40 mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                                            <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                                        </div>
                                        <h3 className="relative text-lg sm:text-xl font-bold text-orange-50 leading-snug mb-2">
                                            {title}
                                        </h3>
                                        <p className="relative text-sm sm:text-base text-stone-300 leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
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