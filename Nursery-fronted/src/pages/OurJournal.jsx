import { Link } from "react-router-dom";
import { ArrowUpRight, Droplets, Leaf, Sun } from "lucide-react";
import { Reveal, RevealGroup } from "../components/Reveal";

const GREEN = "#1f4a34";
const SAGE = "#cfe3c8";

const JOURNAL_NOTES = [
  {
    category: "Plant care",
    title: "A gentler way to water",
    description:
      "Good watering starts with noticing. Check the soil before reaching for your watering can, and let each plant tell you when it is ready.",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Water droplets on the leaves of a green houseplant",
    icon: Droplets,
  },
  {
    category: "Light & living",
    title: "Find the light your plant loves",
    description:
      "A bright room can have many different light levels. Notice where the sun falls through the day to find a comfortable spot for your plant.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Houseplants growing in a softly lit home",
    icon: Sun,
  },
  {
    category: "Growing well",
    title: "Make room for new growth",
    description:
      "New leaves are a lovely sign of progress. Give them space, keep their care consistent, and enjoy the small changes along the way.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Fresh green foliage growing toward the light",
    icon: Leaf,
  },
];

export default function OurJournal() {
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
                The GreenBeli journal
              </p>
            </Reveal>

            <Reveal>
              <h1
                style={{ color: GREEN }}
                className="serif-font text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
              >
                Notes for a greener everyday.
              </h1>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:text-xl">
                A growing collection of simple ideas for living with plants.
                Explore thoughtful care tips, learn to read the little signs
                your plants give you, and make your home feel a little more
                alive.
              </p>
            </Reveal>

            <Reveal>
              <a
                href="#journal-notes"
                style={{ backgroundColor: GREEN }}
                className="group inline-flex items-center gap-2 rounded-md px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:brightness-90 touch-active"
              >
                Explore the journal
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </RevealGroup>

          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-md rounded-bl-md bg-emerald-100/60 shadow-2xl shadow-emerald-950/10 sm:rounded-tl-[7rem] sm:rounded-br-[7rem]">
              <img
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop"
                alt="A collection of leafy houseplants filling a bright space"
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
                Practical inspiration for every kind of plant parent.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="journal-notes"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24"
      >
        <RevealGroup stagger={0.1} className="mb-10 max-w-3xl space-y-4 sm:mb-14">
          <Reveal>
            <p
              style={{ color: GREEN }}
              className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            >
              From the journal
            </p>
          </Reveal>
          <Reveal>
            <h2
              style={{ color: GREEN }}
              className="serif-font text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl"
            >
              Little things that help plants thrive.
            </h2>
          </Reveal>
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
              Start with the basics, follow what feels useful, and let your
              confidence grow one leaf at a time.
            </p>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          stagger={0.12}
          delay={0.05}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {JOURNAL_NOTES.map(
            ({ category, title, description, image, imageAlt, icon: Icon }) => (
              <Reveal
                key={title}
                className="group overflow-hidden rounded-xl border border-stone-200/80 bg-white/75 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              >
                <div className="aspect-[16/10] overflow-hidden bg-emerald-100/60">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: GREEN, backgroundColor: `${SAGE}80` }}
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <p
                      style={{ color: GREEN }}
                      className="text-xs font-bold uppercase tracking-[0.14em]"
                    >
                      {category}
                    </p>
                  </div>
                  <h3
                    style={{ color: GREEN }}
                    className="serif-font text-2xl font-bold leading-snug"
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                    {description}
                  </p>
                </div>
              </Reveal>
            ),
          )}
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
              Find your next favorite
            </p>
            <h2 className="serif-font text-3xl font-bold leading-tight sm:text-5xl">
              A good day can start with a new leaf.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-200/90 sm:text-lg">
              Bring a little more green into your space and let the growing
              begin.
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-md bg-cream px-7 py-4 text-base font-semibold text-[#1f4a34] shadow-lg transition hover:bg-white touch-active"
            >
              Browse our plants
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
