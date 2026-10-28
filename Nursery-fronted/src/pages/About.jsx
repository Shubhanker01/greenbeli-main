import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  Sprout, 
  ShieldCheck, 
  Truck, 
  Award, 
  HelpCircle, 
  HeartHandshake, 
  Sun, 
  Leaf, 
  CheckCircle2,
  Users
} from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const GREEN_DARK = "#163828";
const SAGE = "#cfe3c8";

const VALUES = [
  {
    icon: Sprout,
    title: "Nurtured Organically",
    desc: "Every plant is cultivated in healthy organic coco peat and vermicompost mixes with zero harmful chemical growth retardants.",
  },
  {
    icon: Truck,
    title: "Zero-Stress Eco Packaging",
    desc: "Custom-engineered breathable transit boxes protect roots, foliage, and moist soil throughout transit to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "7-Day Transit Guarantee",
    desc: "If any plant arrives in damaged condition or fails to thrive, we replace it immediately with complete peace of mind.",
  },
  {
    icon: HelpCircle,
    title: "Free Botanist Guidance",
    desc: "Our horticulture team provides continuous plant-parent guidance, seasonal feeding schedules, and diagnostic care.",
  },
];

const MILESTONES = [
  { value: "50,000+", label: "Plants Delivered Safely" },
  { value: "12,500+", label: "Happy Growing Homes" },
  { value: "100%", label: "Organic Soil Medium" },
  { value: "4.9 / 5", label: "Botanist Care Rating" },
];

export default function About() {
  return (
    <div className="bg-cream min-h-screen text-slate-800 pb-20 sm:pb-28 overflow-hidden">
      
      {/* ----------------- 1. HERO SECTION ----------------- */}
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.75),transparent_60%)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Text */}
          <RevealGroup stagger={0.12} delay={0.05} className="space-y-6 sm:space-y-7">
            <Reveal>
              <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                Our Botanical Story & Mission
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl sm:text-6xl lg:text-[5rem] font-medium leading-[1.04] tracking-tight"
              >
                Rooted in care. Grown for life.
              </h1>
            </Reveal>

            <Reveal>
              <p className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-xl">
                GreenBeli began with a simple belief: bringing nature indoors shouldn't be stressful or fragile. 
                We nurture strong, healthy plants from sapling to doorstep so your space can thrive effortlessly.
              </p>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 text-white text-base font-semibold px-7 py-4 rounded-md shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Explore Plant Collection
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/contact"
                style={{ color: GREEN }}
                className="text-base font-semibold underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition px-2 py-4"
              >
                Connect with our Botanists
              </Link>
            </Reveal>
          </RevealGroup>

          {/* Right Image (Clean, No Card - Home Page Aesthetic) */}
          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden rounded-tl-[4rem] sm:rounded-tl-[7rem] rounded-br-[4rem] sm:rounded-br-[7rem] rounded-tr-md rounded-bl-md bg-emerald-100/60 shadow-2xl shadow-emerald-950/10">
              <img
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop"
                alt="GreenBeli Greenhouse Nursery"
                className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </div>
            {/* Ambient Accent badge */}
            <div className="absolute -bottom-6 -left-4 sm:bottom-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-md shadow-xl border border-stone-200/80 max-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <Leaf style={{ color: GREEN }} className="w-4 h-4" />
                <span className="text-xs font-bold text-[#1f4a34] uppercase tracking-wider">Horticulture Certified</span>
              </div>
              <p className="text-xs text-stone-600">Nurtured with zero synthetic growth inhibitors.</p>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ----------------- 2. STATS & HERITAGE ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="border-y border-stone-200/80 py-10 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {MILESTONES.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <p style={{ color: GREEN }} className="serif-font text-3xl sm:text-5xl font-bold tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- 3. BOTANICAL JOURNEY / OUR STORY ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <Reveal effect="slide" className="order-2 lg:order-1 relative">
            <div className="aspect-[4/3] overflow-hidden rounded-tr-[4rem] sm:rounded-tr-[6rem] rounded-bl-[4rem] sm:rounded-bl-[6rem] rounded-tl-md rounded-br-md bg-emerald-100/60 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=1200&auto=format&fit=crop"
                alt="Plant foliage up close"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>

          <RevealGroup stagger={0.1} className="order-1 lg:order-2 space-y-6">
            <Reveal>
              <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                How We Grow
              </p>
            </Reveal>

            <Reveal>
              <h2
                style={{ color: GREEN }}
                className="serif-font text-3xl sm:text-5xl font-bold leading-[1.08] tracking-tight"
              >
                From greenhouse roots to living sanctuaries.
              </h2>
            </Reveal>

            <Reveal>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                Most commercial nurseries accelerate growth with synthetic chemicals to look lush on retail shelves, only to droop after you bring them home. At GreenBeli, we take the patient approach.
              </p>
            </Reveal>

            <Reveal>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
                Every plant is acclimated to natural indoor light levels, pre-potted in breathable porous mixes, and inspected individually before dispatch. When you open a GreenBeli box, you receive a plant primed to thrive for years.
              </p>
            </Reveal>

            <Reveal className="pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 style={{ color: GREEN }} className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-stone-700">Root-health inspected before dispatch</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 style={{ color: GREEN }} className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-stone-700">Custom soil formulations by plant type</span>
                </div>
              </div>
            </Reveal>
          </RevealGroup>

        </div>
      </section>

      {/* ----------------- 4. BOTANICAL EXCELLENCE (Deep Green Signature Band) ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div
          style={{ backgroundColor: GREEN, color: "var(--color-cream)" }}
          className="relative overflow-hidden rounded-tl-[4.5rem] sm:rounded-tl-[8rem] lg:rounded-tl-[10rem] rounded-tr-xl rounded-b-xl shadow-2xl shadow-emerald-950/25 p-6 sm:p-10 lg:p-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_60%)]"
          />

          <div className="relative z-10 space-y-12">
            <Reveal className="max-w-3xl space-y-4">
              <p style={{ color: SAGE }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                The GreenBeli Standard
              </p>
              <h2 className="serif-font text-3xl sm:text-5xl font-bold leading-[1.08] tracking-tight">
                Our Four Botanical Guarantees
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-stone-200/90">
                Designed to make plant parenthood joyful, transparent, and resilient for novices and enthusiasts alike.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUES.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#cfe3c8]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="serif-font text-xl font-bold text-white">
                      {val.title}
                    </h3>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 5. INVITATION / CTA ----------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 text-center space-y-6">
        <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
          Begin Your Green Journey
        </p>
        <h2
          style={{ color: GREEN }}
          className="serif-font text-4xl sm:text-6xl font-medium leading-[1.06] tracking-tight"
        >
          Make room for a little more life.
        </h2>
        <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
          Browse our hand-selected botanical collections, or connect with our plant advisors for personalized recommendations tailored to your space.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            to="/products"
            style={{ backgroundColor: GREEN }}
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-md shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active text-base"
          >
            Shop All Plants
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            to="/proposals"
            style={{ color: GREEN, borderColor: GREEN }}
            className="inline-flex items-center gap-2 bg-white/80 border text-base font-semibold px-8 py-4 rounded-md shadow-sm transition hover:bg-white touch-active"
          >
            Custom Landscape Inquiry
          </Link>
        </div>
      </section>

    </div>
  );
}
