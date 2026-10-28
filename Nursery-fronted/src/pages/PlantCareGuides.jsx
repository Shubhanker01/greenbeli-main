import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Droplets,
  Leaf,
  Scissors,
  Sprout,
  Sun,
} from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const CARE_GUIDES = [
  {
    id: "watering",
    icon: Droplets,
    title: "Water with intention",
    description:
      "Check the soil before you water. If the top layer is still moist, give it more time. When it feels dry, water slowly until excess drains away, then empty the saucer.",
    tip: "A consistent check is more reliable than watering by the calendar.",
  },
  {
    id: "light",
    icon: Sun,
    title: "Find the right light",
    description:
      "Notice how sunlight moves through your space. Bright indirect light suits many houseplants; direct sun can be helpful for some plants but too strong for others.",
    tip: "If leaves fade, scorch, or stretch, try adjusting the plant's position gradually.",
  },
  {
    id: "soil",
    icon: Sprout,
    title: "Give roots room to breathe",
    description:
      "Choose a pot with drainage and a growing mix suited to your plant. Airy soil helps excess water escape and gives roots space to grow.",
    tip: "Avoid moving a plant into a much larger pot; extra soil can stay wet for too long.",
  },
  {
    id: "grooming",
    icon: Scissors,
    title: "Keep leaves looking their best",
    description:
      "Remove dead or yellowing leaves with clean scissors, and gently dust broad leaves so they can make the most of the light.",
    tip: "Check stems and the undersides of leaves when you water to spot changes early.",
  },
];

export default function PlantCareGuides() {
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
                GreenBeli plant care guides
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
              >
                A little care goes a long way.
              </h1>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:text-xl">
                Plant care doesn’t have to be complicated. Start with a few
                simple habits, pay attention to what your plant is telling you,
                and adjust as it grows.
              </p>
            </Reveal>

            <Reveal>
              <a
                href="#care-guides"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 rounded-md px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Explore the guides
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </RevealGroup>

          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-md rounded-bl-md bg-emerald-100/60 shadow-2xl shadow-emerald-950/10 sm:rounded-tl-[7rem] sm:rounded-br-[7rem]">
              <img
                src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1200&auto=format&fit=crop"
                alt="Healthy green houseplant leaves in soft natural light"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 max-w-[230px] rounded-md border border-stone-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:-left-6 sm:p-5">
              <p
                style={{ color: GREEN }}
                className="serif-font text-lg font-bold"
              >
                Grow at your own pace
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                Every plant—and every home—is a little different.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="care-guides"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24"
      >
        <RevealGroup stagger={0.1} className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <Reveal>
            <p
              style={{ color: GREEN }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              The everyday essentials
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Start with the basics.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              Small, observant routines can help you understand what your plant
              needs through the seasons.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12"
        >
          {CARE_GUIDES.map(({ id, icon: Icon, title, description, tip }) => (
            <Reveal
              key={id}
              id={id}
              className="border-t border-stone-300/80 pt-7 sm:pt-8"
            >
              <div className="mb-5 flex items-center gap-4">
                <span
                  style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3
                  style={{ color: GREEN }}
                  className="serif-font text-xl font-bold sm:text-2xl"
                >
                  {title}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-stone-600">
                {description}
              </p>
              <p className="mt-4 border-l-2 border-emerald-700/40 pl-4 text-sm leading-relaxed text-stone-500">
                {tip}
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
              Need a little more help?
            </p>
            <h2 className="serif-font text-3xl font-bold leading-tight sm:text-5xl">
              Your plant journey is still growing.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
              Explore plants for your space or reach out to our team for
              guidance with your plant-care questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-md bg-cream px-7 py-4 text-base font-semibold text-[#1f4a34] shadow-lg transition hover:bg-white touch-active"
              >
                Ask our team
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10 touch-active"
              >
                Explore plants
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
