import { Link } from "react-router-dom";
import { ArrowUpRight, Gift, Heart, Leaf, Sprout } from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const GIFT_BENEFITS = [
  {
    icon: Leaf,
    title: "A gift that keeps growing",
    description:
      "Share the joy of bringing a little more nature into someone’s home.",
  },
  {
    icon: Heart,
    title: "Thoughtful for any occasion",
    description:
      "Celebrate a birthday, a new home, or simply let someone know you’re thinking of them.",
  },
  {
    icon: Sprout,
    title: "Let them choose what grows",
    description:
      "Give them the freedom to find a plant or gardening favorite that feels right for their space.",
  },
];

export default function GiftCards() {
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
                A little something green
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
              >
                Give the gift of growing.
              </h1>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:text-xl">
                Make someone’s day a little greener. A GreenBeli gift card is a
                thoughtful way to share the joy of plants and let someone pick
                a new favorite for their home.
              </p>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
                Looking for a gift card? Get in touch with our team to ask about
                the options currently available and how to arrange one.
              </p>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/contact"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 rounded-md px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Ask about gift cards
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/products"
                style={{ color: GREEN }}
                className="px-2 py-4 text-base font-semibold underline decoration-2 decoration-transparent underline-offset-4 transition hover:decoration-current"
              >
                Browse our plants
              </Link>
            </Reveal>
          </RevealGroup>

          <Reveal delay={0.15} className="relative">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-md rounded-bl-md bg-[#e8ede1] p-6 shadow-2xl shadow-emerald-950/10 sm:rounded-tl-[7rem] sm:rounded-br-[7rem] sm:p-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85),transparent_70%)]"
              />
              <div className="relative w-full max-w-md rotate-[-3deg] rounded-xl border border-white/60 bg-[#1f4a34] p-7 text-cream shadow-2xl shadow-emerald-950/25 sm:p-10">
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div
                    aria-hidden="true"
                    className="absolute -right-14 -top-20 h-56 w-56 rounded-full border border-white/10"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -right-5 -top-12 h-40 w-40 rounded-full border border-white/10"
                  />
                </div>
                <div className="relative flex items-center justify-between">
                  <span className="serif-font text-xl font-bold tracking-tight sm:text-2xl">
                    GreenBeli
                  </span>
                  <Gift
                    aria-hidden="true"
                    className="h-7 w-7 text-[#cfe3c8]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="relative mt-12 sm:mt-16">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#cfe3c8]">
                    A gift to grow
                  </p>
                  <p className="serif-font mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                    A little more life.
                  </p>
                </div>
                <div className="relative mt-8 flex items-center justify-between border-t border-white/20 pt-4 text-xs text-emerald-100/70">
                  <span>For someone special</span>
                  <Leaf className="h-4 w-4 text-[#cfe3c8]" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 left-3 max-w-[230px] rounded-md border border-stone-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:-left-6 sm:p-5">
              <p
                style={{ color: GREEN }}
                className="serif-font text-lg font-bold"
              >
                For every kind of plant lover
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                A thoughtful way to celebrate life’s little milestones.
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
              A gift with room to grow
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Send a little green their way.
            </h2>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3"
        >
          {GIFT_BENEFITS.map(({ icon: Icon, title, description }, index) => (
            <Reveal
              key={title}
              className={`relative ${index > 0 ? "border-t border-stone-300/80 pt-8 sm:border-t-0 sm:pt-0" : ""} ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <span
                style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
              >
                <Icon className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <h3
                style={{ color: GREEN }}
                className="serif-font mb-3 text-xl font-bold sm:text-2xl"
              >
                {title}
              </h3>
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
              Make their day a little greener
            </p>
            <h2 className="serif-font text-3xl font-bold leading-tight sm:text-5xl">
              Have someone special in mind?
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
              Contact us to ask about gift card availability and the best way
              to share a little GreenBeli with them.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-cream px-7 py-4 text-base font-semibold text-[#1f4a34] shadow-lg transition hover:bg-white touch-active"
            >
              Get in touch
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
