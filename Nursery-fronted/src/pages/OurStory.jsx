import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf, Sprout, Sun } from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const PRINCIPLES = [
  {
    icon: Sprout,
    title: "Healthy from the roots up",
    description:
      "We nurture plants in organic growing mixes and give them the time and care they need to arrive ready for your home.",
  },
  {
    icon: Leaf,
    title: "A thoughtful journey home",
    description:
      "Breathable packaging and careful preparation help protect every plant on its way from our nursery to your space.",
  },
  {
    icon: Sun,
    title: "Here as you grow",
    description:
      "A little guidance can make all the difference. Our horticulture team is here to help you care for your plants with confidence.",
  },
];

export default function OurStory() {
  return (
    <div className="min-h-screen overflow-hidden bg-cream pb-20 text-slate-800 sm:pb-28">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.8),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <RevealGroup stagger={0.12} delay={0.05} className="space-y-6 sm:space-y-7">
            <Reveal>
              <p
                style={{ color: GREEN }}
                className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
              >
                The GreenBeli story
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
              >
                A little closer to nature.
              </h1>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:text-xl">
                We believe bringing plants into your home should feel joyful,
                not intimidating. GreenBeli is here to make it easier to find
                your next plant, help it settle in, and enjoy the everyday
                moments of watching it grow.
              </p>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
                That means thoughtful growing, careful delivery, and helpful
                advice whenever you need it. Wherever you are on your plant
                journey, there is always room for a little more green.
              </p>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 rounded-md px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Find your next plant
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/contact"
                style={{ color: GREEN }}
                className="px-2 py-4 text-base font-semibold underline decoration-2 decoration-transparent underline-offset-4 transition hover:decoration-current"
              >
                Get in touch
              </Link>
            </Reveal>
          </RevealGroup>

          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-md rounded-bl-md bg-emerald-100/60 shadow-2xl shadow-emerald-950/10 sm:rounded-tl-[7rem] sm:rounded-br-[7rem]">
              <img
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop"
                alt="Sunlight falling across healthy plants in a greenhouse"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 max-w-[230px] rounded-md border border-stone-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:-left-6 sm:p-5">
              <p
                style={{ color: GREEN }}
                className="serif-font text-lg font-bold"
              >
                Grown with care
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Thoughtful plants and support for the spaces we call home.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <RevealGroup stagger={0.1} className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <Reveal>
            <p
              style={{ color: GREEN }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              What matters to us
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Good plant care starts before your plant gets home.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              From the growing mix to the advice we share, we focus on the
              details that help plants and people thrive together.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3"
        >
          {PRINCIPLES.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              key={title}
              className={`relative ${index > 0 ? "border-t border-stone-300/80 pt-8 sm:border-t-0 sm:pt-0" : ""} ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div
                style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
              >
                <Icon className="h-6 w-6" strokeWidth={1.7} />
              </div>
              <p
                style={{ color: GREEN }}
                className="serif-font mb-3 text-xl font-bold sm:text-2xl"
              >
                {title}
              </p>
              <p className="max-w-md text-base leading-relaxed text-stone-600">
                {description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div
          style={{ backgroundColor: GREEN, color: "var(--color-cream)" }}
          className="relative overflow-hidden rounded-tl-[4.5rem] rounded-tr-xl rounded-b-xl p-7 shadow-2xl shadow-emerald-950/25 sm:rounded-tl-[8rem] sm:p-12 lg:rounded-tl-[10rem] lg:p-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_60%)]"
          />
          <Reveal className="relative z-10 mx-auto max-w-3xl space-y-5 py-5 text-center sm:py-8">
            <p
              style={{ color: SAGE }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              Let’s grow together
            </p>
            <h2 className="serif-font text-3xl font-bold leading-tight sm:text-5xl">
              Make room for a little more life.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
              Find a plant that feels right for your home, and we’ll be here to
              help you care for it.
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-md bg-cream px-7 py-4 text-base font-semibold text-[#1f4a34] shadow-lg transition hover:bg-white touch-active"
            >
              Explore our plants
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
