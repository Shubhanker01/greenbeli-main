import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, Sun, Sprout, Package, HeartHandshake } from "lucide-react";
import { Reveal, RevealGroup } from "./Reveal"; // adjust path to where you saved Reveal.jsx

/* Palette taken from the design: warm cream, deep green, soft sage */
const GREEN = "#1f4a34";
const GREEN_DARK = "#163828";
const CREAM = "#f6f3ea";
const SAGE = "#e8ede1";

const BENEFITS = [
  { icon: Sprout, title: "Grown with care", desc: "Healthy plants, happy beginnings" },
  { icon: Package, title: "Safe travels, little plant", desc: "Thoughtfully packed, delivered to you" },
  { icon: HeartHandshake, title: "A little help to grow", desc: "Real advice from real plant people" },
];

export default function Hero() {
  return (
    <div>
      {/* ---------------------------- Hero ---------------------------- */}
      <section style={{ backgroundColor: CREAM }} className="relative overflow-hidden">
        {/* Soft light wash so the cream isn't flat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.75),transparent_60%)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy (each line reveals one after another) */}
          <RevealGroup stagger={0.12} delay={0.05} className="space-y-6 sm:space-y-7">
            <Reveal>
              <p style={{ color: GREEN }} className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em]">
                A greener everyday starts here
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl sm:text-6xl lg:text-[5.25rem] font-medium leading-[1.02] tracking-tight"
              >
                Make room for a little more life.
              </h1>
            </Reveal>

            <Reveal>
              <p className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-xl">
                Beautiful plants, thoughtful tools, and down-to-earth advice. Everything you need to grow your own
                little corner of green.
              </p>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
              <a
                href="#plant-quiz"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 text-white text-base font-semibold px-7 py-4 rounded-md shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Find your perfect plant
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Keeps the old "Explore All Plants" route reachable; delete if you don't want it */}
              <Link
                to="/products"
                style={{ color: GREEN }}
                className="text-base font-semibold underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-current transition"
              >
                Browse all plants
              </Link>
            </Reveal>

            <Reveal className="flex items-center gap-3 text-sm sm:text-base text-stone-600">
              <span className="flex items-center gap-0.5" role="img" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ color: GREEN, fill: GREEN }} className="w-4 h-4 sm:w-5 sm:h-5" />
                ))}
              </span>
              Loved by 12,500+ growing homes
            </Reveal>
          </RevealGroup>

          {/* Right: photo with the large arched corner */}
          <Reveal effect="rise" duration={0.9} delay={0.25} className="relative">
            <div className="group relative aspect-[4/3] lg:aspect-[6/5] overflow-hidden rounded-tl-[6rem] sm:rounded-tl-[9rem] lg:rounded-tl-[12rem] rounded-tr-lg rounded-b-lg shadow-2xl shadow-stone-900/15">
              <img
                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1400&q=80"
                alt="A healthy monstera plant in a bright, sunlit room"
                width={1400}
                height={1167}
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>

            {/* Floating note card (outside the clipped photo so it never zooms) */}
            <Reveal delay={0.8} className="absolute left-3 bottom-3 sm:left-6 sm:bottom-6 max-w-[18rem]">
              <div
                style={{ backgroundColor: `${CREAM}f2` }}
                className="flex items-center gap-3 sm:gap-4 rounded-lg px-4 py-3 sm:px-5 sm:py-4 shadow-xl backdrop-blur-sm"
              >
                <span
                  style={{ color: GREEN, borderColor: `${GREEN}33` }}
                  className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center"
                >
                  <Sun className="w-5 h-5" />
                </span>
                <div>
                  <p style={{ color: GREEN }} className="text-sm sm:text-base font-bold leading-tight">
                    Good things take growing.
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">Start small. Let nature do the rest.</p>
                </div>
              </div>
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- Benefits strip --------------------------- */}
      <div style={{ backgroundColor: SAGE }}>
        <RevealGroup
          stagger={0.12}
          delay={0.1}
          className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8"
        >
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <Reveal key={title} className="flex items-center gap-4">
              <Icon style={{ color: GREEN }} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" strokeWidth={1.6} />
              <div>
                <p style={{ color: GREEN_DARK }} className="text-base sm:text-lg font-bold leading-snug">
                  {title}
                </p>
                <p className="text-sm sm:text-base text-stone-600">{desc}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}